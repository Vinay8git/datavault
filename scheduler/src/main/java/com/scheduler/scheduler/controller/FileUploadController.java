package com.scheduler.scheduler.controller;

import java.time.LocalDateTime;

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

@RestController
@RequestMapping("/files")
public class FileUploadController {

    @Autowired
    private FileMetadataRepository metadataRepository;

    @PostMapping("/upload")
    public ResponseEntity<String> uploadFile(@RequestParam("file") MultipartFile file) {
        try {
            FileMetadata metadata = new FileMetadata();
            metadata.setFilename(file.getOriginalFilename());
            metadata.setSize(file.getSize());
            metadata.setUploadTime(LocalDateTime.now());

            metadataRepository.save(metadata);
            return ResponseEntity.ok("File uploaded and metadata saved successfully.");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error processing the file.");
        }

    }

}
