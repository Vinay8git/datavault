package com.worker.worker.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import io.datavault.common.grpc.SchedulerServiceGrpc;
import io.grpc.ManagedChannel;
import io.grpc.ManagedChannelBuilder;

@Configuration
public class GrpcClientConfig {
    @Value("${SCHEDULER_HOST}")
    String schedulerHost;
    @Value("${SCHEDULER_PORT}")
    int schedulerPort;

    @Bean
    public ManagedChannel schedulerChannel() {

        return ManagedChannelBuilder.forAddress(schedulerHost, schedulerPort)
                .usePlaintext()
                .build();
    }

    @Bean
    public SchedulerServiceGrpc.SchedulerServiceBlockingStub schedulerServiceStub(ManagedChannel schedulerChannel) {
        return SchedulerServiceGrpc.newBlockingStub(schedulerChannel);
    }

}
