package com.scheduler.scheduler.controller;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.Comparator;
import java.util.List;
import java.util.UUID;

import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
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
        int chunkCount = 0;
        try (InputStream inputStream = file.getInputStream()) {
            int bytesRead;
            while ((bytesRead = inputStream.read(buffer)) != -1) {
                byte[] actualChunk = Arrays.copyOf(buffer, bytesRead);
                String encodedData = java.util.Base64.getEncoder().encodeToString(actualChunk);
                ChunkTask chunkTask = new ChunkTask(fileId, chunkCount, encodedData);
                rabbitTemplate.convertAndSend(RabbitMQConfig.CHUNK_QUEUE, chunkTask);
                chunkCount++;
            }
            FileMetadata metadata = new FileMetadata(fileId, chunkCount, file.getOriginalFilename(), file.getSize());
            metadata.setUploadTime(LocalDateTime.now());
            metadataRepository.save(metadata);
        } catch (Exception e) {
            e.printStackTrace();
            return "Error occurred while uploading the file: " + e.getMessage();
        }
        return "Upload successful. Total chunks sent: " + chunkCount;
    }

    @GetMapping("/getFile")
    public ResponseEntity<byte[]> getFile(@RequestParam String name) {
        FileMetadata metadata = metadataRepository.findByFilename(name);
        if (metadata == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }

        String fileId = metadata.getFileId();

        try {
            byte[] fileContent = chunkAssembler(fileId);
            if (fileContent == null) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
            }
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
            headers.setContentDispositionFormData("attachment", name);

            return ResponseEntity.ok().headers(headers).body(fileContent);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    private byte[] chunkAssembler(String fileId) throws IOException {
        List<FileMetadata> metadataList = metadataRepository.findAllFileId(fileId);

        if (metadataList.isEmpty()) {
            throw new FileNotFoundException("No metadata found for file: " + fileId);
        }
        metadataList.sort(Comparator.comparingInt(FileMetadata::getChunkId));

        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        for (FileMetadata metadata : metadataList) {
            int chunkId = metadata.getChunkId();
            String workerId = metadata.getWorkerId();

            File chunkFile = new File("app/storage" + workerId + "/" + fileId + "_" + chunkId + ".chunk");

            if (!chunkFile.exists()) {
                throw new FileNotFoundException("Missing chunk file: " + chunkFile.getAbsolutePath());
            }

            Files.copy(chunkFile.toPath(), outputStream);
        }
        return outputStream.toByteArray();
    }
}
