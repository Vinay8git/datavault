package com.scheduler.scheduler.controller;

import java.io.InputStream;
import java.util.Arrays;
import java.util.UUID;

import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.scheduler.scheduler.config.RabbitMQConfig;
import com.scheduler.scheduler.model.ChunkTask;
import com.scheduler.scheduler.model.FileMetadata;
import com.scheduler.scheduler.repositoty.FileMetadataRepository;

import io.datavault.common.grpc.WorkerServiceGrpc;
import io.datavault.common.grpc.RetrieveFileRequest;
import io.datavault.common.grpc.RetrieveFileResponse;
import io.grpc.ManagedChannel;
import io.grpc.ManagedChannelBuilder;

@RestController
@RequestMapping("/files")
public class FileUploadController {

    @Autowired
    private FileMetadataRepository metadataRepository;

    @Autowired
    private RabbitTemplate rabbitTemplate;

    @PostMapping("/uploadFile")
    public String uploadFile(@RequestParam("file") MultipartFile file) {

        String fileId = UUID.randomUUID().toString();
        int chunkSize = 128 * 1024;
        byte[] buffer = new byte[chunkSize];
        int chunkId = 0;

        try (InputStream inputStream = file.getInputStream()) {
            int bytesRead;
            while ((bytesRead = inputStream.read(buffer)) != -1) {
                byte[] actualChunk = Arrays.copyOf(buffer, bytesRead);
                String encodedData = java.util.Base64.getEncoder().encodeToString(actualChunk);
                ChunkTask chunkTask = new ChunkTask(fileId, chunkId, encodedData);
                rabbitTemplate.convertAndSend(RabbitMQConfig.CHUNK_QUEUE, chunkTask);
                chunkId++;
            }
        } catch (Exception e) {
            e.printStackTrace();
            return "Error occurred while uploading the file: " + e.getMessage();
        }
        return "Upload successful. Total chunks sent: " + chunkId;
    }

    @GetMapping("/getFile")
    public ResponseEntity<byte[]> getFile(@RequestParam String name) {
        FileMetadata metadata = metadataRepository.findByFilename(name);
        if (metadata == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }

        String fileId = metadata.getId();
        String workerId = metadata.getWorkerId();
        String workerAddress = metadata.getWorkerAddress();

        if (workerAddress == null || !workerAddress.contains(":")) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(null);
        }

        String[] parts = workerAddress.split(":");
        if (parts.length != 2) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(null);
        }

        String host = parts[0];
        int port;
        try {
            port = Integer.parseInt(parts[1]);
        } catch (NumberFormatException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(null);
        }

        ManagedChannel channel = ManagedChannelBuilder.forAddress(host, port)
                .usePlaintext()
                .build();

        try {
            WorkerServiceGrpc.WorkerServiceBlockingStub stub = WorkerServiceGrpc.newBlockingStub(channel);

            RetrieveFileRequest request = RetrieveFileRequest.newBuilder()
                    .setFileId(fileId)
                    .setWorkerId(workerId)
                    .build();

            RetrieveFileResponse response = stub.retrieveFile(request);

            if (!response.getFound()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
            }

            return ResponseEntity.ok()
                    .header("Content-Disposition", "attachment; filename=\"" + metadata.getFilename() + "\"")
                    .body(response.getFileContent().toByteArray());
        } finally {
            channel.shutdownNow();
        }
    }
}
