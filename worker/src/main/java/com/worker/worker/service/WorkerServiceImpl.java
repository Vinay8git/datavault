package com.worker.worker.service;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import io.datavault.common.grpc.HeartbeatRequest;
import io.datavault.common.grpc.RetrieveChunkRequest;
import io.datavault.common.grpc.RetrieveChunkResponse;
import io.datavault.common.grpc.SchedulerServiceGrpc;
import io.datavault.common.grpc.StoreChunkRequest;
import io.datavault.common.grpc.StoreChunkResponse;
import io.datavault.common.grpc.WorkerServiceGrpc.WorkerServiceImplBase;
import io.grpc.stub.StreamObserver;
import jakarta.annotation.PostConstruct;
import jakarta.annotation.PreDestroy;

@Service
public class WorkerServiceImpl extends WorkerServiceImplBase {

    private final SchedulerServiceGrpc.SchedulerServiceBlockingStub schedulerServiceClient;
    private final ScheduledExecutorService heartbeatScheduler = Executors.newScheduledThreadPool(1);

    @Value("${WORKER_ID:#{systemEnvironment['WORKER_ID'] ?: 'worker1'}}")
    private String workerId;

    @Value("${HOST:#{systemEnvironment['HOST'] ?: 'localhost'}}")
    private String host;

    @Value("${PORT:#{systemEnvironment['PORT'] ?: '5000'}}")
    private String port;

    public WorkerServiceImpl(SchedulerServiceGrpc.SchedulerServiceBlockingStub schedulerServiceClient) {
        this.schedulerServiceClient = schedulerServiceClient;
    }

    @PostConstruct
    public void startHeartbeat() {
        System.out.println("Starting heartbeat scheduler for worker " + workerId);
        heartbeatScheduler.scheduleAtFixedRate(() -> {
            try {
                sendHeartbeat();
            } catch (Exception e) {
                System.err.println("Failed to send heartbeat: " + e.getMessage());
            }
        }, 0, 5, TimeUnit.SECONDS);
    }

    @PreDestroy
    public void shutdown() {
        heartbeatScheduler.shutdown();
        try {
            if (!heartbeatScheduler.awaitTermination(5, TimeUnit.SECONDS)) {
                heartbeatScheduler.shutdownNow();
            }
        } catch (InterruptedException e) {
            heartbeatScheduler.shutdownNow();
            Thread.currentThread().interrupt();
        }
    }

    @Override
    public void retrieveChunk(RetrieveChunkRequest request, StreamObserver<RetrieveChunkResponse> responseObserver) {
        String reqWorkerId = request.getWorkerId();
        String fileId = request.getFileId();
        int chunkId = request.getChunkId();

        String storagePath = "app/storage/" + reqWorkerId + "/" + fileId + "_" + chunkId + ".chunk";

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

    public void sendHeartbeat() {
        String address = host + ":" + port;
        HeartbeatRequest request = HeartbeatRequest.newBuilder()
                .setWorkerId(workerId)
                .setAddress(address)
                .build();
        try {
            System.out.println("Sending heartbeat request: " + request);
            schedulerServiceClient.sendHeartbeat(request);
            System.out.println("Heartbeat request sent successfully.");
        } catch (Exception e) {
            System.err.println("Failed to send heartbeat: " + e.getMessage());
        }
    }

    @Override
    public void storeChunk(StoreChunkRequest request, StreamObserver<StoreChunkResponse> responseObserver) {
        String reqWorkerId = request.getWorkerId();
        String fileId = request.getFileId();
        int chunkId = request.getChunkId();
        byte[] chunkData = request.getChunkData().toByteArray();

        File baseDir = new File("app/storage/" + reqWorkerId);
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
        }
    }
}
