package com.scheduler.scheduler.repositoty;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.scheduler.scheduler.model.FileMetadata;

@Repository
public interface FileMetadataRepository extends JpaRepository<FileMetadata, String> {
    FileMetadata findByFilename(String fileName);

    List<FileMetadata> findAllFileId(String fileId);

    Optional<FileMetadata> findByFileIdAndChunkId(String fileId, int chunkId);

}
