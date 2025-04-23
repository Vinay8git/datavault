package com.scheduler.scheduler.config;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

import com.scheduler.scheduler.service.SchedulerServiceImpl;

import io.grpc.Server;
import io.grpc.ServerBuilder;
import jakarta.annotation.PostConstruct;
import jakarta.annotation.PreDestroy;

@Configuration
public class GrpcServerConfig {

    private int port = 6000;

    @Autowired
    private SchedulerServiceImpl schedulerServiceImpl;

    private Server server;

    @PostConstruct
    public void start() throws IOException {
        server = ServerBuilder.forPort(port).addService(schedulerServiceImpl).build().start();
        Runtime.getRuntime().addShutdownHook(new Thread(() -> server.shutdown()));
    }

    @PreDestroy
    public void stop() {
        if (server != null) {
            server.shutdown();
        }
    }

}
