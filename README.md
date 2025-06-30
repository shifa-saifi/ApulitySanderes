# 📚 Book Review Service

A lightweight microservice for managing books and their reviews, built with **NestJS**, **PostgreSQL**, and **Redis**.  
Includes full REST API, database migrations, Redis caching, Swagger/OpenAPI documentation, and both unit & end-to-end tests.

---

## Table of Contents

1. [Features](#features)  
2. [Architecture](#architecture)  
3. [Prerequisites](#prerequisites)  
4. [Getting Started](#getting-started)  
   - [Clone & Install](#clone--install)  
   - [Environment Configuration](#environment-configuration)  
   - [Docker Setup](#docker-setup)  
   - [Build & Migrate](#build--migrate)  
   - [Run in Development](#run-in-development)  
5. [API Reference](#api-reference)  
   - [Books Endpoints](#books-endpoints)  
   - [Reviews Endpoints](#reviews-endpoints)  
6. [Caching Behavior](#caching-behavior)  
7. [Swagger Documentation](#swagger-documentation)  
8. [Testing](#testing)  
   - [Unit Tests](#unit-tests)  
   - [End-to-End Tests](#end-to-end-tests)  
9. [Scripts & Commands](#scripts--commands)  
10. [Configuration & Environment Variables](#configuration--environment-variables)  
11. [Troubleshooting](#troubleshooting)  
12. [Folder Structure](#folder-structure)  
13. [Contributing](#contributing)  
14. [License](#license)  

---

## Features

- **CRUD** operations for Books and Reviews  
- **Redis** caching for `GET /books` with a 60-second TTL  
- **TypeORM** migrations for schema versioning  
- **Swagger/OpenAPI** docs auto-generated at runtime  
- **Global error filter** for consistent JSON responses  
- **Validation** of request payloads via `class-validator`  
- **Unit** tests for controllers & services (Jest)  
- **E2E** tests for full API flow (SuperTest + in-memory DB)  
- **Docker Compose** for seamless local development  

---

## Architecture

Client → NestJS API
├─ PostgreSQL (TypeORM)
├─ Redis (Cache)
├─ Swagger UI
└─ Jest Tests

- **NestJS** divides code into modules: `BooksModule`, `ReviewsModule`, and a shared `CacheModule`.  
- **TypeORM** manages entities & migrations, with a clear separation of data models and CRUD logic in services.  
- **RedisModule** provides a `CacheService` for simple JSON get/set/del with TTL.  
- **SwaggerModule** auto-documents each controller, DTO, parameter, and response schema.  

---

## Prerequisites

- **Node.js** v20 or higher  
- **npm** v8 or higher  
- **Docker** & **Docker Compose** (for local Postgres & Redis)  
- **Git** (to clone the repository)

---

## Getting Started

### Clone & Install

```bash
git clone https://github.com/SAIFISHIFA/book-review.git
cd book-review
npm ci
Environment Configuration
Copy the example environment file:

  
cp .env.example .env
Edit .env as needed:

DATABASE_URL=postgres://postgres:example@localhost:5432/bookdb
REDIS_URL=redis://localhost:6379
PORT=3000
Docker Setup
Bring up PostgreSQL and Redis containers:

  
docker-compose up --build -d
Postgres will be available at localhost:5432

Redis will listen on localhost:6379

Build & Migrate
Compile TypeScript and run migrations:

  
npm run build
npm run migration:run
This will:

Transpile your src/ into dist/.

Execute the generated migration scripts to create books and reviews tables and indexes.

Run in Development
Start NestJS in watch mode:

  
npm run start:dev
The API will listen on the port defined in .env (default 3000).

API Reference
Books Endpoints
GET /books

Returns a list of all books (cached for 60s).

Response 200 OK


[
  { "id": 1, "title": "...", "author": "...", "publishedAt": "YYYY-MM-DD" },
  …
]
POST /books

Creates a new book.

Request Body

 
{ "title": "string", "author": "string", "publishedAt": "YYYY-MM-DD" }
Response 201 Created with the saved book object.

Reviews Endpoints
GET /books/{id}/reviews

Lists reviews for the book with the given id.

Response 200 OK

 
[
  { "id": 1, "reviewer": "string", "body": "text", "createdAt": "ISO8601" },
  …
]
POST /books/{id}/reviews

Adds a new review to the specified book.

Request Body

 
{ "reviewer": "string", "body": "text" }
Response 201 Created with the saved review object.

Caching Behavior
The GET /books endpoint caches its result in Redis under key books:list.

Cache TTL is 60 seconds.

On cache hit, requests are served directly from Redis.

On cache miss (or Redis unavailability), the service falls back to the database and repopulates the cache.

Swagger Documentation
Interactive API docs are available at:

  
http://localhost:3000/api
Explore all endpoints, view models generated from DTOs, and try requests directly from the UI.

The raw OpenAPI JSON spec is served at:

  
http://localhost:3000/api-json
Testing
Unit Tests
  
npm run test
Runs Jest against test/**/*.spec.ts

Mocks services and dependencies to isolate controllers and business logic.

End-to-End Tests
  
npm run test:e2e
Boots up a Nest application instance.

Uses an in-memory database (via synchronize(true)) for isolation.

Executes the full flow: create a book, list books, add a review, list reviews, then cleans up.

Scripts & Commands
Script	Description
npm run start:dev	Start NestJS in watch mode (development)
npm run build	Compile TypeScript into dist/
npm run start	Run the compiled application from dist/
npm run typeorm	Alias for typeorm-ts-node-commonjs CLI
npm run migration:generate <Name>	Generate a new TypeORM migration
npm run migration:run	Apply pending migrations to the database
npm run test	Run unit tests (Jest)
npm run test:e2e	Run end-to-end tests (Jest + SuperTest)

Configuration & Environment Variables
Variable	Description	Default
DATABASE_URL	PostgreSQL connection string	postgres://postgres:example@localhost:5432/bookdb
REDIS_URL	Redis connection URL	redis://localhost:6379
PORT	Port on which the NestJS server listens	3000

Troubleshooting
“relation does not exist” error

Ensure you’ve run npm run build and npm run migration:run.

For quick dev, temporarily set synchronize: true in app.module.ts.

Redis AUTH errors

Verify REDIS_URL matches your Redis server’s credentials.

Or catch auth errors in your RedisModule factory to allow migrations to run.

Port conflicts

Change PORT in .env.

Ensure no other service is listening on the same port.

Folder Structure
.
├── .env.example
├── docker-compose.yml
├── Dockerfile
├── data-source.ts
├── package.json
├── tsconfig.json
├── src/
│   ├── main.ts
│   ├── app.module.ts
│   ├── common/
│   │   └── filters/http-exception.filter.ts
│   ├── cache/
│   │   ├── redis.module.ts
│   │   └── cache.service.ts
│   ├── books/
│   │   ├── books.module.ts
│   │   ├── books.service.ts
│   │   ├── books.controller.ts
│   │   └── entities/book.entity.ts
│   │   └── dto/create-book.dto.ts
│   ├── reviews/
│   │   ├── reviews.module.ts
│   │   ├── reviews.service.ts
│   │   ├── reviews.controller.ts
│   │   └── entities/review.entity.ts
│   │   └── dto/create-review.dto.ts
│   └── migration/
│       └── <timestamp>-Init.ts
└── test/
    ├── books.controller.spec.ts
    ├── reviews.controller.spec.ts
    └── books.e2e-spec.ts
Contributing
Fork the repository

Create your feature branch: git checkout -b feature/my-feature

Commit your changes: git commit -m 'Add feature'

Push to the branch: git push origin feature/my-feature

Open a Pull Request

Please follow the existing code style and include tests for new features.

