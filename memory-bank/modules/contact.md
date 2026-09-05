# Module: Contact

## Purpose

Allow visitors/recruiters to contact Pooja. (Currently removed from page
per user request, but API route still exists.)

## Implementation Status

**Section removed from page** — Contact section is no longer displayed on
the portfolio. The API route (`/api/contact`) still exists in the codebase
and can be re-enabled if needed.

## UI (When Active)

Contact form fields:

```text
Name
Email
Subject
Message
Submit
```

## Technical Requirement

The form communicates with a REST API endpoint at `/api/contact`. No
separately deployed backend application — the API is implemented within
the Next.js application.

### API Route (`src/app/api/contact/route.ts`)

- POST endpoint
- Validates Name, Email, Subject, and Message
- Returns appropriate error responses for invalid submissions
- Returns success response for valid submissions
- Uses Resend for email delivery

## Validation

The API validates Name, Email, Subject, and Message. Invalid submissions
return appropriate error responses. Successful submissions return a clear
success response.

## Environment Variables Required

```text
EMAIL_SERVICE_API_KEY    # Resend API key
EMAIL_FROM              # Sender email
EMAIL_TO                # Recipient email (Pooja)
```

Status: API exists, removed from page (2026-09-05)
