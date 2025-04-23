package com.scheduler.scheduler.model;

import java.io.Serializable;
import java.util.Objects;

public class FileMetadataId implements Serializable {

    private String fileId;
    private int chunkId;

    // Required: no-args constructor
    public FileMetadataId() {
    }

    public FileMetadataId(String fileId, int chunkId) {
        this.fileId = fileId;
        this.chunkId = chunkId;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o)
            return true;
        if (!(o instanceof FileMetadataId))
            return false;
        FileMetadataId that = (FileMetadataId) o;
        return chunkId == that.chunkId && Objects.equals(fileId, that.fileId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(fileId, chunkId);
    }
}
