# Developer Portfolio - Backend

A secure, production-ready Express.js API with PostgreSQL database integration, email notifications, and comprehensive security features.

## Overview

This is the backend API for a full-stack portfolio application. Built with Node.js and Express, it provides a robust contact form submission system with email delivery via Resend API, PostgreSQL database persistence, rate limiting, spam prevention, and input validation. The architecture demonstrates professional API design, security best practices, and scalable database integration suitable for production environments.

## Live Demo

**API Base URL:** `https://portfolio-backend-resend.onrender.com`  
**GitHub Repository:** [Your repository URL]

## Features

### Core Functionality
- **Contact Form API** - RESTful endpoint for contact submissions
- **Email Integration** - Automated email notifications via Resend API
- **Database Persistence** - PostgreSQL storage for all submissions
- **Admin API** - Paginated endpoint to retrieve stored messages
- **CORS Support** - Configurable cross-origin resource sharing

### Security Features
- **Rate Limiting** - 5 requests per 15 minutes per IP address
- **Honeypot Spam Filter** - Detects and blocks bot submissions
- **Input Validation** - Email format, length constraints, required fields
- **XSS Prevention** - Input sanitization using validator.js
- **API Key Authentication** - Secures admin endpoints
- **SSL/TLS Support** - Encrypted database connections in production
- **Environment Variables** - Secure credential management

### Monitoring & Logging
- **Structured JSON Logging** - Timestamped events for monitoring
- **Error Tracking** - Comprehensive error logging
- **Spam Detection Logs** - Tracks blocked spam attempts
- **Rate Limit Logs** - Monitors excessive request attempts
- **Success Metrics** - Logs successful submissions

### Data Management
- **SQL Injection Prevention** - Parameterized queries
- **Connection Pooling** - Efficient database resource management
- **Graceful Shutdown** - Proper cleanup on server termination
- **Error Recovery** - Handles database and API failures gracefully

## Architecture

```
┌──────────────────┐
│                  │
│  Frontend        │
│  HTTP Client     │
│                  │
└────────┬─────────┘
         │
         │ POST /api/contact
         │ (JSON)
         ▼
┌──────────────────┐
│                  │
│  Express.js      │
│  Middleware      │
│  - CORS          │
│  - Rate Limit    │
│  - JSON Parser   │
│                  │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│                  │
│  Validation      │
│  - Honeypot      │
│  - Email Format  │
│  - Length Check  │
│  - Sanitization  │
│                  │
└────────┬─────────┘
         │
         ├─────────────────┐
         │                 │
         ▼                 ▼
┌──────────────┐   ┌──────────────┐
│              │   │              │
│  Resend API  │   │  PostgreSQL  │
│  (Email)     │   │  Database    │
│              │   │              │
└──────────────┘   └──────────────┘
```

### Request Flow

1. **Request Received** - Express server accepts POST request
2. **Rate Limit Check** - Validates IP hasn't exceeded limit
3. **Honeypot Check** - Detects bot submissions
4. **Input Validation** - Checks required fields and formats
5. **Data Sanitization** - Escapes HTML to prevent XSS
6. **Email Sent** - Sends notification via Resend API
7. **Database Storage** - Persists submission to PostgreSQL
8. **Response Returned** - Sends success/error to client
9. **Event Logged** - Records action for monitoring

### Database Schema

```sql
CREATE TABLE messages (
  id SERIAL PRIMARY KEY,
  first_name VARCHAR(50) NOT NULL,
  last_name VARCHAR(50) NOT NULL,
  email VARCHAR(254) NOT NULL,
  subject VARCHAR(100),
  message TEXT NOT NULL,
  ip_address VARCHAR(45),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_messages_created_at ON messages(created_at DESC);
CREATE INDEX idx_messages_email ON messages(email);
```

## Tech Stack

### Core Technologies
- **Node.js** - JavaScript runtime (v16+)
- **Express.js** - Web application framework
- **PostgreSQL** - Relational database
- **pg** - PostgreSQL client for Node.js

