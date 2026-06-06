# Creating a CRUD API with Node.js: Building the Medblood Backend System

## 1. Introduction

In fast-growing cities, blood shortage is not only a medical problem, it is a coordination problem. Hospitals may urgently need a specific blood type, donors may exist nearby, but there is often no reliable technical flow to connect both sides quickly. That gap is exactly what I set out to address with Medblood.

Medblood is a REST API backend designed to manage blood donation records, user roles, and blood compatibility matching in a secure and scalable way. Instead of building a simple demo, I treated this as a real backend engineering project: clear architecture, strict route protection, input validation, and practical role-based workflows.

The stack includes Node.js, Express.js, PostgreSQL, Sequelize ORM, JWT authentication, bcrypt, and dotenv. These technologies were chosen to balance speed of development, maintainability, and production readiness.

At a high level, Medblood supports four core actors and actions:

- users can sign up and log in,
- donors can create and manage donation records,
- hospitals can search for compatible donor records,
- admins can manage users and oversee operations.

The outcome is a secure CRUD API with domain logic that reflects real blood-bank needs, not just generic create and read endpoints.

## 2. What Is a CRUD API?

CRUD stands for Create, Read, Update, and Delete. These are the four fundamental operations behind most data-driven APIs.

In Medblood, CRUD is mapped directly to practical blood donation workflows:

- Create: donors create donation records with blood type, quantity, location, and health data.
- Read: hospitals and authorized users fetch blood types, browse available donations, and retrieve records by id.
- Update: donors or admins update donation availability and related details.
- Delete: donors or admins remove outdated or invalid donation records.

The key point is that CRUD alone is not enough for a real system. In Medblood, every CRUD action is wrapped with authentication, authorization, validation, and business constraints. For example, a donor can update only their own records, while an admin can update any donor record.

## 3. Project Stack and Why It Was Chosen

### Node.js

Node.js was selected for its non-blocking event model and strong ecosystem for API development. Since Medblood is request-response heavy and includes role checks plus query filtering, Node.js provides strong performance with straightforward deployment.

### Express.js

Express keeps HTTP layers clean and explicit. Route definitions, middleware chains, and controller separation are simple to reason about, which helps as the project grows from auth routes to role-protected donation and admin routes.

### PostgreSQL

Blood donation data is relational by nature: users, donations, blood types, and ownership constraints. PostgreSQL gives strong integrity guarantees, mature indexing, and SQL-level reliability needed for healthcare-adjacent workflows.

### Sequelize ORM

Sequelize was used to model entities, associations, and query behavior without writing repetitive SQL for every operation. It also made relationship mapping and eager loading easier when returning donation records with donor details.

### JWT

JWT handles stateless authentication well for APIs consumed by web or mobile clients. Once a user logs in, the token carries identity and role claims that power route protection.

### bcrypt

Passwords are never stored in plain text. bcrypt hashing with salt rounds protects user credentials even if database data is exposed.

### dotenv

dotenv centralizes environment-specific configuration such as database credentials and JWT secrets. This keeps secrets out of source files and supports clean environment management from local to production.

## 4. Project Architecture

I designed Medblood with a modular structure to avoid tight coupling and to keep responsibilities clear.

- config: environment and database configuration.
- models: Sequelize model definitions and associations.
- routes: endpoint declarations and middleware composition.
- controllers: request orchestration and response shaping.
- services: domain logic such as blood compatibility calculations.
- middleware: authentication, role checks, validation handling, and global error handling.
- validators: express-validator rule sets.
- utils: shared helpers such as JWT helpers and pagination helpers.

This architecture matters because APIs usually become harder to maintain when business logic leaks into route files. In Medblood, route files stay declarative, controllers coordinate operations, and service modules isolate reusable domain rules.

## 5. Setting Up the Express Server

The server setup is split into two layers:

- app layer for middleware and route mounting,
- boot layer for database connectivity and process startup.

