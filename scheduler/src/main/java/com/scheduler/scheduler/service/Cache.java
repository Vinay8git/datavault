package com.scheduler.scheduler.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import java.io.IOException;
import java.nio.file.*;
import java.util.Iterator;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class Cache {

    @Value("${file.storage.temp-dir}")
    private String tempDirPath;

    private final ConcurrentHashMap<String, FileMetadata> fileMetadataMap = new ConcurrentHashMap<>();

    public static class FileMetadata {
        private final String workerId;
        private final String filePath;

        public FileMetadata(String workerId, String filePath) {
            this.workerId = workerId;
            this.filePath = filePath;
        }

        public String getWorkerId() {
            return workerId;
        }

        public String getFilePath() {
            return filePath;
        }
    }

    public String storeFile(String fileId, String workerId, byte[] fileData) throws IOException {
        Path tempDir = Paths.get(tempDirPath);

        if (!Files.exists(tempDir)) {
            Files.createDirectories(tempDir);
        }

        Path filePath = tempDir.resolve(fileId + "_" + workerId + ".tmp");

        Files.write(filePath, fileData, StandardOpenOption.CREATE);

        fileMetadataMap.put(fileId, new FileMetadata(workerId, filePath.toString()));

        return filePath.toString();
    }

    public FileMetadata getFileMetadata(String fileId) {
        return fileMetadataMap.get(fileId);
    }

    public byte[] getFileContent(String fileId) throws IOException {
        FileMetadata metadata = fileMetadataMap.get(fileId);
        if (metadata == null) {
            throw new IOException("File not found in cache");
        }
        return Files.readAllBytes(Paths.get(metadata.getFilePath()));
    }

    public String getWorkerId(String fileId) {
        FileMetadata metadata = fileMetadataMap.get(fileId);
        return (metadata != null) ? metadata.getWorkerId() : null;
    }

    public void removeFile(String fileId) throws IOException {
        FileMetadata metadata = fileMetadataMap.remove(fileId);
        if (metadata != null) {
            Files.deleteIfExists(Paths.get(metadata.getFilePath()));
        }
    }

    public Map.Entry<String, FileMetadata> getAndRemoveCurrentFile() {
        synchronized (fileMetadataMap) {
            Iterator<Map.Entry<String, FileMetadata>> iterator = fileMetadataMap.entrySet().iterator();
            if (iterator.hasNext()) {
                Map.Entry<String, FileMetadata> entry = iterator.next();
                iterator.remove();
                return entry;
            }
        }
        return null;
    }
}
