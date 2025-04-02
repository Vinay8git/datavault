package com.worker.worker.service;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;

import io.datavault.common.grpc.StoreFileRequest;
import io.datavault.common.grpc.StoreFileResponse;
import io.datavault.common.grpc.WorkerServiceGrpc.WorkerServiceImplBase;
import io.grpc.stub.StreamObserver;

public class WorkerServiceImpl extends WorkerServiceImplBase {

    @Override
    public void storeFile(StoreFileRequest request, StreamObserver<StoreFileResponse> responseObserver) {
        String workerId = request.getWorkerId();
        String fileId = request.getFileId();
        byte[] fileContent = request.getFileContent().toByteArray();
        String storagePath = "app/storage/" + request.getWorkerId();

        File dir = new File(storagePath);
        if (!dir.exists()) {
            dir.mkdirs();
        }

        String filePath = storagePath + "/" + fileId + ".dat";
        File file = new File(filePath);

        try (FileOutputStream fos = new FileOutputStream(file)) {
            fos.write(fileContent);
            fos.flush();

            StoreFileResponse response = StoreFileResponse.newBuilder().setSuccess(true)
                    .setMessage("file stored successfully on " + workerId).build();

            responseObserver.onNext(response);
            responseObserver.onCompleted();
        } catch (IOException e) {
            StoreFileResponse response = StoreFileResponse.newBuilder().setSuccess(false)
                    .setMessage("Error storing file: " + e.getMessage()).build();

            responseObserver.onNext(response);
            responseObserver.onCompleted();
        }
    }
}