### Security & Validation
- **validator.js** - String validation and sanitization
- **express-rate-limit** - Rate limiting middleware
- **cors** - Cross-Origin Resource Sharing configuration
- **dotenv** - Environment variable management

### External APIs
- **Resend** - Transactional email API

### Development Tools
- **nodemon** - Development server with auto-reload

## Setup

### Prerequisites
- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)
- Resend account and API key
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd developer-portfolio/developer-portfolio-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create environment variables**
   
   Create a `.env` file in the backend root:
   ```env
   # Server Configuration
   PORT=5000
   NODE_ENV=development
   FRONTEND_URL=http://localhost:3000

   # Database Configuration
   DATABASE_URL=postgresql://username:password@localhost:5432/portfolio

   # Email Configuration
   RESEND_API_KEY=re_your_api_key_here
   EMAIL_USER=your-email@example.com

   # Security
   ADMIN_API_KEY=your_secure_random_string_here
   ```

4. **Set up PostgreSQL database**

   **Create database:**
   ```bash
   createdb portfolio
   ```

   **Run schema:**
   ```sql
   -- Connect to database
   psql portfolio

   -- Create messages table
   CREATE TABLE messages (
     id SERIAL PRIMARY KEY,
     first_name VARCHAR(50) NOT NULL,
     last_name VARCHAR(50) NOT NULL,
     email VARCHAR(254) NOT NULL,
     subject VARCHAR(100),
     message TEXT NOT NULL,
     ip_address VARCHAR(45),
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );

   -- Create indexes for performance
   CREATE INDEX idx_messages_created_at ON messages(created_at DESC);
   CREATE INDEX idx_messages_email ON messages(email);
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

   Server will start on `http://localhost:5000`

### Resend API Setup

