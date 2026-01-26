# Contact API (Production-Ready Backend)

A production-grade backend service that powers the contact form on my portfolio website. The API securely accepts messages from a public frontend, prevents spam and abuse, delivers emails in real time, and persists data in a managed PostgreSQL database. An admin-only endpoint allows authenticated access to submitted messages with pagination.

This project was intentionally built to mirror real-world backend patterns rather than relying on third-party form services.

---

## ✨ Features

* **JavaScript-driven contact form API**
* **Spam protection**

  * Rate limiting (per IP)
  * Honeypot bot detection
* **Transactional email delivery** via Resend
* **PostgreSQL persistence** (managed database)
* **Admin-only messages endpoint** (Bearer token auth)
* **Pagination support** for scalable reads
* **Structured server-side logging**
* **Environment-based configuration**

---

## 🧱 Architecture Overview

```
Frontend (Vercel)
   |
   | POST /api/contact
   v
Backend (Node.js + Express — Render)
   ├─ Input validation & sanitization
   ├─ Rate limiting
   ├─ Honeypot spam filtering
   ├─ Email delivery (Resend)
   ├─ Structured logging
   ├─ PostgreSQL (managed, pooled)
   └─ Admin-only API (Bearer token)
```

---

## 🔐 Security & Abuse Prevention

* **Rate Limiting**: Prevents brute-force or automated spam attempts
* **Honeypot Field**: Silently blocks bots without impacting UX
* **Parameterized SQL Queries**: Protects against SQL injection
* **Environment Variables**: Secrets never committed to source control
* **Admin API Key**: Required for privileged endpoints

---

## 📬 Email Delivery

Emails are sent using **Resend**, chosen over traditional SMTP due to production port restrictions in managed hosting environments.

Each successful submission triggers a transactional email containing:

* Sender name
* Sender email
* Subject
* Message body

---

## 🗄️ Database Design

**Database:** PostgreSQL (managed)

### `messages` table

| Column     | Type      | Notes                        |
| ---------- | --------- | ---------------------------- |
| id         | SERIAL    | Primary key                  |
| first_name | TEXT      | Required                     |
| last_name  | TEXT      | Required                     |
| email      | TEXT      | Required + format constraint |
| subject    | TEXT      | Optional                     |
| message    | TEXT      | Required + length constraint |
| ip_address | TEXT      | Audit logging                |
| created_at | TIMESTAMP | Indexed for pagination       |

### Optimizations

* Index on `created_at DESC` for fast pagination
* CHECK constraints for email format and message length
* NOT NULL enforcement for core fields

---

## 🔑 API Endpoints

### Public — Submit Contact Message

```
POST /api/contact
```

Accepts JSON payload and returns success or error response.

---

### Admin — View Messages (Protected)

```
GET /api/admin/messages
Authorization: Bearer <ADMIN_API_KEY>
```

**Query Params**:

* `page` (default: 1)
* `limit` (default: 20)

Returns paginated messages ordered by newest first.

---

## 📊 Logging & Observability

The service emits structured JSON logs for:

* Successful submissions
* Blocked spam attempts
* Rate-limited requests
* Server or email errors

This enables clear visibility into system behavior in production.

---

## 🛠️ Tech Stack

* **Node.js**
* **Express**
* **PostgreSQL**
* **Resend (Email API)**
* **Render (Backend + DB)**
* **Vercel (Frontend)**

---

## 🎯 Why This Project

Instead of outsourcing contact handling to third-party services, this backend was built to demonstrate:

* Real API design
* Secure input handling
* Database-backed persistence
* Production deployment considerations
* Observability and abuse prevention

It reflects how small-to-medium production services are actually built and deployed.

---

## 📌 Future Improvements

* Admin dashboard UI
* IP allowlisting for admin endpoints
* Full-text search on messages
* Automated data retention policies

---

## 👤 Author

**Harold Durant**
Portfolio Backend Project
