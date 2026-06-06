# Medblood API

Production-ready REST API backend for blood bank management, built with Node.js, Express.js, PostgreSQL, Sequelize ORM, JWT authentication, and dotenv.

## Tech Stack

- Node.js
- Express.js
- PostgreSQL
- Sequelize ORM
- JWT (jsonwebtoken)
- bcryptjs
- dotenv
- express-validator

## Architecture

The project uses a modular, scalable architecture with clear boundaries:

- `src/config`: environment and database configuration
- `src/models`: Sequelize model definitions and associations
- `src/controllers`: route handlers and request orchestration
- `src/routes`: endpoint definitions and middleware composition
- `src/middleware`: auth, role authorization, request validation, error handling
- `src/services`: business/domain logic (blood compatibility engine)
- `src/utils`: reusable helpers (`ApiError`, async handler, pagination, JWT helpers)
- `src/validators`: express-validator rule sets
- `src/seeders`: startup data seeding (blood types)

### Why this structure?

- Keeps business logic out of route files.
- Prevents monolithic controllers by extracting domain rules to services.
- Improves maintainability by centralizing cross-cutting concerns (auth, errors, validation) in middleware.
- Makes testing and refactoring easier because responsibilities are isolated.

## Features

- Signup and login with JWT authentication
- Password hashing with bcrypt
- Role-based access control (`donor`, `hospital`, `admin`)
- Blood types persisted as `bloodGroup` + `rhesusFactor`
- Donation CRUD with ownership rules
- Compatibility search with real blood donation rules
- Pagination and filtering (blood type + location)
- Centralized validation and error handling

## Role Rules Implemented

- `donor`
	- Can create donation records for themselves
	- Can view, update, and delete only their own donations
- `hospital`
	- Can list/search donations
	- Can query compatible donors for requested blood type
- `admin`
	- Can manage all donations
	- Can manage all users (list, update role, delete)

## Blood Compatibility Engine

Compatibility logic is implemented in `src/services/compatibilityService.js`.

Examples covered:

- `O-` can donate to all blood groups
- `AB+` can receive from all blood groups

Endpoint: `GET /api/v1/donations/compatible?bloodGroup=AB&rhesusFactor=+`

## Data Model

### User

- `id` (UUID, PK)
- `name`
- `email` (unique)
- `password` (hashed)
- `role` (`donor`, `hospital`, `admin`)

### BloodType

- `id` (PK)
- `bloodGroup` (`A`, `B`, `AB`, `O`)
- `rhesusFactor` (`+`, `-`)
- `code` (`A+`, `O-`, etc.)

### Donation

- `id` (UUID, PK)
- `bloodGroup`
- `rhesusFactor`
- `quantityInBags`
- `location`
- `healthStatus`
- `lastTestDate`
- `availabilityStatus` (`available`, `reserved`, `used`, `unavailable`)
- `donorId` (FK -> User)
- `bloodTypeId` (FK -> BloodType)

Associations:

- User `hasMany` Donation
- Donation `belongsTo` User
- BloodType `hasMany` Donation
- Donation `belongsTo` BloodType

## API Security

- Public routes: only
	- `POST /api/v1/auth/signup`
	- `POST /api/v1/auth/login`
- All other routes protected by JWT middleware.
- Role checks enforced by authorization middleware.
- Input validation enforced with `express-validator`.

## Environment Variables

Copy `.env.example` to `.env` and configure:

```env
PORT=5000
NODE_ENV=development
DB_HOST=localhost
DB_PORT=5432
DB_NAME=medblood_db
DB_USER=postgres
DB_PASSWORD=postgres
JWT_SECRET=replace_with_a_strong_secret
JWT_EXPIRES_IN=1d
```

## Installation and Run

```bash
npm install
npm run dev
```

Production:

```bash
npm start
```

Health check:

```http
GET /health
```

## API Endpoints (Postman-ready)

Base URL: `http://localhost:5000/api/v1`

### Auth (Public)

1. `POST /auth/signup`
2. `POST /auth/login`

### Protected

1. `GET /blood-types`
2. `POST /donations`
3. `GET /donations`
4. `GET /donations/:id`
5. `PATCH /donations/:id`
6. `DELETE /donations/:id`
7. `GET /donations/compatible?bloodGroup=A&rhesusFactor=+&location=lagos`
8. `GET /users` (admin)
9. `PATCH /users/:id/role` (admin)
10. `DELETE /users/:id` (admin)

## Sample Payloads

### Signup

Request:

```json
{
	"name": "John Donor",
	"email": "john@example.com",
	"password": "StrongPass123",
	"role": "donor"
}
```

Response:

```json
{
	"success": true,
	"message": "User registered successfully",
	"data": {
		"token": "<jwt>",
		"user": {
			"id": "uuid",
			"name": "John Donor",
			"email": "john@example.com",
			"role": "donor"
		}
	}
}
```

### Login

Request:

```json
{
	"email": "john@example.com",
	"password": "StrongPass123"
}
```

### Create Donation

Request:

```json
{
	"bloodGroup": "O",
	"rhesusFactor": "-",
	"quantityInBags": 2,
	"location": "Lagos",
	"healthStatus": "fit",
	"lastTestDate": "2026-05-15",
	"availabilityStatus": "available"
}
```

### List Donations with Pagination/Filter

`GET /donations?page=1&limit=10&bloodGroup=O&rhesusFactor=-&location=Lagos`

Response includes:

```json
{
	"success": true,
	"data": [],
	"meta": {
		"totalItems": 0,
		"totalPages": 1,
		"currentPage": 1,
		"pageSize": 10
	}
}
```

### Compatibility Search

`GET /donations/compatible?bloodGroup=AB&rhesusFactor=+`

Response includes `compatibleDonorTypes` and available matching donations.

## Validation and Error Format

Validation errors return:

```json
{
	"success": false,
	"message": "Validation failed",
	"details": [
		{
			"msg": "bloodGroup must be A, B, AB, or O"
		}
	]
}
```

## Notes for Production

- Replace `sequelize.sync()` with migrations.
- Use strong JWT secrets and secret rotation policies.
- Add rate limiting and request logging with correlation IDs.
- Add integration tests (Jest + Supertest) and CI pipeline.

## Technical Article

See the article in `ARTICLE.md`:

**Creating CRUD API with Node.js**

## Postman documentation

link : `https://www.postman.com/tech4dev-capstone-team/workspace/medblood-api-v1`