This separation makes testing easier because the app can be imported without opening a network port.

Core middleware includes:

- security headers with helmet,
- CORS configuration,
- JSON and urlencoded payload parsing,
- request logging,
- centralized not-found and error middleware.

An example startup flow looks like this:

    import app from './app.js';
    import sequelize from './config/database.js';

    const startServer = async () => {
      await sequelize.authenticate();
      app.listen(process.env.PORT || 5000);
    };

Environment variables control port, database credentials, and JWT secrets so deployment does not depend on hard-coded settings.

## 6. Database Design with PostgreSQL and Sequelize

Medblood uses three core models: User, Donation, and BloodType.

### User model

The User model stores identity and authorization context:

- id as UUID,
- name,
- email,
- password hash,
- role with donor, hospital, or admin.

### BloodType model

BloodType standardizes blood group and rhesus factor:

- bloodGroup as A, B, AB, O,
- rhesusFactor as + or -,
- a combined code like A+.

Keeping blood type separate helps avoid inconsistent values and supports compatibility logic cleanly.

### Donation model

Donation stores operational donation details:

- blood group and rhesus factor,
- quantity,
- location,
- health status,
- last test date,
- availability status,
- donor foreign key,
- blood type foreign key.

### Relationships and associations

The primary relationship pattern is one-to-many:

- one user has many donations,
- one blood type has many donations,
- each donation belongs to one user and one blood type.

Foreign keys enforce ownership and type references. Sequelize associations make it easy to include donor details when listing donations, while still preserving normalized relational structure.

## 7. Authentication and Security

Security in Medblood is implemented as a layered pipeline, not a single middleware.

### Signup and login

On signup, user passwords are hashed with bcrypt before persistence. On login, the submitted password is compared to the stored hash. If valid, a JWT token is generated with user id and role claims.

### JWT verification and protected routes

Public routes are limited to signup and login. All other API routes pass through authentication middleware that validates bearer tokens and loads user context into the request.

A typical protected route flow:

    Authorization: Bearer <token>

    1) middleware verifies token signature and expiry
    2) middleware fetches current user
    3) request continues only when user is valid

### Role-based access control

After authentication, role checks enforce endpoint permissions:

- donors and admins can create donation records,
- hospitals and admins can run compatibility searches,
- admin-only routes manage users.

This two-step model, identity verification first and role authorization second, is critical for secure APIs. It prevents both anonymous access and privilege escalation.

## 8. Implementing CRUD Operations

CRUD in Medblood is implemented with practical restrictions and query patterns.

### Create: creating blood donations

Donors submit donation payloads that include blood data, quantity, and location. Before insertion, the API validates blood type combinations and associates the donation with the authenticated donor.

### Read: fetching blood types and donations

Read endpoints provide:

- blood type listing,
- donation list with pagination,
- donation retrieval by id,
- filtering by blood group, rhesus factor, and location.

For donor users, listing is automatically scoped to their own records. This is a good example of role-aware query building.

### Update: updating donation information

Update requests allow partial field edits. If blood group or factor changes, compatibility references are recomputed to keep blood type relationships correct.

### Delete: removing blood donation offers

Delete operations remove donation offers that are no longer valid or available. Ownership checks ensure donors cannot delete records that belong to someone else.

### Request flow and database interaction

Most endpoints follow a repeatable pipeline:

- route definition,
- validation middleware,
- authentication middleware,
- optional role middleware,
- controller logic,
- Sequelize query or mutation,
- structured JSON response.

This predictable flow makes debugging easier and reduces accidental security holes.

## 9. Blood Compatibility Matching Logic

This is the feature that makes Medblood more than a generic CRUD project.

The API contains compatibility logic that maps recipient blood type to all compatible donor blood types. It handles standard medical rules including:

- O- as universal donor,
- AB+ as universal receiver,
- rhesus factor constraints for positive and negative recipients.

