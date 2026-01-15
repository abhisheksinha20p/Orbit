#!/bin/bash

# Configuration
CONTAINER_NAME="orbit-mongodb"
BACKUP_DIR="./backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILENAME="orbit_backup_$TIMESTAMP.archive"

# Create backup directory
mkdir -p "$BACKUP_DIR"

echo "Starting backup of $CONTAINER_NAME..."

# Execute mongodump inside the container and stream to host
docker exec "$CONTAINER_NAME" sh -c 'mongodump --archive --gzip' > "$BACKUP_DIR/$BACKUP_FILENAME"

if [ $? -eq 0 ]; then
    echo "Backup successful: $BACKUP_DIR/$BACKUP_FILENAME"
    # Optional: Delete backups older than 7 days
    find "$BACKUP_DIR" -name "orbit_backup_*" -type f -mtime +7 -delete
else
    echo "Backup failed!"
    rm "$BACKUP_DIR/$BACKUP_FILENAME"
    exit 1
fi
