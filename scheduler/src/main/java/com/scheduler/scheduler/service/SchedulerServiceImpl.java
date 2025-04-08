package com.scheduler.scheduler.service;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.google.protobuf.ByteString;

import io.datavault.common.grpc.HeartbeatRequest;
import io.datavault.common.grpc.HeartbeatResponse;
import io.datavault.common.grpc.SchedulerServiceGrpc;
import io.datavault.common.grpc.StoreFileRequest;
import io.datavault.common.grpc.StoreFileResponse;
import io.datavault.common.grpc.WorkerServiceGrpc;
import io.datavault.common.grpc.SchedulerServiceGrpc.SchedulerServiceBlockingStub;
import io.datavault.common.grpc.SchedulerServiceGrpc.SchedulerServiceImplBase;
import io.datavault.common.grpc.WorkerServiceGrpc.WorkerServiceBlockingStub;
import io.grpc.ManagedChannel;
import io.grpc.ManagedChannelBuilder;
import io.grpc.stub.StreamObserver;

@Service
public class SchedulerServiceImpl extends SchedulerServiceImplBase {

    private final Map<String, WorkerEndpoint> endpointMap = new HashMap<>();

    public SchedulerServiceImpl(
            @Value("${worker.endpoints.worker1}") String worker1Endpoint,
            @Value("${worker.endpoints.worker2}") String worker2Endpoint,
            @Value("${worker.endpoints.worker3}") String worker3Endpoint,
            @Value("${worker.endpoints.worker4}") String worker4Endpoint) {
        endpointMap.put("worker1", parseEndpoint(worker1Endpoint));
        endpointMap.put("worker2", parseEndpoint(worker2Endpoint));
        endpointMap.put("worker3", parseEndpoint(worker3Endpoint));
        endpointMap.put("worker4", parseEndpoint(worker4Endpoint));

    }

    private WorkerEndpoint parseEndpoint(String endpoint) {
        String[] parts = endpoint.split(":");
        if (parts.length != 2) {
            throw new IllegalArgumentException("Invalid endpoint format: " + endpoint);
        }
        String host = parts[0];
        int port = Integer.parseInt(parts[1]);
        return new WorkerEndpoint(host, port);
    }

    public StoreFileResponse storeFile(String fileId, String workerId, byte[] fileContent) {
        WorkerEndpoint endpoint = endpointMap.get(workerId);
        if (endpoint == null) {
            throw new IllegalArgumentException("Worker ID not found: " + workerId);
        }
        ManagedChannel channel = ManagedChannelBuilder.forAddress(endpoint.getHost(), endpoint.getPort())
                .usePlaintext()
                .build();

        try {
            WorkerServiceBlockingStub stub = WorkerServiceGrpc.newBlockingStub(channel);
            StoreFileRequest request = StoreFileRequest.newBuilder().setFileId(fileId).setWorkerId(workerId)
                    .setFileContent(ByteString.copyFrom((fileContent))).build();
            return stub.storeFile(request);
        } finally {
            channel.shutdownNow();
        }
    }

    private static class WorkerEndpoint {
        private final String host;
        private final int port;

        public WorkerEndpoint(String host, int port) {
            this.host = host;
            this.port = port;
        }

        public String getHost() {
            return host;
        }

        public int getPort() {
            return port;
        }
    }

    @Override
    public void sendHeartbeat(HeartbeatRequest request, StreamObserver<HeartbeatResponse> response) {
        String workerId = request.getWorkerId();
        WorkerEndpoint endpoint = endpointMap.get(workerId);
        if (endpoint == null) {
            response.onError(new IllegalArgumentException("Worker ID not found: " + workerId));
            return;
        }

        ManagedChannel channel = ManagedChannelBuilder.forAddress(endpoint.getHost(), endpoint.getPort())
                .usePlaintext()
                .build();

        try {
            SchedulerServiceBlockingStub stub = SchedulerServiceGrpc.newBlockingStub(channel);
            HeartbeatResponse heartbeatResponse = stub.sendHeartbeat(request);
            response.onNext(heartbeatResponse);
            response.onCompleted();
        } finally {
            channel.shutdownNow();
        }

    }

}
