# LuxLink API Documentation

**Base URL:** `https://localhost:3000/api`  
**Version:** 2.0  
**Last updated:** 2026-06-16

---

## Overview

LuxLink exposes two authentication mechanisms:

| Mechanism | Used by | How |
|---|---|---|
| **Session cookie** | Web app (browser) | Cookie set on login, managed automatically |
| **API key** | External integrations | `x-api-key` header on `/api/v1/` routes |

### Authentication levels

| Level | Description |
|---|---|
| Public | No authentication required |
| Authenticated | Valid session cookie required |
| Freelancer | Authenticated + `accountType === 'freelancer'` |
| Company | Authenticated + `accountType === 'company'` |
| Admin | Authenticated + `role === 'admin'` |
| API Key | Valid `x-api-key` header on `/api/v1/` routes |

### Common HTTP status codes

| Code | Meaning |
|---|---|
| `200` | Success |
| `400` | Bad request / validation error |
| `401` | Not authenticated or invalid credentials |
| `403` | Forbidden — wrong role or spoofing detected |
| `404` | Resource not found |
| `409` | Conflict — e.g. duplicate email |
| `429` | Rate limit exceeded (v1 API only) |
| `500` | Internal server error |

### Error response format

```json
{
  "statusCode": 403,
  "statusMessage": "Forbidden",
  "message": "Payload authentication spoofing detected."
}
```

---

## Authentication (`/api/auth`)

### POST `/api/auth/register`

Register a new user account.

**Auth:** Public

**Request body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `email` | `string` | ✅ | Valid email address |
| `password` | `string` | ✅ | Account password |
| `accountType` | `'freelancer' \| 'company'` | ✅ | Account type |
| `firstName` | `string` | ✅ (freelancer) | First name |
| `lastName` | `string` | ✅ (freelancer) | Last name |
| `companyName` | `string` | ✅ (company) | Company name |
| `contactFirstName` | `string` | ✅ (company) | Contact first name |
| `contactLastName` | `string` | ✅ (company) | Contact last name |
| `country` | `CountryEnum` | ✅ | Country of residence |

**Response `200`:**
```json
{
  "id": 1,
  "email": "user@example.com",
  "accountType": "freelancer",
  "role": "user",
  "firstName": "Jane",
  "lastName": "Doe",
  "avatarUrl": null
}
```

**Errors:**
- `409` — Email already registered

**Notes:** A session cookie is set automatically on successful registration.

---

### POST `/api/auth/login`

Authenticate an existing user.

**Auth:** Public

**Request body:**

| Field | Type | Required |
|---|---|---|
| `email` | `string` | ✅ |
| `password` | `string` | ✅ |

**Response `200`:**
```json
{
  "id": 1,
  "email": "user@example.com",
  "accountType": "freelancer",
  "role": "user",
  "firstName": "Jane",
  "lastName": "Doe",
  "avatarUrl": "https://..."
}
```

**Errors:**
- `401` — Invalid credentials

**Notes:** Sets a session cookie. The `loggedInAt` timestamp is stored in the session.

---

### PATCH `/api/auth/change-password`

Change the authenticated user's password.

**Auth:** Authenticated

**Request body:**

| Field | Type | Required |
|---|---|---|
| `oldPassword` | `string` | ✅ |
| `newPassword` | `string` | ✅ |
| `confirmPassword` | `string` | ✅ |

**Response `200`:**
```json
{
  "id": 1,
  "updatedAt": "2026-06-16T10:00:00.000Z"
}
```

**Errors:**
- `401` — Wrong current password

---

### PATCH `/api/auth/change-email`

Change the authenticated user's email address.

**Auth:** Authenticated

**Request body:**

| Field | Type | Required |
|---|---|---|
| `email` | `string` | ✅ — must be valid email format |

**Response `200`:** Updated user object

**Notes:** Session is updated immediately with the new email.

---

### PATCH `/api/auth/update-api-key`

Update an existing API key (admin only).

**Auth:** Admin

**Request body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `userId` | `number` | ✅ | User the key belongs to |
| `key` | `string` | ❌ | New key value |
| `name` | `string` | ❌ | Key display name |
| `is_active` | `boolean` | ❌ | Enable/disable the key |
| `expires_at` | `string` | ❌ | ISO expiry date |

