package com.worker.worker.integration;

import com.worker.worker.model.ChunkTask;
import com.worker.worker.util.TestDataBuilder;
import io.datavault.common.grpc.AssignWorkerRequest;
import io.datavault.common.grpc.AssignWorkerResponse;
import io.datavault.common.grpc.SchedulerServiceGrpc;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.testcontainers.containers.RabbitMQContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import java.io.File;
import java.nio.file.Files;
import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

/**
 * Integration tests for chunk storage workflow using Testcontainers.
 * Tests end-to-end RabbitMQ message consumption and chunk storage operations.
 * Uses real RabbitMQ container to verify message broker integration.
 */
@SpringBootTest
@Testcontainers
class ChunkStorageIntegrationTest {

    @Container
    static RabbitMQContainer rabbitmq = new RabbitMQContainer("rabbitmq:3.12-management")
            .withExposedPorts(5672, 15672);

    @DynamicPropertySource
    static void configureProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.rabbitmq.host", rabbitmq::getHost);
        registry.add("spring.rabbitmq.port", rabbitmq::getAmqpPort);
        registry.add("spring.rabbitmq.username", () -> "guest");
        registry.add("spring.rabbitmq.password", () -> "guest");
    }

    @Autowired
    private RabbitTemplate rabbitTemplate;

    @MockBean
    private SchedulerServiceGrpc.SchedulerServiceBlockingStub schedulerStub;

    private static final String TEST_WORKER_ID = "integration-test-worker";
    private static final String QUEUE_NAME = "fileChunksQueue";

    @BeforeEach
    void setUp() {
        System.setProperty("WORKER_ID", TEST_WORKER_ID);
    }

    @AfterEach
    void tearDown() {
        // Clean up system properties
        System.clearProperty("WORKER_ID");

        // Clean up test storage directory
        TestDataBuilder.cleanupDirectoryQuietly(new File("app/storage/" + TEST_WORKER_ID));

        // Reset mocks to ensure clean state for next test
        org.mockito.Mockito.reset(schedulerStub);
    }

    /**
     * Tests RabbitMQ message consumption.
     * Verifies that ChunkTask messages sent to the queue are consumed by the worker service.
     */
    @Test
    void testMessageConsumption_FromRabbitMQ() throws Exception {
        // Arrange
        String fileId = "test-file-001";
        int chunkId = 1;
        byte[] chunkData = "Integration test chunk data".getBytes();
        ChunkTask task = TestDataBuilder.createChunkTask(fileId, chunkId, chunkData);

        AssignWorkerResponse response = AssignWorkerResponse.newBuilder()
                .setAssignedWorkerId(TEST_WORKER_ID)
                .setAssignedWorkerAddress("localhost:9091")
                .build();

        when(schedulerStub.assignWorkerForChunk(any(AssignWorkerRequest.class)))
                .thenReturn(response);

        // Act - Send ChunkTask object directly; Jackson2JsonMessageConverter handles serialization
        rabbitTemplate.convertAndSend(QUEUE_NAME, task);

        // Wait for message processing
        Thread.sleep(2000);

        // Assert - filename uses standardized format: {fileId}_{chunkId}.chunk
        File chunkFile = new File("app/storage/" + TEST_WORKER_ID + "/" + fileId + "_" + chunkId + ".chunk");
        assertTrue(chunkFile.exists(), "Chunk file should be created after message consumption");

        byte[] storedData = Files.readAllBytes(chunkFile.toPath());
        assertArrayEquals(chunkData, storedData, "Stored data should match original data");
    }

    /**
     * Tests end-to-end chunk storage workflow.
     * Verifies complete flow from message publishing to file storage.
     */
    @Test
    void testEndToEndChunkStorageWorkflow() throws Exception {
        // Arrange
        String fileId = "test-file-002";
        int chunkId = 5;
        byte[] chunkData = "End-to-end test data for chunk storage".getBytes();
        ChunkTask task = TestDataBuilder.createChunkTask(fileId, chunkId, chunkData);

        AssignWorkerResponse response = AssignWorkerResponse.newBuilder()
                .setAssignedWorkerId(TEST_WORKER_ID)
                .setAssignedWorkerAddress("localhost:9091")
                .build();

        when(schedulerStub.assignWorkerForChunk(any(AssignWorkerRequest.class)))
                .thenReturn(response);

        // Act
        rabbitTemplate.convertAndSend(QUEUE_NAME, task);

        // Wait for async processing
        Thread.sleep(2000);

        // Assert
        File storageDir = new File("app/storage/" + TEST_WORKER_ID);
        assertTrue(storageDir.exists(), "Storage directory should be created");
        assertTrue(storageDir.isDirectory(), "Storage path should be a directory");

        File chunkFile = new File(storageDir, fileId + "_" + chunkId + ".chunk");
        assertTrue(chunkFile.exists(), "Chunk file should exist");
        assertTrue(chunkFile.isFile(), "Chunk path should be a file");

        byte[] storedData = Files.readAllBytes(chunkFile.toPath());
        assertArrayEquals(chunkData, storedData, "Stored chunk data should match original");
    }

    /**
     * Tests concurrent chunk processing.
     * Verifies that multiple chunks can be processed simultaneously without conflicts.
     */
    @Test
    void testConcurrentChunkProcessing() throws Exception {
        // Arrange
        String fileId = "test-file-003";
        int numberOfChunks = 5;
        List<ChunkTask> tasks = new ArrayList<>();

        AssignWorkerResponse response = AssignWorkerResponse.newBuilder()
                .setAssignedWorkerId(TEST_WORKER_ID)
                .setAssignedWorkerAddress("localhost:9091")
                .build();

        when(schedulerStub.assignWorkerForChunk(any(AssignWorkerRequest.class)))
                .thenReturn(response);

        // Create multiple chunk tasks
        for (int i = 0; i < numberOfChunks; i++) {
            byte[] chunkData = ("Concurrent chunk data " + i).getBytes();
            ChunkTask task = TestDataBuilder.createChunkTask(fileId, i, chunkData);
            tasks.add(task);
        }

        // Act - Send all ChunkTask objects directly
        for (ChunkTask task : tasks) {
            rabbitTemplate.convertAndSend(QUEUE_NAME, task);
        }

        // Wait for all messages to be processed
        Thread.sleep(3000);

        // Assert - Verify all chunks were stored with standardized filenames
        File storageDir = new File("app/storage/" + TEST_WORKER_ID);
        assertTrue(storageDir.exists(), "Storage directory should exist");

        for (int i = 0; i < numberOfChunks; i++) {
            File chunkFile = new File(storageDir, fileId + "_" + i + ".chunk");
            assertTrue(chunkFile.exists(), "Chunk file " + i + " should exist");

            byte[] expectedData = ("Concurrent chunk data " + i).getBytes();
            byte[] storedData = Files.readAllBytes(chunkFile.toPath());
            assertArrayEquals(expectedData, storedData,
                    "Chunk " + i + " data should match original");
        }
    }

    /**
     * Tests RabbitMQ connection and queue availability.
     * Verifies that the RabbitMQ container is properly configured and accessible.
     */
    @Test
    void testRabbitMQConnection_IsAvailable() {
        // Assert
        assertTrue(rabbitmq.isRunning(), "RabbitMQ container should be running");
        assertNotNull(rabbitTemplate, "RabbitTemplate should be autowired");

        // Verify we can send a message without errors
        assertDoesNotThrow(() -> {
            ChunkTask task = new ChunkTask("test-file", 0, "dGVzdA==");
            rabbitTemplate.convertAndSend(QUEUE_NAME, task);
        }, "Should be able to send message to RabbitMQ");
    }

    /**
     * Tests multiple file chunks storage.
     * Verifies that chunks from different files can be stored independently.
     */
    @Test
    void testMultipleFileChunksStorage() throws Exception {
        // Arrange
        String fileId1 = "file-001";
        String fileId2 = "file-002";
        byte[] data1 = "Data for file 1".getBytes();
        byte[] data2 = "Data for file 2".getBytes();

        ChunkTask task1 = TestDataBuilder.createChunkTask(fileId1, 0, data1);
        ChunkTask task2 = TestDataBuilder.createChunkTask(fileId2, 0, data2);

        AssignWorkerResponse response = AssignWorkerResponse.newBuilder()
                .setAssignedWorkerId(TEST_WORKER_ID)
                .setAssignedWorkerAddress("localhost:9091")
                .build();

        when(schedulerStub.assignWorkerForChunk(any(AssignWorkerRequest.class)))
                .thenReturn(response);

        // Act - Send ChunkTask objects directly
        rabbitTemplate.convertAndSend(QUEUE_NAME, task1);
        rabbitTemplate.convertAndSend(QUEUE_NAME, task2);

        // Wait for processing
        Thread.sleep(2000);

        // Assert - Each file's chunk is stored with its own fileId prefix
        File storageDir = new File("app/storage/" + TEST_WORKER_ID);
        File chunk1 = new File(storageDir, fileId1 + "_0.chunk");
        File chunk2 = new File(storageDir, fileId2 + "_0.chunk");

        assertTrue(chunk1.exists(), "File 1 chunk should be stored");
        assertTrue(chunk2.exists(), "File 2 chunk should be stored");

        byte[] storedData1 = Files.readAllBytes(chunk1.toPath());
        byte[] storedData2 = Files.readAllBytes(chunk2.toPath());
        assertArrayEquals(data1, storedData1, "File 1 data should match");
        assertArrayEquals(data2, storedData2, "File 2 data should match");
    }
}
