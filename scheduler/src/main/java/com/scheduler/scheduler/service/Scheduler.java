package com.scheduler.scheduler.service;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import io.datavault.common.grpc.StoreFileResponse;

@Service
public class Scheduler {

    @Autowired
    private Cache cache;

    @Autowired
    private SchedulerServiceImpl workerServiceClient;

    public void processNextFile() {
        Map.Entry<String, Cache.FileMetadata> entry = cache.getAndRemoveCurrentFile();
        if (entry == null) {
            System.out.println("No files available to process.");
            return;
        }
        String fileId = entry.getKey();
        Cache.FileMetadata metadata = entry.getValue();

        try {
            byte[] fileContent = cache.getFileContent(fileId);
            StoreFileResponse response = workerServiceClient.storeFile(fileId, metadata.getWorkerId(), fileContent);
            if (response.getSuccess()) {
                System.out.println("File " + fileId + " stored successfully on " + metadata.getWorkerId());
            } else {
                System.out.println("Failed to store file " + fileId + ": " + response.getMessage());
            }
        } catch (Exception e) {
            System.out.println("Error processing file " + fileId + ": " + e.getMessage());
        }
    }
}