When a hospital queries compatible donors, the API does more than filter exact type matches. It computes all compatible donor combinations, then searches available donation records that satisfy those combinations, optionally narrowed by location.

This improves operational usefulness because hospitals can receive realistic alternatives instead of a strict one-type match.

## 10. Error Handling and Validation

A robust API is defined as much by failure behavior as by success behavior.

### Middleware-based error handling

Medblood centralizes errors through a global handler that returns consistent JSON responses. This prevents fragmented error formats across controllers.

### Input validation

Request payloads and query params are validated before controller execution. Invalid fields return clear 400 responses with validation details.

### Handling invalid tokens and missing data

Authentication middleware handles:

- missing bearer token,
- malformed token,
- expired or invalid signature,
- token with user that no longer exists.

Validation and authorization middleware handle missing fields and forbidden actions with explicit status codes.

### Handling database errors

Database-level issues such as invalid foreign keys or missing records are converted to predictable API messages. This is important for client-side reliability and monitoring.

## 11. Testing the API with Postman

Postman was used to validate both happy paths and security edge cases.

The practical testing flow:

- register and log in users for donor, hospital, and admin roles,
- store JWT tokens in environment variables,
- test protected routes with and without tokens,
- run CRUD operations on donation records,
- verify role restrictions,
- test compatibility search with different blood types,
- assert response shape and status codes.

Key checks include:

- 401 for missing or invalid token,
- 403 for unauthorized role access,
- 404 for missing resources,
- 400 for validation failures.

This testing strategy ensured the API behaves correctly not only when used properly, but also when misused.

## 12. Challenges Faced During Development

Building Medblood surfaced realistic backend challenges.

### JWT authentication edge cases

Early issues included token parsing assumptions and inconsistent error messages for invalid vs missing tokens. Standardizing these responses improved debugging and client integration.

### Sequelize associations

Relationship mapping between Donation, User, and BloodType required careful alias naming and include usage to avoid broken joins and unclear response payloads.

### Route protection strategy

Protecting all non-auth routes globally while still allowing public auth endpoints required thoughtful route mounting order. Getting this wrong can unintentionally expose or block endpoints.

### Database relationships and ownership

Enforcing donor ownership checks while allowing admin override required explicit logic in controllers, not just route-level role gates.

### Compatibility logic correctness

Compatibility is easy to oversimplify. Ensuring recipient-based donor matching reflected true blood compatibility rules required dedicated service-layer logic and scenario testing.

## 13. Lessons Learned

This project reinforced several backend engineering principles:

- Domain logic should be isolated in service modules, not scattered in controllers.
- Security should be layered: validation, authentication, authorization, and ownership checks.
- Predictable response contracts improve frontend and external API consumer experience.
- Relational modeling decisions strongly affect query simplicity and system correctness.
- Middleware-driven architecture keeps business code focused and reusable.

Most importantly, a good CRUD API is not just about database operations. It is about safe, consistent, and context-aware behavior under real usage.

## 14. Future Improvements

If Medblood continues toward production, the next practical features would be:

- Email notifications for successful donor registration and record updates.
- SMS alerts for urgent compatible donor availability.
- Geolocation-based donor discovery to reduce response time in large cities.
- Real-time availability updates for donation records.
- Hospital dashboards with analytics and filtering presets.
- Audit logs for admin actions.
- Refresh token support for stronger session lifecycle control.

These additions would improve both operational value and platform trust.

## 15. Conclusion

Medblood demonstrates how to build a secure, modular, and practical CRUD API with Node.js and PostgreSQL. The project combines authentication, role-based access, relational modeling, compatibility logic, and structured error handling into one cohesive backend system.

Beyond delivering endpoints, the project reflects core backend engineering skills: architecture design, database modeling, API security, business rule implementation, and testing discipline.

In real systems, especially healthcare-related workflows, secure CRUD APIs are foundational. Medblood is a strong example of how to move from basic endpoint development to a backend design that is reliable, maintainable, and aligned with real-world needs.
