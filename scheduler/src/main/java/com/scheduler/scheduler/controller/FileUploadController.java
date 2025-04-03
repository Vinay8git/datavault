package com.scheduler.scheduler.controller;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicInteger;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.scheduler.scheduler.model.FileMetadata;
import com.scheduler.scheduler.repositoty.FileMetadataRepository;
import com.scheduler.scheduler.service.Cache;

@RestController
@RequestMapping("/files")
public class FileUploadController {

    private final List<String> workerIds = List.of("worker1", "worker2", "worker3", "worker4");
    private final AtomicInteger counter = new AtomicInteger(0);

    @Autowired
    private Cache cache;

    @Autowired
    private FileMetadataRepository metadataRepository;

    @PostMapping("/upload")
    public ResponseEntity<String> uploadFile(@RequestParam("file") MultipartFile file) {
        try {
            String fileId = UUID.randomUUID().toString();
            String assignedWorker = allocateWorker();
            cache.storeFile(fileId, assignedWorker, file.getBytes());
            FileMetadata metadata = new FileMetadata();

            metadata.setFilename(file.getOriginalFilename());
            metadata.setSize(file.getSize());
            metadata.setUploadTime(LocalDateTime.now());
            metadata.setWorkerId(assignedWorker);
            metadataRepository.save(metadata);
            return ResponseEntity.ok("File uploaded and metadata saved successfully.");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error processing the file.");
        }

    }

    public String allocateWorker() {
        return workerIds.get(counter.getAndUpdate(i -> (i + 1) % workerIds.size()));
    }

}
