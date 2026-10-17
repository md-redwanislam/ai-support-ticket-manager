# AI-Powered Support Ticket Manager

An AI-powered support ticket management system that helps users submit support issues, generate ticket suggestions with AI, and track ticket progress. Administrators can view and manage tickets across all users.

This project is being developed as a full-stack assessment project, emphasizing authentication, authorization, database relationships, AI integration, API validation, testing, and secure backend design.

## 1. Project Overview

SupportDesk simplifies support ticket management by combining a structured ticket workflow with AI-assisted ticket creation.

Users can describe a problem in their own words, receive AI-generated suggestions for the ticket title, summary, category, and priority, review or edit those suggestions, and submit the ticket.

Administrators can view tickets across all users and manage their status, priority, and other ticket details.

### Key Features

- User registration and login.
- Secure password hashing and HTTP-only authentication cookies.
- JWT-based authentication.
- Role-based access control for users and administrators.
- Ticket creation, viewing, updating, and deletion.
- Ticket ownership enforcement.
- AI-generated ticket title, summary, category, and priority suggestions.
- Input validation using Zod.
- PostgreSQL database with Prisma ORM.
- Automated unit tests using Vitest.
- Responsive dashboard interface (under development).
- Light and dark themes (planned).
- Deployment to Vercel (planned).

## 2. Technology Stack

| Technology | Purpose |
|---|---|
| Next.js 16 (App Router) | Full-stack framework, UI, and API routes |
| React | User interface |
| TypeScript | Type safety |
| Tailwind CSS | Styling and responsive layouts |
| PostgreSQL | Relational database |
| NeonDB | Hosted PostgreSQL database |
| Prisma ORM 7 | Database access and schema management |
| `@prisma/adapter-pg` | PostgreSQL adapter for Prisma |
| `pg` | PostgreSQL connectivity |
| `bcryptjs` | Password hashing |
| `jose` | JWT creation and verification |
| Zod | Request and AI-response validation |
| OpenRouter | AI model API integration |
| Vitest | Automated testing |
| Sonner | Toast notifications |
| Yarn Classic | Package management |
| Vercel | Planned application deployment |

## 3. Database Design

The application uses PostgreSQL, hosted on NeonDB, with Prisma ORM for database access and migrations.

### User Model

Stores user account information.

| Field | Description |
|---|---|
| `id` | Unique UUID |
| `name` | User's name |
| `email` | Unique email address |
| `passwordHash` | Hashed password |
| `role` | `USER` or `ADMIN` |
| `createdAt` | Account creation timestamp |

### Ticket Model

Stores support tickets submitted by users.

| Field | Description |
|---|---|
| `id` | Unique UUID |
| `title` | Ticket title |
| `description` | Original problem description |
| `summary` | AI-generated or manually provided summary; nullable |
| `category` | Ticket classification |
| `priority` | Ticket priority |
| `status` | Current workflow status |
| `userId` | ID of the ticket owner |
| `createdAt` | Ticket creation timestamp |
| `updatedAt` | Last update timestamp |

### Enums

**UserRole**

- `USER`
- `ADMIN`

**TicketStatus**

- `OPEN`
- `IN_PROGRESS`
- `RESOLVED`

**TicketPriority**

- `LOW`
- `MEDIUM`
- `HIGH`
- `URGENT`

**TicketCategory**

- `TECHNICAL`
- `BILLING`
- `ACCOUNT`
- `GENERAL`
- `OTHER`

### Relationships and Indexes

- One user can have many tickets.
- Each ticket belongs to one user.
- The `userId` foreign key connects tickets to their owners.
- Deleting a user cascades to that user's tickets.
- Database indexes support common queries involving ticket ownership, creation date, status, priority, and category.

The initial Prisma migration has been successfully applied to NeonDB.

## 4. Authentication and Authorization

The application uses JWT-based authentication with secure, HTTP-only cookies.

### Authentication

- Passwords are hashed with `bcryptjs` before storage.
- JWTs are signed and verified using `jose`.
- Authentication tokens are stored in HTTP-only cookies.
- The server retrieves the authenticated user from the database.
- Public API responses exclude password hashes.

### Authorization

**Regular users (`USER`)**

- Can create support tickets.
- Can view only their own tickets.
- Can edit their own tickets while their status is `OPEN`.
- Can delete their own tickets while their status is `OPEN`.
- Cannot assign themselves an administrator role.
- Cannot change ticket status or priority through the regular-user update route.