1. **Create account** at [resend.com](https://resend.com)
2. **Get API key** from dashboard
3. **Add to .env** as `RESEND_API_KEY`
4. **Verify domain** (optional, for production)

### Testing the API

**Test contact endpoint:**
```bash
curl -X POST http://localhost:5000/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "subject": "Test Message",
    "message": "This is a test message",
    "company": ""
  }'
```

**Expected response:**
```json
{
  "success": true
}
```

## Deployment

### Render (Recommended)

#### 1. Create PostgreSQL Database

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click **New +** → **PostgreSQL**
3. Configure:
   - Name: `portfolio-db`
   - Database: `portfolio`
   - User: (auto-generated)
   - Region: Choose closest to your users
   - Plan: Free or Starter
4. Click **Create Database**
5. Copy the **Internal Database URL**
6. Run the SQL schema using the Render dashboard SQL shell or a PostgreSQL client

#### 2. Create Web Service

1. Click **New +** → **Web Service**
2. Connect your repository
3. Configure:
   - Name: `portfolio-backend`
   - Root Directory: `developer-portfolio-backend`
   - Environment: `Node`
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Plan: Free or Starter

#### 3. Add Environment Variables

In the web service settings, add:

| Key | Value | Notes |
|-----|-------|-------|
| `DATABASE_URL` | [Internal DB URL] | From database settings |
| `RESEND_API_KEY` | `re_xxxxx` | From Resend dashboard |
| `EMAIL_USER` | `you@example.com` | Your email address |
| `FRONTEND_URL` | `https://yoursite.com` | Your frontend URL |
| `ADMIN_API_KEY` | `random_secure_string` | Generate secure key |
| `NODE_ENV` | `production` | Production mode |

#### 4. Deploy

Click **Create Web Service** - Render will automatically deploy

**Note:** Free tier services spin down after 15 minutes of inactivity and may have cold start delays.

### Alternative Platforms

#### Heroku

```bash
# Install Heroku CLI
heroku login
heroku create portfolio-backend

# Add PostgreSQL
heroku addons:create heroku-postgresql:mini

# Set environment variables
heroku config:set RESEND_API_KEY=re_xxxxx
heroku config:set EMAIL_USER=you@example.com
heroku config:set FRONTEND_URL=https://yoursite.com
heroku config:set ADMIN_API_KEY=secure_random_string
heroku config:set NODE_ENV=production

# Deploy
git push heroku main

# Run database migrations
heroku pg:psql < schema.sql
```

#### Railway

1. Create new project
2. Add PostgreSQL database
3. Deploy from GitHub
4. Set environment variables
5. Run schema in database console

#### DigitalOcean App Platform

1. Create new app
2. Connect repository
3. Add managed PostgreSQL database
4. Configure environment variables
5. Deploy

## API Reference

### POST /api/contact

Submit a contact form message.

**Endpoint:** `/api/contact`

**Method:** `POST`

**Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "subject": "Project Inquiry",
  "message": "I'd like to discuss a project opportunity with you.",
  "company": ""
}
```

**Field Validation:**
- `firstName` (required): 1-20 characters
- `lastName` (required): 1-20 characters
- `email` (required): Valid email format, max 254 characters
- `subject` (optional): Max 100 characters
- `message` (required): 1-1000 characters
- `company` (honeypot): Must be empty or submission is spam

**Success Response:**
```json
{
  "success": true
}
```
**Status Code:** `200 OK`

**Error Responses:**

*Missing fields:*
```json
{
  "error": "Missing required fields."
}
```
**Status Code:** `400 Bad Request`

*Invalid email:*
```json
{
  "error": "Please provide a valid email address"
}
```
**Status Code:** `400 Bad Request`

*Message too long:*
```json
{
  "error": "Message must be less than 1000 characters"
}
```
**Status Code:** `400 Bad Request`

*Rate limit exceeded:*
```json
{
  "error": "Too many requests. Please try again later."
}
```
**Status Code:** `429 Too Many Requests`

*Server error:*
```json
{
  "error": "Failed to send message. Please try again later."
}
```
**Status Code:** `500 Internal Server Error`

**Rate Limiting:**
- 5 requests per IP address per 15-minute window
- Applies globally to the endpoint
- Automatically resets after window expires

---

### GET /api/admin/messages

Retrieve paginated contact messages (requires authentication).

**Endpoint:** `/api/admin/messages`

**Method:** `GET`

**Headers:**
```
Authorization: Bearer YOUR_ADMIN_API_KEY
```

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Results per page (default: 20, max: 100)

**Example Request:**
```bash
curl -X GET "http://localhost:5000/api/admin/messages?page=1&limit=20" \
  -H "Authorization: Bearer your_admin_api_key"