**Response `200`:** Updated API key object

**Notes:** No endpoint currently exists to create a new API key from scratch.

---

### GET `/api/oauth/google`

Google OAuth callback handler.

**Auth:** Public (OAuth flow)

**Notes:** Handled automatically by the OAuth flow. On success, creates or retrieves the user account as a freelancer and sets a session. Redirects to `/` on success or `/?error=auth_failed` on failure.

---

## Account (`/api/account`)

### GET `/api/account`

Retrieve the authenticated user's account information.

**Auth:** Authenticated

**Response `200`:**
```json
{
  "email": "user@example.com"
}
```

---

### PATCH `/api/account`

Update the authenticated user's account information.

**Auth:** Authenticated

**Request body:**

| Field | Type | Description |
|---|---|---|
| `email` | `string` | New email address |

**Response `200`:** Updated account object

---

### DELETE `/api/account`

Permanently delete the authenticated user's account.

**Auth:** Authenticated

**Request body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `password` | `string` | ✅ | Current password for verification |

**Response `200`:**
```json
{ "success": true }
```

**Errors:**
- `400` — Password not provided
- `401` — Invalid password

**Notes:** Deletes all associated data via cascade (profile, jobs, offers, bookings). Session is cleared immediately after deletion.

---

## Profile (`/api/profile`)

Profile refers to the public-facing professional information.

### GET `/api/profile`

Retrieve the authenticated user's own profile.

**Auth:** Authenticated

**Response `200` — Freelancer:**
```json
{
  "type": "freelancer",
  "userId": 1,
  "firstName": "Jane",
  "lastName": "Doe",
  "country": "lu",
  "avatar": "https://...",
  "bio": "Full-stack developer...",
  "skills": ["javascript", "python"],
  "languages": ["english", "french"],
  "hourlyRate": 75.00
}
```

**Response `200` — Company:**
```json
{
  "type": "company",
  "userId": 2,
  "companyName": "Acme Corp",
  "contactFirstName": "John",
  "contactLastName": "Smith",
  "country": "lu",
  "website": "https://acme.lu",
  "logo": "https://...",
  "description": "We build great software."
}
```

---

### PATCH `/api/profile`

Update the authenticated user's profile.

**Auth:** Authenticated

**Security:** Request body must include `userId` matching the session user and `type` matching the session `accountType` — otherwise returns `403` (spoofing protection).

**Request body — Freelancer** (all optional except `type` and `userId`):

| Field | Type |
|---|---|
| `type` | `'freelancer'` ✅ |
| `userId` | `number` ✅ |
| `firstName` | `string` |
| `lastName` | `string` |
| `country` | `CountryEnum` |
| `avatar` | `string \| null` |
| `bio` | `string \| null` |
| `skills` | `SkillEnum[]` |
| `languages` | `LanguageEnum[]` |
| `hourlyRate` | `number \| null` |

**Request body — Company** (all optional except `type` and `userId`):

| Field | Type |
|---|---|
| `type` | `'company'` ✅ |
| `userId` | `number` ✅ |
| `companyName` | `string` |
| `contactFirstName` | `string` |
| `contactLastName` | `string` |
| `country` | `CountryEnum` |
| `website` | `string \| null` |
| `logo` | `string \| null` |
| `description` | `string \| null` |

**Response `200`:** Updated profile object

**Errors:**
- `403` — `userId` or `type` doesn't match session

---

### POST `/api/profile/avatar`

Upload a profile picture.

**Auth:** Authenticated

**Request:** `multipart/form-data`

| Field | Constraints |
|---|---|
| `avatar` | Max 2MB, JPEG/PNG/WEBP/GIF only |

**Response `200`:**
```json
{ "avatar": "https://..." }
```

**Errors:**
- `400` — No file, wrong type, or file too large

---

## Public Profiles (`/api/profiles`)

### GET `/api/profiles/freelancers`

List all freelancer public profiles.

**Auth:** Public

**Response `200`:** Array of freelancer profile objects

---

### GET `/api/profiles/[id]`

Get a public profile by user ID.

**Auth:** Public

**URL params:** `id` — user ID (integer)

**Response `200`:** Freelancer or company profile object

