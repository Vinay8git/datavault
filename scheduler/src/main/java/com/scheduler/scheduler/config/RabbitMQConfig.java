package com.scheduler.scheduler.config;

import org.springframework.amqp.core.Queue;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMQConfig {

    public static final String CHUNK_QUEUE = "fileChunksQueue";

    @Bean
    public Queue fileChunksQueue() {
        return new Queue(CHUNK_QUEUE, true);
    }
}