```

**Success Response:**
```json
{
  "page": 1,
  "limit": 20,
  "total": 45,
  "totalPages": 3,
  "messages": [
    {
      "id": 1,
      "first_name": "John",
      "last_name": "Doe",
      "email": "john@example.com",
      "subject": "Project Inquiry",
      "message": "I'd like to discuss a project...",
      "ip_address": "192.168.1.1",
      "created_at": "2025-02-14T10:30:00.000Z"
    },
    {
      "id": 2,
      "first_name": "Jane",
      "last_name": "Smith",
      "email": "jane@example.com",
      "subject": "Job Opportunity",
      "message": "We have an opening...",
      "ip_address": "192.168.1.2",
      "created_at": "2025-02-14T09:15:00.000Z"
    }
  ]
}
```
**Status Code:** `200 OK`

**Error Responses:**

*Missing authorization:*
```json
{
  "error": "Unauthorized"
}
```
**Status Code:** `401 Unauthorized`

*Invalid API key:*
```json
{
  "error": "Forbidden"
}
```
**Status Code:** `403 Forbidden`

*Server error:*
```json
{
  "error": "Failed to fetch messages"
}
```
**Status Code:** `500 Internal Server Error`

## Project Structure

```
developer-portfolio-backend/
├── db/
│   └── postgres.js              # Database connection pool
│
├── utils/
│   └── logger.js                # Structured logging utility
│
├── server.js                    # Express application entry point
├── package.json                 # Dependencies and scripts
├── package-lock.json            # Dependency lock file
├── .env                         # Environment variables (not committed)
├── .gitignore                   # Git ignore rules
└── README.md                    # This file
```

### File Descriptions

**server.js:**
- Express app configuration
- Route definitions
- Middleware setup (CORS, rate limiting, JSON parsing)
- Contact form endpoint logic
- Admin API endpoint
- Resend email integration
- Database queries
- Error handling

**db/postgres.js:**
- PostgreSQL connection pool configuration
- SSL settings for production
- Exports pool instance for queries

**utils/logger.js:**
- Structured JSON logging function
- Timestamped event tracking
- Exports `logEvent` utility

**package.json:**
- Project metadata
- Dependencies list
- NPM scripts (start, dev)

## Environment Variables

### Required Variables

| Variable | Description | Example | Required |
|----------|-------------|---------|----------|
| `PORT` | Server port number | `5000` | No (default: 5000) |
| `NODE_ENV` | Environment mode | `production` | Yes |
| `FRONTEND_URL` | Frontend origin for CORS | `https://yoursite.com` | Yes |
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@host/db` | Yes |
| `RESEND_API_KEY` | Resend API key | `re_xxxxx` | Yes |
| `EMAIL_USER` | Email recipient | `you@example.com` | Yes |
| `ADMIN_API_KEY` | Admin auth token | `secure_random_string` | Yes |

### Variable Details

**PORT:**
- Default: `5000`
- Used by Express server
- Must match frontend API calls (or use env-based URL)

**NODE_ENV:**
- Values: `development` or `production`
- Affects database SSL settings
- Changes logging behavior

**FRONTEND_URL:**
- Must match exact frontend origin
- Used in CORS configuration
- Include protocol (http/https)
- No trailing slash

**DATABASE_URL:**
- Format: `postgresql://username:password@host:port/database`
- SSL enabled automatically in production
- Use internal URL on Render for security

**RESEND_API_KEY:**
- Get from Resend dashboard
- Starts with `re_`
- Keep secret and secure

**EMAIL_USER:**
- Your email address
- Receives contact form submissions
- Can be any email you have access to

**ADMIN_API_KEY:**
- Generate a secure random string
- Used for admin endpoint authentication
- Keep secret and secure
- Recommend: Use `openssl rand -base64 32`

## Security Best Practices

### Implemented Security Measures

1. **Input Validation**
   - Email format validation
   - Length constraints
   - Required field checks
   - Type validation

2. **Input Sanitization**
   - HTML escaping to prevent XSS
   - Removes dangerous characters
   - Preserves data integrity

3. **SQL Injection Prevention**
   - Parameterized queries
   - No string concatenation
   - pg library handles escaping

4. **Rate Limiting**
   - 5 requests per 15 minutes
   - Per IP address
   - Prevents abuse and spam

5. **Honeypot Spam Filter**
   - Hidden form field
   - Catches bot submissions
   - Logs spam attempts

6. **CORS Configuration**
   - Restricts origins
   - Prevents unauthorized access
   - Configurable per environment

7. **API Key Authentication**
   - Protects admin endpoints
   - Bearer token pattern
   - Environment-based secret

8. **SSL/TLS Encryption**
   - HTTPS for all requests
   - Database connections encrypted
   - Credentials never in plaintext

9. **Environment Variables**
   - No hardcoded secrets
   - .env not committed to git
   - Platform-managed in production

10. **Graceful Error Handling**
    - No sensitive info in errors
    - User-friendly messages
    - Detailed server logs

### Additional Recommendations

