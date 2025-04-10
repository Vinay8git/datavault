package com.worker.worker.service;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.Base64;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

import com.worker.worker.model.ChunkTask;

import io.datavault.common.grpc.HeartbeatRequest;
import io.datavault.common.grpc.RetrieveFileRequest;
import io.datavault.common.grpc.RetrieveFileResponse;
import io.datavault.common.grpc.SchedulerServiceGrpc;
import io.datavault.common.grpc.StoreFileRequest;
import io.datavault.common.grpc.StoreFileResponse;
import io.datavault.common.grpc.WorkerServiceGrpc.WorkerServiceImplBase;
import io.grpc.ManagedChannel;
import io.grpc.ManagedChannelBuilder;
import io.grpc.stub.StreamObserver;
import jakarta.annotation.PostConstruct;

public class WorkerServiceImpl extends WorkerServiceImplBase {

    private SchedulerServiceGrpc.SchedulerServiceBlockingStub schedulerServiceClient;
    private final ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(1);

    @Override
    public void retrieveFile(RetrieveFileRequest request, StreamObserver<RetrieveFileResponse> responseObserver) {
        String workerId = request.getWorkerId();
        String fileId = request.getFileId();
        String storagePath = "app/storage/" + workerId + "/" + fileId + ".dat";

        File file = new File(storagePath);
        if (!file.exists()) {
            RetrieveFileResponse response = RetrieveFileResponse.newBuilder().setFound(false).build();

            responseObserver.onNext(response);
            responseObserver.onCompleted();
            return;
        }

        byte[] fileContent = new byte[(int) file.length()];
        try (FileInputStream fis = new FileInputStream(file)) {
            fis.read(fileContent);
        } catch (IOException e) {
            RetrieveFileResponse response = RetrieveFileResponse.newBuilder().build();

            responseObserver.onNext(response);
            responseObserver.onCompleted();
            return;
        }

        RetrieveFileResponse response = RetrieveFileResponse.newBuilder()
                .setFileContent(com.google.protobuf.ByteString.copyFrom(fileContent)).build();

        responseObserver.onNext(response);
        responseObserver.onCompleted();
    }

    public void sendHeartbeat() throws Exception {
        String workerId = System.getenv("WORKER_ID");
        String host = System.getenv("HOST");
        String port = System.getenv("PORT");

        if (workerId == null || host == null || port == null) {
            System.err.println("Missing environment variables: WORKER_ID, HOST, or PORT");
            return;
        }

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
    public void storeChunk(String fileId, int chunkId, byte[] data, String workerId) {
        try {
            File baseDir = new File("chunks/" + workerId + "/" + fileId);
            if (!baseDir.exists()) {
                baseDir.mkdirs();
            }

            File chunkFile = new File(baseDir, "chunk_" + chunkId + ".part");
            try (FileOutputStream fos = new FileOutputStream(chunkFile)) {
                fos.write(data);
            }

            System.out.println("Successfully stored chunk " + chunkId + " for file " + fileId + " at "
                    + chunkFile.getAbsolutePath());
        } catch (IOException e) {
            System.err.println("Failed to store chunk " + chunkId + " for file " + fileId);
            e.printStackTrace();
        }
    }

}
