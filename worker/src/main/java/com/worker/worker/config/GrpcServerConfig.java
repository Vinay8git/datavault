package com.worker.worker.config;

import java.io.IOException;
import java.util.concurrent.TimeUnit;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

import com.worker.worker.service.WorkerServiceImpl;

import io.grpc.Server;
import io.grpc.ServerBuilder;
import jakarta.annotation.PostConstruct;
import jakarta.annotation.PreDestroy;

@Configuration
public class GrpcServerConfig {

    @Value("${grpc.worker.port:5000}")
    private int port;

    @Autowired
    private WorkerServiceImpl workerServiceImpl;

    private Server server;

    @PostConstruct
    public void start() throws IOException {
        server = ServerBuilder.forPort(port)
                .addService(workerServiceImpl)
                .build()
                .start();
        System.out.println("Worker gRPC server started on port " + server.getPort());
    }

    @PreDestroy
    public void stop() {
        if (server != null) {
            server.shutdown();
            try {
                if (!server.awaitTermination(5, TimeUnit.SECONDS)) {
                    server.shutdownNow();
                }
            } catch (InterruptedException e) {
                server.shutdownNow();
                Thread.currentThread().interrupt();
            }
        }
    }

    public int getPort() {
        return server != null ? server.getPort() : port;
    }
}