1. **Enable HTTPS** - Use SSL certificates (Let's Encrypt)
2. **Add Helmet.js** - Security headers middleware
3. **Implement CSRF** - For cookie-based auth
4. **Use HTTPS Redirect** - Force secure connections
5. **Add Request Signing** - Verify request authenticity
6. **Implement Logging** - Monitor suspicious activity
7. **Regular Updates** - Keep dependencies current
8. **Backup Database** - Regular automated backups
9. **Penetration Testing** - Regular security audits
10. **WAF Integration** - Web Application Firewall

## Database Management

### Connecting to Database

**Local PostgreSQL:**
```bash
psql postgresql://username:password@localhost:5432/portfolio
```

**Render PostgreSQL:**
```bash
# Using external URL (from anywhere)
psql [EXTERNAL_DATABASE_URL]

# Or use Render dashboard shell
```

### Common Queries

**View all messages:**
```sql
SELECT * FROM messages ORDER BY created_at DESC;
```

**Count total messages:**
```sql
SELECT COUNT(*) FROM messages;
```

**View recent messages:**
```sql
SELECT * FROM messages 
WHERE created_at > NOW() - INTERVAL '7 days' 
ORDER BY created_at DESC;
```

**Search by email:**
```sql
SELECT * FROM messages 
WHERE email = 'john@example.com';
```

**Delete spam messages:**
```sql
DELETE FROM messages 
WHERE message LIKE '%spam keyword%';
```

**Get message statistics:**
```sql
SELECT 
  DATE(created_at) as date,
  COUNT(*) as count
FROM messages
GROUP BY DATE(created_at)
ORDER BY date DESC;
```

### Database Maintenance

**Backup database:**
```bash
pg_dump -U username -d portfolio > backup.sql
```

**Restore database:**
```bash
psql -U username -d portfolio < backup.sql
```

**Vacuum database:**
```sql
VACUUM ANALYZE messages;
```

## Monitoring & Logging

### Log Events

The logger captures the following events:

**SUCCESS:**
```json
{
  "timestamp": "2025-02-14T10:30:00.000Z",
  "type": "SUCCESS",
  "ip": "192.168.1.1",
  "email": "john@example.com",
  "subject": "Project Inquiry"
}
```

**ERROR:**
```json
{
  "timestamp": "2025-02-14T10:31:00.000Z",
  "type": "ERROR",
  "ip": "192.168.1.2",
  "error": "Database connection failed"
}
```

**SPAM_BLOCKED:**
```json
{
  "timestamp": "2025-02-14T10:32:00.000Z",
  "type": "SPAM_BLOCKED",
  "ip": "192.168.1.3"
}
```

**RATE_LIMITED:**
```json
{
  "timestamp": "2025-02-14T10:33:00.000Z",
  "type": "RATE_LIMITED",
  "ip": "192.168.1.4"
}
```

**RESEND_ERROR:**
```json
{
  "timestamp": "2025-02-14T10:34:00.000Z",
  "type": "RESEND_ERROR",
  "ip": "192.168.1.5",
  "email": "invalid@example.com",
  "error": "Invalid email address"
}
```

### Viewing Logs

**Render:**
- Go to your web service dashboard
- Click "Logs" tab
- View real-time logs

**Local Development:**
```bash
npm run dev
# Logs appear in terminal
```

**Production Logs (via CLI):**
```bash
render logs -s your-service-name
```

### Log Analysis

Use tools like:
- **Papertrail** - Log aggregation
- **Loggly** - Log management
- **Datadog** - Full monitoring
- **Sentry** - Error tracking

## Performance Optimization

### Current Optimizations

1. **Connection Pooling** - Reuses database connections
2. **Indexed Queries** - Fast lookups on created_at and email
3. **Async Operations** - Non-blocking I/O
4. **Rate Limiting** - Prevents server overload
5. **Graceful Shutdown** - Cleans up resources

### Recommended Improvements

- [ ] Add Redis caching for frequently accessed data
- [ ] Implement database query optimization
- [ ] Add database read replicas for scaling
- [ ] Implement background job queue for emails
- [ ] Add response compression (gzip)
- [ ] Implement API response caching
- [ ] Add database connection timeout settings
- [ ] Monitor and optimize slow queries
- [ ] Implement database connection health checks
- [ ] Add application performance monitoring (APM)

## Troubleshooting

### Common Issues

**Issue:** "Database connection failed"

**Solutions:**
- Verify `DATABASE_URL` is correct
- Check database is running
- Ensure network allows connection
- Verify credentials are valid
- Check SSL settings match environment

---

**Issue:** "CORS error" in browser

**Solutions:**
- Verify `FRONTEND_URL` matches exactly
- Include protocol (http/https)
- No trailing slash in URL
- Restart server after changing .env
- Check browser console for exact error

---

**Issue:** "Rate limit exceeded" immediately

**Solutions:**
- Clear rate limit cache (restart server)
- Check if IP is correct (behind proxy?)
- Adjust rate limit settings if needed
- Verify not testing from same IP excessively

---

**Issue:** "Email not sending"

**Solutions:**
- Verify `RESEND_API_KEY` is correct
- Check Resend dashboard for errors
- Ensure email format is valid
- Verify domain is verified (for production)
- Check Resend API status

---

**Issue:** "Admin endpoint returns 401"

**Solutions:**
- Verify `ADMIN_API_KEY` in .env
- Use correct Authorization header format
- Ensure "Bearer " prefix is included
- Check key doesn't have extra spaces
- Restart server after changing key

### Debug Mode

Enable detailed logging:
```javascript
// In server.js, add:
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`, req.body);
  next();
});
```

## Testing

### Manual API Testing

**Using curl:**
```bash
# Test contact endpoint
curl -X POST http://localhost:5000/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Test",
    "lastName": "User",
    "email": "test@example.com",
    "subject": "Test",
    "message": "Testing the API",
    "company": ""
  }'

