# Library Books REST API Design

This document describes a proposed REST API for managing books in a library. The base path for the books resource is `/api/books`.

## Book representation

A book can contain the following fields:

- `id`: Unique identifier for the book
- `title`: Title of the book
- `author`: Author of the book
- `isbn`: ISBN assigned to the book
- `publishedYear`: Year the book was published
- `available`: Whether the book is currently available

Example book:

```json
{
    "id": 42,
    "title": "Things Fall Apart",
    "author": "Chinua Achebe",
    "isbn": "9780385474542",
    "publishedYear": 1958,
    "available": true
}
```

## 1. List all books

- **Method:** `GET`
- **Path:** `/api/books`
- **Description:** Returns a list of all books in the library.
- **Request body:** None
- **Success status:** `200 OK`

Example response:

```json
[
    {
        "id": 42,
        "title": "Things Fall Apart",
        "author": "Chinua Achebe",
        "isbn": "9780385474542",
        "publishedYear": 1958,
        "available": true
    }
]
```

## 2. Get one book

- **Method:** `GET`
- **Path:** `/api/books/{id}`
- **Description:** Returns the book with the specified ID.
- **Request body:** None
- **Success status:** `200 OK`

Example request:

```text
GET /api/books/42
```

## 3. Create a book

- **Method:** `POST`
- **Path:** `/api/books`
- **Description:** Creates a new book in the library.
- **Success status:** `201 Created`

Example request body:

```json
{
    "title": "Things Fall Apart",
    "author": "Chinua Achebe",
    "isbn": "9780385474542",
    "publishedYear": 1958,
    "available": true
}
```

The client does not provide the ID because the server creates it.

## 4. Update a book

- **Method:** `PUT`
- **Path:** `/api/books/{id}`
- **Description:** Replaces the stored details of the book with the specified ID.
- **Success status:** `200 OK`

Example request body:

```json
{
    "title": "Things Fall Apart",
    "author": "Chinua Achebe",
    "isbn": "9780385474542",
    "publishedYear": 1958,
    "available": false
}
```

Example request:

```text
PUT /api/books/42
```

## 5. Delete a book

- **Method:** `DELETE`
- **Path:** `/api/books/{id}`
- **Description:** Deletes the book with the specified ID.
- **Request body:** None
- **Success status:** `204 No Content`

Example request:

```text
DELETE /api/books/42
```

A successful `204 No Content` response does not need a response body.

## 6. List books by an author

- **Method:** `GET`
- **Path:** `/api/books?author={authorName}`
- **Description:** Returns books whose author matches the supplied query parameter.
- **Request body:** None
- **Success status:** `200 OK`

Example request:

```text
GET /api/books?author=Chinua%20Achebe
```

## Error responses

### 400 Bad Request

A `400 Bad Request` response is returned when the client sends invalid or incomplete book data.

Example situation:

A request to create a book does not include a title:

```json
{
    "author": "Chinua Achebe",
    "isbn": "9780385474542",
    "publishedYear": 1958,
    "available": true
}
```

Example error response:

```json
{
    "error": "The title field is required."
}
```

### 404 Not Found

A `404 Not Found` response is returned when the requested book ID does not exist.

Example request:

```text
GET /api/books/9999
```

Example error response:

```json
{
    "error": "Book not found."
}
```