**Errors:**
- `404` — User not found

---

## Jobs — Public (`/api/jobs/public`)

### GET `/api/jobs/public`

List all active jobs.

**Auth:** Public

**Response `200`:**
```json
[
  {
    "id": 1,
    "title": "React Developer needed",
    "description": "...",
    "category": "development",
    "skills": ["javascript", "react"],
    "hourlyRate": 80.00,
    "duration": 3,
    "workplace": "remote",
    "location": "lu",
    "status": "active",
    "createdAt": "2026-06-01T00:00:00.000Z",
    "updatedAt": "2026-06-01T00:00:00.000Z"
  }
]
```

---

### GET `/api/jobs/public/[id]`

Get a single job by ID.

**Auth:** Public

**URL params:** `id` — job ID (integer)

**Response `200`:** Single job object

**Errors:**
- `404` — Job not found

---

## Jobs — Company (`/api/jobs/company`)

### GET `/api/jobs/company`

List all jobs posted by the authenticated company.

**Auth:** Company

**Response `200`:** Array of job objects belonging to the authenticated company

---

### POST `/api/jobs/company`

Create a new job offer.

**Auth:** Company

**Request body:**

| Field | Type | Required | Constraints |
|---|---|---|---|
| `title` | `string` | ✅ | Min 1 character |
| `description` | `string` | ✅ | Min 30 characters |
| `category` | `CategoryEnum` | ✅ | |
| `skills` | `SkillEnum[]` | ✅ | Min 1 skill |
| `hourlyRate` | `number` | ✅ | Positive, max 500 |
| `duration` | `number` | ✅ | Integer 1–12 months |
| `workplace` | `WorkplaceEnum` | ✅ | |
| `location` | `CountryEnum` | ✅ | |
| `status` | `JobStatusEnum` | ✅ | Default `'active'` |

**Response `200`:** Created job object

---

### PATCH `/api/jobs/company/[id]`

Update an existing job.

**Auth:** Company (must own the job)

**URL params:** `id` — job ID (integer)

**Request body:** Same fields as POST, all optional

**Response `200`:** Updated job object

**Errors:**
- `400` — Invalid job ID
- `404` — Job not found or not owned by user

---

### DELETE `/api/jobs/company/[id]`

Delete a job offer.

**Auth:** Company (must own the job)

**URL params:** `id` — job ID (integer)

**Response `200`:** Deleted job object

**Errors:**
- `400` — Invalid job ID
- `404` — Job not found or not owned by user

---

## Jobs — Freelancer (`/api/jobs/freelancer`)

### GET `/api/jobs/freelancer`

List all jobs available to the authenticated freelancer.

**Auth:** Freelancer

**Response `200`:** Array of job objects

---

### GET `/api/jobs/freelancer/[id]`

Get a specific job by ID for a freelancer.

**Auth:** Freelancer

**URL params:** `id` — job ID (integer)

**Response `200`:** Single job object

---

## Offers (`/api/offers`)

Offers are applications submitted by freelancers to job postings.

### GET `/api/offers/freelancer`

List all offers submitted by the authenticated freelancer.

**Auth:** Freelancer

**Response `200`:**
```json
[
  {
    "id": 1,
    "jobId": 5,
    "buyerId": 3,
    "sellerId": 1,
    "status": "pending",
    "motivationLetter": "I am very interested...",
    "proposedHourlyRate": 70.00,
    "proposedDuration": 3,
    "proposedWorkplace": "remote",
    "sellerAgreed": null,
    "buyerAgreed": null,
    "sellerDeclined": null,
    "buyerDeclined": null,
    "createdAt": "2026-06-01T00:00:00.000Z",
    "updatedAt": "2026-06-01T00:00:00.000Z"
  }
]
```

---

### GET `/api/offers/freelancer/[id]`

Get a specific offer by ID.

**Auth:** Freelancer (must own the offer)

**URL params:** `id` — offer ID (integer)

**Response `200`:** Single offer object

---

### POST `/api/offers/freelancer/[id]`

Submit an offer for a job. The `[id]` is the **job ID**.

**Auth:** Freelancer

**URL params:** `id` — job ID (integer)

