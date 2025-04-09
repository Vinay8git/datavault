package com.scheduler.scheduler.repositoty;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import com.scheduler.scheduler.model.FileMetadata;

@Repository
public interface FileMetadataRepository extends CrudRepository<FileMetadata, String> {
    FileMetadata findByFilename(String fileName);
}
