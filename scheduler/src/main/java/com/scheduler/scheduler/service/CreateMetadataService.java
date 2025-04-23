package com.scheduler.scheduler.service;

import com.scheduler.scheduler.model.FileMetadata;
import com.scheduler.scheduler.repository.FileMetadataRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Objects;

@Service
public class CreateMetadataService {

    @Autowired
    private FileMetadataRepository fileMetadataRepository;

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public FileMetadata createMetadata(String fileId, String filename, long size, LocalDateTime uploadTime) {
        Objects.requireNonNull(fileId, "fileId must not be null");
        Objects.requireNonNull(filename, "filename must not be null");

        FileMetadata metadata = new FileMetadata(fileId, filename, size);
        metadata.setUploadTime(uploadTime);

        return fileMetadataRepository.save(metadata);
    }
}