**Request body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `motivationLetter` | `string` | ✅ | Cover letter |
| `proposedHourlyRate` | `number \| null` | ❌ | Override job rate |
| `proposedDuration` | `number \| null` | ❌ | Override duration |
| `proposedWorkplace` | `WorkplaceEnum \| null` | ❌ | Override workplace |

**Response `200`:** Created offer object

**Notes:** One offer per freelancer per job (unique constraint).

---

### PATCH `/api/offers/freelancer/[id]`

Update an existing offer.

**Auth:** Freelancer (must own the offer)

**URL params:** `id` — job ID (integer)

**Request body:** Same fields as POST, all optional

**Response `200`:** Updated offer object

---

### DELETE `/api/offers/freelancer/[id]`

Withdraw an offer.

**Auth:** Freelancer (must own the offer)

**URL params:** `id` — offer ID (integer)

**Response `200`:** Deleted offer object

---

### GET `/api/offers/company/[id]`

Get all offers received for a specific job. The `[id]` is the **job ID**.

**Auth:** Company (must own the job)

**URL params:** `id` — job ID (integer)

**Response `200`:** Array of offer objects

---

### GET `/api/offers/[id]`

Get a specific offer by ID.

**Auth:** Authenticated

**URL params:** `id` — offer ID (integer)

**Response `200`:** Single offer object

---

### PATCH `/api/offers/accept/[id]`

Accept an offer.

**Auth:** Authenticated (Company or Freelancer)

**URL params:** `id` — offer ID (integer)

**Response `200`:** Updated offer with agreement timestamps

---

### PATCH `/api/offers/decline/[id]`

Decline an offer.

**Auth:** Authenticated (Company or Freelancer)

**URL params:** `id` — offer ID (integer)

**Response `200`:** Updated offer with `status: 'declined'`

---

## Bookings (`/api/bookings`)

### GET `/api/bookings`

List all bookings for the authenticated user (as buyer or seller).

**Auth:** Authenticated

**Response `200`:**
```json
[
  {
    "id": 1,
    "offerId": 3,
    "jobId": 5,
    "buyerId": 2,
    "sellerId": 1,
    "price": 2400.00,
    "hourlyRate": 80.00,
    "duration": 3,
    "workplace": "remote",
    "status": "upcoming",
    "createdAt": "2026-06-01T00:00:00.000Z",
    "updatedAt": "2026-06-01T00:00:00.000Z"
  }
]
```

---

### POST `/api/bookings/admin`

Manually create a booking.

**Auth:** Admin

**Request body:**

| Field | Type | Required |
|---|---|---|
| `offerId` | `number` | ✅ |
| `jobId` | `number` | ✅ |
| `buyerId` | `number` | ✅ |
| `sellerId` | `number` | ✅ |
| `price` | `number` | ✅ |
| `hourlyRate` | `number` | ✅ |
| `duration` | `number` | ✅ |
| `workplace` | `WorkplaceEnum` | ✅ |

**Response `200`:** Created booking object

---

### GET `/api/bookings/admin/[id]`

Get a booking by ID.

**Auth:** Admin

**Response `200`:** Single booking object

---

### PATCH `/api/bookings/admin/[id]`

Update a booking.

**Auth:** Admin

**Response `200`:** Updated booking object

---

### DELETE `/api/bookings/admin/[id]`

Delete a booking.

**Auth:** Admin

**Response `200`:** Deleted booking object

---

## Admin — Users (`/api/admin/users`)

### GET `/api/admin/users`

List all users, with optional search.

**Auth:** Admin

**Query params:**

| Param | Type | Description |
|---|---|---|
| `search` | `string` | Filter by email (partial match) |

**Response `200`:**
```json
[
  {
    "id": 1,
    "email": "user@example.com",
    "accountType": "freelancer",
    "role": "user",
    "createdAt": "2026-06-01T00:00:00.000Z",
    "updatedAt": "2026-06-01T00:00:00.000Z"
  }
]
```

---

### GET `/api/admin/users/[id]`

Get a single user with full profile.

**Auth:** Admin

**URL params:** `id` — user ID (integer)

