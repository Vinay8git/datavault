package com.scheduler.scheduler.model;

public class WorkerInfo {
    private String workerId;
    private String address;
    private long lastheartbeat;

    public WorkerInfo(String workerId, String address) {
        this.workerId = workerId;
        this.address = address;
        this.lastheartbeat = System.currentTimeMillis();
    }

    public String getWorkerId() {
        return workerId;
    }

    public String getAddress() {
        return address;
    }

    public long getLastHeartbeat() {
        return this.lastheartbeat;
    }

    public void updateHeartbeat() {
        this.lastheartbeat = System.currentTimeMillis();
    }

}
