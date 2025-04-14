package com.worker.worker.service;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.Base64;

import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.protobuf.ByteString;
import com.worker.worker.model.ChunkTask;

import io.datavault.common.grpc.AssignWorkerRequest;
import io.datavault.common.grpc.AssignWorkerResponse;
import io.datavault.common.grpc.SchedulerServiceGrpc;
import io.datavault.common.grpc.StoreChunkRequest;
import io.datavault.common.grpc.StoreChunkResponse;
import io.datavault.common.grpc.WorkerServiceGrpc;
import io.grpc.ManagedChannel;
import io.grpc.ManagedChannelBuilder;

@Service
public class ChunkTaskConsumer {
    private final SchedulerServiceGrpc.SchedulerServiceBlockingStub schedulerStub;
    private final ObjectMapper objectMapper = new ObjectMapper();
    private final String currentWorkerId = System.getenv("WORKER_ID");

    public ChunkTaskConsumer(WorkerServiceImpl workerService,
            SchedulerServiceGrpc.SchedulerServiceBlockingStub schedulerStub) {
        this.schedulerStub = schedulerStub;
    }

    @RabbitListener(queues = "chunk_task_queue")
    public void handleTask(String message) {
        try {

            ChunkTask task = objectMapper.readValue(message, ChunkTask.class);
            System.out.println("Received chunk task from queue: " + task);

            byte[] data = Base64.getDecoder().decode(task.getEncodedData());

            AssignWorkerRequest request = AssignWorkerRequest.newBuilder()
                    .setRequesterWorkerId(currentWorkerId)
                    .setFileId(task.getFileId())
                    .setChunkId(task.getChunkId())
                    .build();
            AssignWorkerResponse response = schedulerStub.assignWorkerForChunk(request);
            String assignedWorkerId = response.getAssignedWorkerId();
            String assignedWorkerAddress = response.getAssignedWorkerAddress();

            if (assignedWorkerId.equals(currentWorkerId)) {
                System.out.printf("This worker (%s) is assigned for file %s, chunk %d. Storing locally.%n",
                        currentWorkerId, task.getFileId(), task.getChunkId());
                storeChunkLocally(task.getFileId(), task.getChunkId(), data, currentWorkerId);
            } else {
                System.out.printf(
                        "This worker (%s) is not assigned for file %s, chunk %d. Forwarding to worker %s at %s.%n",
                        currentWorkerId, task.getFileId(), task.getChunkId(), assignedWorkerId, assignedWorkerAddress);
                forwardChunkToRemote(task.getFileId(), task.getChunkId(), data, assignedWorkerId,
                        assignedWorkerAddress);
            }
        } catch (Exception e) {
            System.err.println("Failed to process chunk task: " + e.getMessage());
            e.printStackTrace();
        }
    }

    private void forwardChunkToRemote(String fileId, int chunkId, byte[] data, String assignedWorkerId,
            String assignedWorkerAddress) {
        ManagedChannel channel = null;
        try {
            channel = ManagedChannelBuilder.forTarget(assignedWorkerAddress)
                    .usePlaintext()
                    .build();

            WorkerServiceGrpc.WorkerServiceBlockingStub remoteStub = WorkerServiceGrpc.newBlockingStub(channel);

            StoreChunkRequest request = StoreChunkRequest.newBuilder()
                    .setWorkerId(assignedWorkerId)
                    .setFileId(fileId)
                    .setChunkId(chunkId)
                    .setChunkData(ByteString.copyFrom(data))
                    .build();

            StoreChunkResponse response = remoteStub.storeChunk(request);

            if (response.getSuccess()) {
                System.out.printf("Successfully forwarded and stored chunk %d for file %s on remote worker %s (%s)%n",
                        chunkId, fileId, assignedWorkerId, assignedWorkerAddress);
            } else {
                System.err.printf("Remote worker %s (%s) failed to store chunk %d for file %s: %s%n",
                        assignedWorkerId, assignedWorkerAddress, chunkId, fileId, response.getMessage());
            }
        } catch (Exception e) {
            System.err.printf("Error forwarding chunk %d for file %s to worker %s at %s%n",
                    chunkId, fileId, assignedWorkerId, assignedWorkerAddress);
            e.printStackTrace();
        } finally {
            if (channel != null) {
                channel.shutdownNow();
            }
        }
    }

    public void storeChunkLocally(String fileId, int chunkId, byte[] data, String workerId) {
        try {
            File baseDir = new File("app/storage/" + workerId);
            if (!baseDir.exists()) {
                baseDir.mkdirs();
            }
            File chunkFile = new File(baseDir, "chunk_" + chunkId + ".chunk");
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
