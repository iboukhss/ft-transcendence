# LuxLink API Documentation

**Base URL:** `https://localhost:3000/api`  
**Version:** 5.0  
**Last updated:** 2026-06-19

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
| `403` | Forbidden — wrong role, ownership, or spoofing detected |
| `404` | Resource not found |
| `409` | Conflict — e.g. duplicate email or offer |
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

**Response `200`:** Session user object (same shape as register)

**Errors:**
- `401` — Invalid credentials

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
{ "id": 1, "updatedAt": "2026-06-19T10:00:00.000Z" }
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
| `email` | `string` | ✅ |

**Response `200`:** Updated user object

**Notes:** Session is updated immediately with the new email.

---

### GET `/api/oauth/google`

Google OAuth callback handler.

**Auth:** Public (OAuth flow)

**Notes:** On success, creates or retrieves the user account as a freelancer and sets a session.

---

## Account (`/api/account`)

### GET `/api/account`

**Auth:** Authenticated

**Response `200`:** `{ "email": "user@example.com" }`

---

### PATCH `/api/account`

**Auth:** Authenticated

**Request body:** `{ "email": "string" }`

**Response `200`:** Updated account object

---

### DELETE `/api/account`

Permanently delete the authenticated user's account.

**Auth:** Authenticated

**Request body:**

| Field | Type | Required |
|---|---|---|
| `password` | `string` | ✅ |

**Response `200`:** `{ "success": true }`

**Errors:**
- `400` — Password not provided
- `401` — Invalid password

**⚠️ Known issue:** Deletion can fail with a `500` foreign key constraint error if the user has any offers (as buyer or seller) or bookings, because `offers.buyerId`, `offers.sellerId`, and the `bookings` foreign keys do not currently have `onDelete: 'cascade'` in the schema. This should be fixed before relying on this endpoint for GDPR compliance testing.

---

## Profile (`/api/profile`)

### GET `/api/profile`

**Auth:** Authenticated

**Response `200`:** Freelancer or company profile object (see Jobs section for shape examples)

---

### PATCH `/api/profile`

**Auth:** Authenticated

**Security:** Body must include `userId` matching session and `type` matching session `accountType` — otherwise `403`.

**Response `200`:** Updated profile object

---

### PUT `/api/profile/avatar`

Upload or replace a profile picture.

**Auth:** Authenticated

**Request:** `multipart/form-data`, field `avatar` (max 2MB, JPEG/PNG/WEBP/GIF)

**Response `200`:** `{ "avatarUrl": "https://..." }`

**Notes:** Automatically deletes the previous avatar first. Updates session immediately.

---

### DELETE `/api/profile/avatar`

**Auth:** Authenticated

**Response `200`:** `{ "success": true }`

---

## Public Profiles (`/api/profiles`)

### GET `/api/profiles/freelancers`

**Auth:** Public — list all freelancer profiles

### GET `/api/profiles/[id]`

**Auth:** Public — get a profile by user ID

**Errors:** `404` — User not found

---

## Jobs (`/api/jobs`)

### GET `/api/jobs`

**Auth:** Public

**Query params:** `userId` — filter by company

**Response `200`:**
```json
[
  {
    "id": 1,
    "title": "React Developer needed",
    "description": "...",
    "category": "software_development",
    "skills": ["javascript", "typescript"],
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

### POST `/api/jobs`

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

### GET `/api/jobs/[id]`

**Auth:** Public

**Response `200`:** Single job object

**Errors:** `400` — invalid ID · `404` — not found

---

### PATCH `/api/jobs/company/[id]`

**Auth:** Company (must own the job)

**Response `200`:** Updated job object

---

### DELETE `/api/jobs/company/[id]`

**Auth:** Company (must own the job)

**Response `200`:** Deleted job object

---

## Offers (`/api/offers`)

### Offer status flow

```
pending → company accepts → company_accepted → freelancer accepts → accepted → booking created
       → company declines (company_rejected)
                          → freelancer declines (freelancer_rejected)
       → freelancer withdraws (withdrawn)
