package com.worker.worker.service;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;

import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

import org.springframework.stereotype.Service;

import io.datavault.common.grpc.HeartbeatRequest;
import io.datavault.common.grpc.RetrieveChunkRequest;
import io.datavault.common.grpc.RetrieveChunkResponse;

import io.datavault.common.grpc.SchedulerServiceGrpc;
import io.datavault.common.grpc.StoreChunkRequest;
import io.datavault.common.grpc.StoreChunkResponse;
import io.datavault.common.grpc.WorkerServiceGrpc.WorkerServiceImplBase;
import io.grpc.ManagedChannel;
import io.grpc.ManagedChannelBuilder;
import io.grpc.stub.StreamObserver;
import jakarta.annotation.PostConstruct;

@Service
public class WorkerServiceImpl extends WorkerServiceImplBase {

    private SchedulerServiceGrpc.SchedulerServiceBlockingStub schedulerServiceClient;
    private final ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(1);

    @Override
    public void retrieveChunk(RetrieveChunkRequest request, StreamObserver<RetrieveChunkResponse> responseObserver) {
        String workerId = request.getWorkerId();
        String fileId = request.getFileId();
        int chunkId = request.getChunkId();

        String storagePath = "app/storage/" + workerId + "/" + fileId + "_" + chunkId + ".chunk";

        File file = new File(storagePath);
        if (!file.exists()) {
            RetrieveChunkResponse response = RetrieveChunkResponse.newBuilder()
                    .setFound(false)
                    .build();

            responseObserver.onNext(response);
            responseObserver.onCompleted();
            return;
        }

        try (FileInputStream fis = new FileInputStream(file)) {
            byte[] fileContent = fis.readAllBytes();

            RetrieveChunkResponse response = RetrieveChunkResponse.newBuilder()
                    .setFound(true)
                    .setChunkData(com.google.protobuf.ByteString.copyFrom(fileContent))
                    .build();

            responseObserver.onNext(response);
            responseObserver.onCompleted();
        } catch (IOException e) {
            System.err.println("Failed to read chunk: " + e.getMessage());
            RetrieveChunkResponse response = RetrieveChunkResponse.newBuilder()
                    .setFound(false)
                    .build();

            responseObserver.onNext(response);
            responseObserver.onCompleted();
        }
    }

    public void sendHeartbeat() throws Exception {
        String workerId = System.getenv("WORKER_ID");
        String host = System.getenv("HOST");
        String port = System.getenv("PORT");

        String address = host + ":" + port;
        HeartbeatRequest request = HeartbeatRequest.newBuilder().setWorkerId(workerId).setAddress(address).build();
        try {
            System.out.println("Sending heartbeat request: " + request);
            schedulerServiceClient.sendHeartbeat(request);
            System.out.println("heartbeat request sent successfully.");
        } catch (Exception e) {
            System.err.println("Failed to send heartbeat: " + e.getMessage());
        }
    }

    @PostConstruct
    public void init() {
        String schedulerHost = System.getenv("SCHEDULER_HOST");
        int schedulerPort = Integer.parseInt(System.getenv("SCHEDULER_PORT"));
        ManagedChannel channel = ManagedChannelBuilder.forAddress(schedulerHost, schedulerPort).usePlaintext().build();
        schedulerServiceClient = SchedulerServiceGrpc.newBlockingStub(channel);
        System.out.println("Scheduler service client initialized.");
        scheduler.scheduleAtFixedRate(() -> {
            try {
                sendHeartbeat();
            } catch (Exception e) {
                System.out.println("Failed to send heartbeat: " + e.getMessage());
            }
        }, 0, 5, TimeUnit.SECONDS);
    }

    @Override
    public void storeChunk(StoreChunkRequest request, StreamObserver<StoreChunkResponse> responseObserver) {
        String workerId = request.getWorkerId();
        String fileId = request.getFileId();
        int chunkId = request.getChunkId();
        byte[] chunkData = request.getChunkData().toByteArray();

        File baseDir = new File("app/storage/" + workerId);
        if (!baseDir.exists()) {
            baseDir.mkdirs();
        }
        File chunkFile = new File(baseDir, fileId + "_" + chunkId + ".chunk");
        try (FileOutputStream fos = new FileOutputStream(chunkFile)) {
            fos.write(chunkData);
            fos.flush();
            StoreChunkResponse response = StoreChunkResponse.newBuilder().setSuccess(true).build();
            responseObserver.onNext(response);
            responseObserver.onCompleted();
            System.out.println("Chunk stored successfully: " + chunkFile.getAbsolutePath());
        } catch (IOException e) {
            System.err.println("Failed to store chunk: " + e.getMessage());
            StoreChunkResponse response = StoreChunkResponse.newBuilder().setSuccess(false).build();
            responseObserver.onNext(response);
            responseObserver.onCompleted();
            return;
        }
    }

}
