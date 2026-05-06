
DROP TABLE IF EXISTS file_metadata;

 
CREATE TABLE IF NOT EXISTS file_metadata (
    file_id VARCHAR(255) NOT NULL,
    chunk_id INTEGER NOT NULL,
    filename VARCHAR(255),
    size BIGINT,
    total_chunks INTEGER,
    worker_id VARCHAR(255),
    worker_address VARCHAR(255),
    upload_time TIMESTAMP WITHOUT TIME ZONE,
    PRIMARY KEY (file_id, chunk_id)
);