```

| Status | Meaning |
|---|---|
| `pending` | Submitted by freelancer, awaiting company review |
| `company_accepted` | Company approved, awaiting freelancer confirmation |
| `accepted` | Both parties agreed — booking created automatically |
| `company_rejected` | Company declined the application |
| `freelancer_rejected` | Freelancer declined after company approval |
| `withdrawn` | Freelancer withdrew the offer themselves |

---

### GET `/api/offers`

List all offers for the authenticated user (as buyer or seller).

**Auth:** Authenticated

**Response `200`:** Array of offer objects

---

### POST `/api/offers`

Submit an offer for a job.

**Auth:** Freelancer

**Request body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `jobId` | `number` | ✅ | Job to apply for |
| `motivationLetter` | `string` | ✅ | Min 50 characters |
| `proposedHourlyRate` | `number` | ✅ | Positive number |

**Response `200`:** Created offer object

**Errors:**
- `404` — Job not found
- `409` — Already applied to this job

---

### GET `/api/offers/[id]`

Get a specific offer by ID.

**Auth:** Authenticated (must be buyer, seller, or admin)

**Response `200`:** Single offer object, includes nested `job` and `seller` relations

---

### PATCH `/api/offers/[id]`

Update an existing offer's content (motivation letter / proposed rate). **Not** for status changes — see `POST /api/offers/[id]/status` for that.

**Auth:** Freelancer (must own the offer)

**Request body:**

| Field | Type |
|---|---|
| `motivationLetter` | `string` |
| `proposedHourlyRate` | `number` |

**Response `200`:** Updated offer object

**Errors:**
- `403` — Not the offer owner
- `400` — Offer already processed (only `pending` offers can be edited)
- `404` — Offer not found

---

### DELETE `/api/offers/[id]`

Withdraw a pending application.

**Auth:** Freelancer (must own the offer)

**Response `200`:** Deleted offer object

**Errors:**
- `404` — Offer not found, not owned by user, or not in `pending` status

**Notes:** Only `pending` offers can be deleted — once a company has acted on it, withdrawal is no longer possible via this endpoint.

---

### POST `/api/offers/[id]/status`

Execute an offer handshake action (accept or decline).

**Auth:** Authenticated (Company or Freelancer — not Admin)

**Request body:**

| Field | Type | Required |
|---|---|---|
| `action` | `'accept' \| 'decline'` | ✅ |

**Response `200`:** Updated offer object

**Business rules:**
- **Company** can act only when `status === 'pending'`
  - Accept → `company_accepted`
  - Decline → `company_rejected`
- **Freelancer** can act only when `status === 'company_accepted'`
  - Accept → `accepted`, booking auto-created, job marked `booked`
  - Decline → `freelancer_rejected`
- **Admin** cannot execute handshakes (`403`)
- Finalized offers cannot be re-actioned (`400`)

---

### GET `/api/offers/company/[id]`

Get all offers for a specific job. The `[id]` is the **job ID**.

**Auth:** Company (must own the job)

**Response `200`:** Array of offer objects

---

### Deprecated offer endpoints

| Old endpoint | Replacement |
|---|---|
| `PATCH /api/offers/accept/[id]` | `POST /api/offers/[id]/status` with `{ action: 'accept' }` |
| `PATCH /api/offers/decline/[id]` | `POST /api/offers/[id]/status` with `{ action: 'decline' }` |
| `PATCH /api/offers/freelancer/[id]` | `PATCH /api/offers/[id]` |
| `DELETE /api/offers/freelancer/[id]` | `DELETE /api/offers/[id]` |

---

## Bookings (`/api/bookings`)

Created automatically when a freelancer accepts a `company_accepted` offer.

### GET `/api/bookings`

**Auth:** Authenticated — returns bookings for the current user

### POST `/api/bookings/admin`

**Auth:** Admin — manually create a booking

### GET `/api/bookings/admin/[id]`

**Auth:** Admin

### PATCH `/api/bookings/admin/[id]`

**Auth:** Admin

### DELETE `/api/bookings/admin/[id]`

**Auth:** Admin

---

## Admin — Users (`/api/admin/users`)

### GET `/api/admin/users`

**Auth:** Admin · Query: `search` (email partial match)

### GET `/api/admin/users/[id]`

**Auth:** Admin — returns user with nested `profile`

### PATCH `/api/admin/users/[id]`

**Auth:** Admin — update account and/or profile fields

### DELETE `/api/admin/users/[id]`

**Auth:** Admin

**Request body:** `{ "adminPassword": "string" }`

**Errors:**
- `401` — Invalid admin password
- `403` — Cannot delete own account

---

## Presence (`/api/presence`)

### GET `/api/presence/auth`

**Auth:** Authenticated

**Response `200`:** `{ "ticket": "uuid" }` — valid 10 seconds, single use, for WebSocket auth

---

## v1 API — API Key Authentication (`/api/v1`)

Header required: `x-api-key: <key>`

### Rate limiting

5 requests/minute per key. Headers: `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`. Exceeded → `429` + `Retry-After`.

### Endpoints

`GET/POST /api/v1/jobs/company`, `GET/PATCH/DELETE /api/v1/jobs/company/[id]` — same as session-based job endpoints, **Auth:** API Key (Company).

**⚠️ Known limitation:** No endpoint currently exists to create a new API key. `PATCH /api/auth/update-api-key` (admin only) can only update a key that was inserted directly into the database.

---

## Enums

### `AccountTypeEnum`
`freelancer` | `company`

### `RoleEnum`
`user` | `admin`

### `WorkplaceEnum`
`on_site` | `remote` | `hybrid`

### `OfferStatusEnum`
`pending` | `company_accepted` | `accepted` | `company_rejected` | `freelancer_rejected` | `withdrawn`

### `BookingStatusEnum`
`upcoming` | `ongoing` | `completed` | `cancelled` | `disputed`

### `JobStatusEnum`
`active` | `paused` | `booked` | `deleted`

### `CategoryEnum`
`cybersecurity` | `devops` | `network_engineering` | `software_development` | `web_development` | `other`

### `SkillEnum`
`c` | `cobol` | `cpp` | `csharp` | `css` | `dart` | `golang` | `html` | `java` | `javascript` | `kotlin` | `lua` | `php` | `python` | `r` | `ruby` | `rust` | `scala` | `sql` | `swift` | `typescript`

### `LanguageEnum`
`en` | `de` | `fr` | `lu`

### `CountryEnum`
`be` | `de` | `fr` | `lu`

---

## Deprecated

- `PATCH /api/offers/accept/[id]`, `PATCH /api/offers/decline/[id]` — use `POST /api/offers/[id]/status`
- `PATCH/DELETE /api/offers/freelancer/[id]` — use `PATCH/DELETE /api/offers/[id]`
- `server/dto/user.dto.ts`, `server/dto/profile.dto.ts` — use `shared/dto/` equivalents
