
DROP TABLE IF EXISTS file_metadata;

 
CREATE TABLE file_metadata (
    file_id VARCHAR(255) PRIMARY KEY,
    chunk_id INTEGER NOT NULL,
    filename VARCHAR(255) NOT NULL,
    size BIGINT NOT NULL,
    worker_id VARCHAR(255),
    worker_address VARCHAR(255),
    upload_time TIMESTAMP WITHOUT TIME ZONE
);
