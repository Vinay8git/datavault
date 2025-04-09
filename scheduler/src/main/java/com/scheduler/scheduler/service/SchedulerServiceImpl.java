package com.scheduler.scheduler.service;

import java.time.Instant;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.locks.ReentrantLock;

import org.springframework.stereotype.Service;

import com.google.protobuf.ByteString;
import com.scheduler.scheduler.model.WorkerInfo;

import io.datavault.common.grpc.HeartbeatRequest;
import io.datavault.common.grpc.HeartbeatResponse;
import io.datavault.common.grpc.StoreFileRequest;
import io.datavault.common.grpc.StoreFileResponse;
import io.datavault.common.grpc.WorkerServiceGrpc;
import io.datavault.common.grpc.SchedulerServiceGrpc.SchedulerServiceImplBase;
import io.datavault.common.grpc.WorkerServiceGrpc.WorkerServiceBlockingStub;
import io.grpc.ManagedChannel;
import io.grpc.ManagedChannelBuilder;
import io.grpc.stub.StreamObserver;

@Service
public class SchedulerServiceImpl extends SchedulerServiceImplBase {

    private final Map<String, WorkerInfo> workerPool = new ConcurrentHashMap<>();
    private final ReentrantLock lock = new ReentrantLock();
    private final long timeout = 5 * 1000;
    private final AtomicInteger roundRobinCounter = new AtomicInteger(0);

    public void updateWorker(String workerId, String workerAddress) {
        long currentTime = Instant.now().toEpochMilli();
        lock.lock();
        try {
            WorkerInfo worker = workerPool.get(workerId);
            if (worker == null) {
                worker = new WorkerInfo(workerId, workerAddress);
                workerPool.put(workerId, worker);
                System.out.printf("New worker %s added with address %s at time: %d%n", workerId, workerAddress,
                        currentTime);
            } else {
                worker.updateHeartbeat();
                System.out.printf("Heartbeat updated for worker %s at time: %d%n", workerId, currentTime);
            }
        } finally {
            lock.unlock();
        }
    }

    public void cleanInactiveWorkers() {
        long now = Instant.now().toEpochMilli();
        lock.lock();
        try {
            workerPool.entrySet().removeIf(entry -> (now - entry.getValue().getLastHeartbeat()) > timeout);
        } finally {
            lock.unlock();
        }
    }

    public Map<String, String> getActiveWorkers() {
        Map<String, String> activeWorkers = new HashMap<>();
        long now = Instant.now().toEpochMilli();
        lock.lock();
        try {
            workerPool.forEach((workerId, workerInfo) -> {
                if ((now - workerInfo.getLastHeartbeat()) <= timeout) {
                    activeWorkers.put(workerId, workerInfo.getAddress());
                }
            });
        } finally {
            lock.unlock();
        }
        return activeWorkers;
    }

    public StoreFileResponse storeFile(String fileId, String workerId, byte[] fileContent) {
        Map<String, String> activeWorkers = getActiveWorkers();
        if (activeWorkers.isEmpty()) {
            throw new IllegalStateException("No active workers available to store the file.");
        }

        List<String> activeWorkerIds = new ArrayList<>(activeWorkers.keySet());
        int index = roundRobinCounter.getAndIncrement() % activeWorkerIds.size();
        String selectedWorkerId = activeWorkerIds.get(index);
        String address = activeWorkers.get(selectedWorkerId);

        String[] parts = address.split(":");
        String host = parts[0];
        int port = Integer.parseInt(parts[1]);
        ManagedChannel channel = ManagedChannelBuilder.forAddress(host, port).usePlaintext().build();

        try {
            WorkerServiceBlockingStub stub = WorkerServiceGrpc.newBlockingStub(channel);
            StoreFileRequest request = StoreFileRequest.newBuilder().setFileId(fileId).setWorkerId(workerId)
                    .setFileContent(ByteString.copyFrom((fileContent))).build();
            return stub.storeFile(request);
        } finally {
            channel.shutdownNow();
        }
    }

    @Override
    public void sendHeartbeat(HeartbeatRequest request, StreamObserver<HeartbeatResponse> response) {
        String workerId = request.getWorkerId();
        String address = request.getAddress();
        updateWorker(workerId, address);
        HeartbeatResponse heartbeatResponse = HeartbeatResponse.newBuilder().setAcknowledged(true)
                .setMessage("Heartbeat received for worker: " + workerId).build();
        response.onNext(heartbeatResponse);
        response.onCompleted();
    }

}