# Test admin endpoint
curl -X GET http://localhost:5000/api/admin/messages \
  -H "Authorization: Bearer your_admin_api_key"
```

**Using Postman:**
1. Import collection
2. Set environment variables
3. Test each endpoint
4. Verify responses

### Automated Testing

**Framework recommendation:** Jest + Supertest

```javascript
// Example test
const request = require('supertest');
const app = require('./server');

describe('POST /api/contact', () => {
  it('should accept valid contact form', async () => {
    const response = await request(app)
      .post('/api/contact')
      .send({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        message: 'Test message',
        company: ''
      });
    
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
  });
});
```

## Future Enhancements

- [ ] Add unit and integration tests
- [ ] Implement WebSocket for real-time notifications
- [ ] Add email queue with retry logic
- [ ] Create message reply functionality
- [ ] Add message read/unread status
- [ ] Implement soft delete for messages
- [ ] Add bulk operations for admin
- [ ] Create message export functionality (CSV/JSON)
- [ ] Add email templates with HTML/CSS
- [ ] Implement email attachments
- [ ] Add message tagging system
- [ ] Create dashboard analytics
- [ ] Add webhook support
- [ ] Implement message search functionality
- [ ] Add message filtering and sorting
- [ ] Create automated responses
- [ ] Add multi-language support
- [ ] Implement message archiving

## Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/improvement`)
3. Make your changes
4. Write/update tests
5. Commit with clear messages (`git commit -m 'Add feature'`)
6. Push to your fork (`git push origin feature/improvement`)
7. Open a Pull Request

## License

This project is open source and available under the [MIT License](LICENSE).

## Support

For issues or questions:
- Open an issue on GitHub
- Contact: [Your Email]

## Contact

**Harold Durant**  
Email: MrDurant2023@gmail.com  
GitHub: [@ROIEngineer](https://github.com/ROIEngineer)  
Portfolio: [Link](https://portfolio-web-six-ashen.vercel.app/)

---

Built with ❤️ using Node.js, Express, and PostgreSQL
