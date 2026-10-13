# SnapShare Scaling Plan

# 1. Assumptions

Given:

- 10 million registered users
- 10% are active each day
- Each active user uploads 1 photo per day
- Each active user views 50 feed pages per day
- Average photo size = 2 MB
- Thumbnail size = 50 KB

## Daily Active Users

10,000,000 × 10%

= 1,000,000 daily active users

---

# 2. Capacity Estimates

## Uploads Per Day

1,000,000 users × 1 upload

= 1,000,000 uploads per day

## Average Uploads Per Second

1,000,000 ÷ 86,400

≈ 11.57 uploads/second

≈ 12 uploads/second

## Feed Views Per Day

1,000,000 users × 50 feed views

= 50,000,000 feed views/day

## Average Feed Views Per Second

50,000,000 ÷ 86,400

≈ 578.7

≈ 579 feed views/second

## Peak Feed Views Per Second

Using 5× peak traffic:

579 × 5

= 2,895 feed views/second

## Storage Per Photo

Original photo:

2 MB

Thumbnail:

50 KB

Total:

2.05 MB

## Photos Uploaded Per Year

1,000,000 × 365

= 365,000,000 photos

## Storage Per Year

365,000,000 × 2.05 MB

= 748,250,000 MB

≈ 748,250 GB

≈ 748 TB per year

---

# 3. Read-Heavy or Write-Heavy?

SnapShare is a read-heavy system.

Reason:

- Users upload about 12 photos per second on average.
- Users request about 579 feed views per second on average.
- Peak feed traffic reaches about 2,895 feed views per second.

The system therefore performs many more reads than writes, so the design should prioritize fast content delivery using caching, read replicas and a CDN.

---

# 4. Why Photos Should Not Be Stored in the Database

Photo files are very large compared with normal database records.

Storing millions of images directly inside the database would:

- Increase database size rapidly
- Make backups slower
- Reduce database performance
- Increase storage costs

Instead, photos should be stored in object storage.

The database should store only metadata such as:

- Photo ID
- User ID
- Upload time
- Storage URL
- Thumbnail URL

---

# 5. Architecture Diagram

                 +------------------+
                 |      Users       |
                 +--------+---------+
                          |
                          v
                 +------------------+
                 |       CDN        |
                 +--------+---------+
                          |
                          v
                 +------------------+
                 |  Load Balancer   |
                 +--------+---------+
                          |
          +---------------+---------------+
          |                               |
          v                               v

   +-------------+                 +-------------+
   | App Server  |                 | App Server  |
   +------+------+                 +------+------+
          |                               |
          +---------------+---------------+
                          |
                 +--------+---------+
                 |      Cache       |
                 +--------+---------+
                          |
                 +--------+---------+
                 |   Primary DB     |
                 +--------+---------+
                          |
                          v
                 +------------------+
                 |   Read Replica   |
                 +------------------+

                          |
                          v

                 +------------------+
                 | Object Storage   |
                 |    (Photos)      |
                 +--------+---------+
                          |
                          v

                 +------------------+
                 |      Queue       |
                 +--------+---------+
                          |
                          v

                 +------------------+
                 | Thumbnail Worker |
                 +------------------+

---

# 6. Component Explanations

## CDN

Delivers photos from locations close to users to reduce latency and decrease load on backend servers.

## Load Balancer

Distributes requests across multiple application servers to prevent overload.

## App Servers

Handle uploads, feed requests, authentication and business logic.

## Cache

Stores frequently requested feed data and metadata to reduce database reads.

## Primary Database

Stores user information, followers, feed metadata and photo metadata.

## Read Replica

Handles read traffic so the primary database can focus on writes.

## Object Storage

Stores original photos and generated thumbnails efficiently at large scale.

## Queue

Receives thumbnail-generation jobs and allows processing to happen asynchronously.

## Thumbnail Worker

Creates thumbnail images after uploads and saves them to object storage.

---

# 7. Photo Upload Flow

1. User uploads a photo through the application.
2. The request reaches the load balancer.
3. The load balancer forwards the request to an app server.
4. The app server stores the original image in object storage.
5. The app server stores photo metadata in the primary database.
6. The app server sends a thumbnail-generation job to the queue.
7. The upload response is returned to the user.
8. A worker reads the job from the queue.
9. The worker downloads the original image from object storage.
10. The worker generates a thumbnail.
11. The worker saves the thumbnail back to object storage.
12. The worker updates the database with the thumbnail location.
13. Future feed requests retrieve metadata from the database and image files through the CDN.

---

# 8. Trade-Offs

## Trade-Off 1: Cache Freshness vs Performance

Using a cache improves performance and reduces database load, but users may occasionally see slightly outdated feed information.

## Trade-Off 2: Read Replicas vs Consistency

Read replicas improve scalability for heavy read traffic, but newly written data may take a short time to appear on replicas.

## Trade-Off 3: Asynchronous Thumbnail Processing

Generating thumbnails in the background improves upload speed, but thumbnails may not be available immediately after upload.