**Administrators (`ADMIN`)**

- Can view tickets belonging to all users.
- Can update ticket details, status, and priority.
- Can delete tickets.

Authorization is enforced on the server. Hiding an action in the frontend is not considered a security boundary.

## 5. AI Integration

The application integrates with OpenRouter to generate structured ticket suggestions.

### Input

The user provides a natural-language description of a problem.

Example:

> I cannot log in to my account even when I enter the correct password.

### AI-generated suggestions

The AI returns the following fields:

- **Title:** A concise ticket title.
- **Summary:** A short summary of the reported issue.
- **Category:** One of `TECHNICAL`, `BILLING`, `ACCOUNT`, `GENERAL`, or `OTHER`.
- **Priority:** One of `LOW`, `MEDIUM`, `HIGH`, or `URGENT`.

### Workflow

1. The authenticated user enters a problem description.
2. The frontend sends the description to the AI suggestion endpoint.
3. The server requests structured output from the configured OpenRouter model.
4. The server validates the returned response using Zod.
5. The frontend displays the suggestions for review.
6. The user can edit the suggested fields before submitting the ticket.
7. The ticket is created through the normal ticket API.

The AI does not determine the authenticated user, ticket owner, or initial ticket status. Those values are controlled by the backend.

AI output may be inaccurate, so users should review suggestions before submitting. AI availability also depends on the configured model and the provider's current limits.


## 6. Environment Configuration

The application uses environment variables for database connectivity, JWT signing, and AI access.

Create a `.env` file in the project root:

```dotenv
DATABASE_URL="your-neon-database-connection-string"
JWT_SECRET="your-generated-jwt-secret"
OPENROUTER_API_KEY="your-openrouter-api-key"
OPENROUTER_MODEL="openrouter/free"
```

### Environment Variables

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string from NeonDB |
| `JWT_SECRET` | Secret used to sign and verify authentication tokens |
| `OPENROUTER_API_KEY` | API key for OpenRouter |
| `OPENROUTER_MODEL` | OpenRouter model identifier; defaults to `openrouter/free` if not configured |

Generate a JWT secret using:

```bash
openssl rand -base64 32
```

Use the PostgreSQL connection string provided by NeonDB. Ensure it is suitable for your environment and connection pooling setup.

**Security requirements:**

- Never commit `.env` to Git.
- Never expose `JWT_SECRET` or `OPENROUTER_API_KEY` in browser-side code.
- Configure the same required variables in the deployment environment.
- Use separate credentials for development, testing, and production.
- Do not use the demo administrator password in a production deployment.

## 7. Prerequisites

Before running the project, ensure you have:

- Node.js installed (Node.js 24 or a compatible supported version).
- Yarn Classic 1.22.x.
- A NeonDB PostgreSQL database, or another compatible PostgreSQL database.
- An OpenRouter API key for AI suggestions.
- Git installed.

Check your installed versions:

```bash
node --version
yarn --version
git --version
```

## 8. Local Setup and Installation

### Step 1: Clone the repository

```bash
git clone https://github.com/md-redwanislam/ai-support-ticket-manager.git
cd ai-support-ticket-manager
```


### Step 2: Install dependencies

```bash
yarn install
```

### Step 3: Configure environment variables

Create the `.env` file in the project root and populate it using the example in Section 6.

### Step 4: Generate the Prisma client

```bash
yarn prisma generate
```

Prisma 7 uses the project's Prisma configuration file and the configured database adapter.

### Step 5: Apply database migrations

For an existing database with committed migrations, apply them using:

```bash
yarn prisma migrate deploy
```

For local development, when creating a new migration after modifying the schema, use:

```bash
yarn prisma migrate dev --name describe_your_change
```

Replace `describe_your_change` with a short description of the schema change.

Do not run development migrations against production without reviewing the migration and confirming the target database.

### Step 6: Start the development server

```bash
yarn dev
```

Open:

```text
http://localhost:3000
```



## 9. Demo Credentials

The following credentials for admin:

| Field | Value |
|---|---|
| Role | `ADMIN` |
| Email | `admin@example.com` |
| Password | `qwer4321` |


## 10. Build and Production Run

Check that the application compiles:

```bash
yarn build
```

Start the production build locally:

```bash
yarn start
```

The production build requires the appropriate environment variables to be configured. Ensure the database is accessible before testing database-backed endpoints.

## License

Add the appropriate license for this project before distributing it publicly.