**Response `200`:**
```json
{
  "id": 1,
  "email": "user@example.com",
  "accountType": "freelancer",
  "role": "user",
  "createdAt": "...",
  "updatedAt": "...",
  "profile": {
    "firstName": "Jane",
    "lastName": "Doe",
    "country": "lu",
    "bio": "...",
    "skills": [],
    "languages": [],
    "hourlyRate": 75
  }
}
```

**Errors:**
- `404` — User not found

---

### PATCH `/api/admin/users/[id]`

Update a user's account and profile data.

**Auth:** Admin

**URL params:** `id` — user ID (integer)

**Request body:** Any combination of account or profile fields

**Response `200`:** `{ "success": true }`

**Side effects:** Creates an in-app notification for the affected user.

---

### DELETE `/api/admin/users/[id]`

Permanently delete a user account.

**Auth:** Admin

**URL params:** `id` — user ID (integer)

**Request body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `adminPassword` | `string` | ✅ | Admin's own password for verification |

**Response `200`:** Deleted user object

**Errors:**
- `400` — Admin password not provided
- `401` — Invalid admin password
- `403` — Admin cannot delete their own account
- `404` — User not found

---

## Presence (`/api/presence`)

### GET `/api/presence/auth`

Generate a single-use WebSocket authentication ticket.

**Auth:** Authenticated

**Response `200`:**
```json
{ "ticket": "550e8400-e29b-41d4-a716-446655440000" }
```

**Notes:** Ticket is valid for 10 seconds. Used to authenticate WebSocket connections without exposing the session cookie. Consumed once — a new ticket must be requested for each WebSocket connection.

---

## v1 API — API Key Authentication (`/api/v1`)

These endpoints mirror the session-based job endpoints but use API key authentication for external integrations.

### Authentication

All `/api/v1/` requests must include:
```
x-api-key: your-api-key-here
```

Missing or invalid keys return `401`. Inactive keys return `401`.

### Rate Limiting

Requests are rate-limited to **5 per minute per API key**.

Response headers on every v1 request:

| Header | Description |
|---|---|
| `X-RateLimit-Limit` | Max requests per window (5) |
| `X-RateLimit-Remaining` | Remaining requests this window |
| `X-RateLimit-Reset` | Seconds until window resets |

When the limit is exceeded: `429 Too Many Requests` with `Retry-After` header.

### Role enforcement

API keys are tied to an account type. Company keys can only access company endpoints and vice versa.

---

### GET `/api/v1/jobs/company`

List company jobs via API key.

**Auth:** API Key (Company)

**Response `200`:** Array of job objects

---

### POST `/api/v1/jobs/company`

Create a job via API key.

**Auth:** API Key (Company)

**Request body:** Same as `POST /api/jobs/company`

**Response `200`:** Created job object

---

### GET `/api/v1/jobs/company/[id]`

Get a job by ID via API key.

**Auth:** API Key (Company)

**Response `200`:** Single job object

---

### PATCH `/api/v1/jobs/company/[id]`

Update a job via API key.

**Auth:** API Key (Company)

**Response `200`:** Updated job object

---

### DELETE `/api/v1/jobs/company/[id]`

Delete a job via API key.

**Auth:** API Key (Company)

**Response `200`:** Deleted job object

---

## Enums

Sending a value outside these lists results in a `400` validation error.

### `AccountTypeEnum`
`freelancer` | `company`

### `RoleEnum`
`user` | `admin`

### `WorkplaceEnum`
`remote` | `onsite` | `hybrid`

### `OfferStatusEnum`
`pending` | `accepted` | `declined`

### `BookingStatusEnum`
`upcoming` | `ongoing` | `completed` | `cancelled`

### `JobStatusEnum`
`active` | `closed`

### `CategoryEnum`
Defined in `shared/constants/enums.ts` — refer to source for full list.

### `SkillEnum`
Defined in `shared/constants/enums.ts` — refer to source for full list.

### `LanguageEnum`
Defined in `shared/constants/enums.ts` — refer to source for full list.

### `CountryEnum`
Defined in `shared/constants/enums.ts` — refer to source for full list.

---

## Deprecated

The following server-side DTOs are marked as deprecated in the codebase:

- `server/dto/user.dto.ts` — replaced by shared Zod schema in `shared/dto/user.dto.ts`
- `server/dto/profile.dto.ts` — replaced by shared Zod schema in `shared/dto/profile.dto.ts`
