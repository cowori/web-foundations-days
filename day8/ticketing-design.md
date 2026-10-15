# TicketHub System Design

# 1. Requirements

## Functional Requirements

The system must allow users to:

- Browse events
- View event details
- View seat availability
- Hold seats temporarily before payment
- Purchase tickets
- View purchased tickets
- Receive booking confirmations
- Search for events

## Non-Functional Requirements

The system should:

- Prevent double-booking of seats
- Remain available during large ticket sales
- Handle sudden traffic spikes
- Respond quickly to users
- Provide fair access during high demand
- Maintain data consistency
- Scale horizontally as traffic grows

---

# 2. Estimates

## Given Facts

- 2 million registered users
- 50,000 visitors per normal day
- Each visitor views 10 pages
- 5,000 tickets sold per day
- Popular concert:
  - 200,000 people
  - 20,000 seats
  - first 10 minutes

---

## Normal Day Traffic

### Page Views Per Day

50,000 × 10

= 500,000 page views/day

### Average Page Views Per Second

500,000 ÷ 86,400

≈ 6 page views/second

### Ticket Purchases Per Second

5,000 ÷ 86,400

≈ 0.06 purchases/second

---

## Popular Concert Sale

### Purchase Attempts

200,000 users / 10 minutes

200,000 ÷ 600

≈ 333 requests/second

### Seat Supply

20,000 seats available

Only 10% of users attempting to purchase can succeed.

### Comparison

Normal traffic:

- 6 page views/second

Big sale traffic:

- 333 purchase attempts/second

The sale generates far higher load and requires special handling.

---

# 3. API Design

## GET /events

Returns a list of events.

Success:

```http
200 OK
```

---

## GET /events/{id}

Returns details for one event.

Success:

```http
200 OK
```

---

## GET /events/{id}/seats

Returns available seats.

Success:

```http
200 OK
```

---

## POST /holds

Temporarily reserves seats.

Success:

```http
201 Created
```

---

## POST /payments

Processes payment for held seats.

Success:

```http
201 Created
```

---

## GET /tickets

Returns tickets owned by the user.

Success:

```http
200 OK
```

---

# 4. Data Model

## Users

| Column | Type |
|----------|----------|
| id | INTEGER |
| email | VARCHAR |
| password_hash | VARCHAR |
| created_at | TIMESTAMP |

Primary Key:

```text
id
```

---

## Events

| Column | Type |
|----------|----------|
| id | INTEGER |
| name | VARCHAR |
| venue | VARCHAR |
| event_date | TIMESTAMP |

Primary Key:

```text
id
```

---

## Seats

| Column | Type |
|----------|----------|
| id | INTEGER |
| event_id | INTEGER |
| seat_number | VARCHAR |
| status | VARCHAR |

Primary Key:

```text
id
```

Foreign Key:

```text
event_id → events.id
```

---

## Orders

| Column | Type |
|----------|----------|
| id | INTEGER |
| user_id | INTEGER |
| seat_id | INTEGER |
| purchased_at | TIMESTAMP |

Primary Key:

```text
id
```

Foreign Keys:

```text
user_id → users.id
seat_id → seats.id
```

---

# Relationships

## Users → Orders

One-to-many

One user can own many ticket purchases.

---

## Events → Seats

One-to-many

One event contains many seats.

---

## Seats → Orders

One-to-one after purchase

A seat can only belong to one completed order.

---

# 5. Preventing Double Booking

Double booking is prevented using a database transaction and a uniqueness constraint.

When a user attempts to buy a seat:

1. The purchase starts a database transaction.
2. The seat record is checked.
3. The system verifies that the seat is still available.
4. An atomic update changes the seat status from AVAILABLE to SOLD.
5. The order is recorded.
6. The transaction commits.

If another user attempts to purchase the same seat at the same time:

- The second transaction cannot update the seat.
- The purchase fails.
- The seat remains owned by the first successful buyer.

This guarantees that two people cannot buy the same seat.

---

# 6. Architecture Diagram

```text
                 +-----------+
                 |  Browser  |
                 +-----+-----+
                       |
                       v

                 +-----------+
                 |    DNS    |
                 +-----+-----+
                       |
                       v

                 +-----------+
                 |    CDN    |
                 +-----+-----+
                       |
                       v

                 +-----------+
                 | Load Bal. |
                 +-----+-----+
                       |
        +--------------+--------------+
        |                             |
        v                             v

 +--------------+             +--------------+
 | App Server 1 |             | App Server 2 |
 +------+-------+             +------+-------+
        |                            |
        +------------+---------------+
                     |
                     v

              +-------------+
              |    Cache    |
              +------+------+
                     |
           +---------+---------+
           |                   |
           v                   v

      +----------+      +-------------+
      | Primary  |----->| Read Replica|
      | Database |      +-------------+
      +-----+----+
            |
            v

      +------------+
      |   Queue    |
      +-----+------+
            |
            v

      +------------+
      |  Worker    |
      +------------+
```

---

# Component Explanations

## Browser

Allows users to interact with TicketHub.

## DNS

Routes users to the correct infrastructure.

## CDN

Delivers static content quickly.

## Load Balancer

Distributes traffic across servers.

## App Servers

Execute business logic and ticket purchases.

## Cache

Stores frequently viewed event and seat data.

## Primary Database

Stores users, orders, seats and events.

## Read Replica

Handles heavy read traffic.

## Queue

Stores background jobs.

## Worker

Processes emails, receipts and notifications.

---

# How the Architecture Survives a Big Sale

- Multiple app servers share traffic.
- Cache reduces database reads.
- Read replicas handle browsing traffic.
- The queue prevents background work from slowing purchases.
- Database transactions ensure seat consistency.

---

# 7. Trade-Offs

## Trade-Off 1: Fairness vs Speed

A waiting room or queue improves fairness during sales but increases user waiting time.

---

## Trade-Off 2: Cache Freshness vs Performance

Caching improves speed but may briefly show outdated seat information.

---

## Trade-Off 3: Read Replicas vs Consistency

Read replicas improve scalability but may have a small replication delay.