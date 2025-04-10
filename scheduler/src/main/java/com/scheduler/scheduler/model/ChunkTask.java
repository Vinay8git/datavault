package com.scheduler.scheduler.model;

import java.io.Serializable;

public class ChunkTask implements Serializable {
    private static final long serialVersionUID = 1L;

    private String fileId;
    private int chunkId;
    private String encodedData;

    public ChunkTask() {
    }

    public ChunkTask(String fileId, int chunkId, String encodedData) {
        this.fileId = fileId;
        this.chunkId = chunkId;
        this.encodedData = encodedData;
    }

    public String getFileId() {
        return fileId;
    }

    public void setFileId(String fileId) {
        this.fileId = fileId;
    }

    public int getChunkId() {
        return chunkId;
    }

    public void setChunkId(int chunkId) {
        this.chunkId = chunkId;
    }

    public String getEncodedData() {
        return encodedData;
    }

    public void setEncodedData(String encodedData) {
        this.encodedData = encodedData;
    }

    @Override
    public String toString() {
        return "ChunkTask{" +
                "fileId='" + fileId + '\'' +
                ", chunkId=" + chunkId +
                ", encodedData(length)=" + (encodedData != null ? encodedData.length() : 0) +
                '}';
    }
}
