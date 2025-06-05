# Authentication & Authorization Presentation

## Slide 1: 🌟 Authentication Workflow Overview

- Introduction to authentication & authorization
- Importance of secure login flows
- Focus: OAuth, JWT, Session-based auth explained

## Slide 2: 🌐 Authentication vs Authorization

- **Authentication:** Who are you?
- **Authorization:** What can you do?
- **Examples:**
  - Login (auth)
  - Admin Panel (authorization)

## Slide 3: 🔑 JWT (JSON Web Tokens) Authentication

### What?

- Stateless tokens signed with secret key

### How it works?

Server creates token with user data → sends to client → client sends token on each request

### Pros:

- Scalable, no server session state
- Easy API integration

### Cons:

- Token revocation hard
- Larger token size in headers

### Code Example:

```javascript
const token = jwt.sign({ userId, role }, process.env.JWT_SECRET, {
  expiresIn: "1h",
});

res.cookie("token", token, {
  httpOnly: true,
  secure: true,
  sameSite: "Strict",
  maxAge: 3600000, // 1 hour
});
```

## Slide 4: 🔐 OAuth 2.0 Authentication

### What?

- Third-party login with providers like Google, GitHub

### How it works?

User grants permission → OAuth provider returns auth code → backend exchanges for tokens → fetch user info → create session

### Pros:

- No need to store passwords
- Trusted provider login

### Cons:

- Complex flows
- Dependency on external service

### Code Example:

```javascript
// Exchange auth code for tokens
const { tokens } = await oauth2Client.getToken(code);
const ticket = await oauth2Client.verifyIdToken({
  idToken: tokens.id_token,
});
const payload = ticket.getPayload();

// Create JWT for app session
const token = jwt.sign({ email: payload.email }, process.env.JWT_SECRET, {
  expiresIn: "1h",
});

res.cookie("token", token, {
  httpOnly: true,
  secure: true,
  sameSite: "Strict",
});
```

## Slide 5: 🛡️ Session-Based Authentication

### What?

- Server stores session data; client stores session ID in a cookie

### How it works?

Login → server creates session → sends session ID cookie → browser sends cookie automatically → server validates session

### Pros:

- Simple to implement
- Easy session invalidation

### Cons:

- Requires server memory/storage
- Less scalable in distributed systems

### Code Example:

```javascript
const session = require("express-session");

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
      maxAge: 3600000,
    },
  })
);

app.post("/login", (req, res) => {
  req.session.userId = user.id;
  res.json({ success: true });
});
```

## Slide 6: 💻 Implementing Authentication (OAuth + JWT example)

- OAuth provider (Google) login flow
- Backend exchanges auth code for tokens & user info
- Create JWT for app sessions
- Send JWT as secure cookie:

```javascript
res.cookie("token", token, {
  httpOnly: true,
  secure: true,
  sameSite: "Strict",
  maxAge: 3600000,
});
```

Frontend uses cookie automatically with { withCredentials: true }

## Slide 7: ⚡ Security Best Practices

- **Cookie Flags:**
  - HttpOnly: not accessible by JS (prevents XSS)
  - Secure: sent only over HTTPS
  - SameSite=Strict: sent only to same-site requests (prevents CSRF)
- **JWT:**
  - Short lifespan tokens
  - Use refresh tokens if needed
- **OAuth:**
  - Validate tokens & signatures
  - Never expose client secrets on frontend
- **General:**
  - Enforce HTTPS
  - Rate limit auth endpoints
  - Input validation

## Slide 8: 🔢 React Login Flow with OAuth + JWT

- User clicks “Login with Google”
- Redirect to Google consent screen
- Google redirects back with auth code
- Backend exchanges code, verifies user
- Backend sends JWT in secure cookie (HttpOnly, Secure, SameSite=Strict)
- Frontend requests use cookie automatically

## Slide 9: 📄 Authorization (Role-Based Access Control - RBAC)

- Assign roles: Admin, Student, Faculty, Media Manager, etc.
- Middleware checks user role on backend:

```javascript
const isAdmin = (req, res, next) => {
  if (req.user.role !== "admin") return res.status(403).send("Forbidden");
  next();
};
```

Allows fine-grained access control to routes and features

## Slide 10: ❌ Common Pitfalls to Avoid

- Storing tokens in localStorage (vulnerable to XSS)
- Not setting HttpOnly or Secure cookie flags
- Long-lived tokens without refresh/revoke strategy
- Exposing secrets in frontend code
- Not validating OAuth tokens on backend

## Slide 11: 🏆 Summary & Q/A

- Use OAuth + JWT for scalable and secure auth
- Store JWT in secure cookies with proper flags
- Use sessions if simple, but scale with JWT for APIs
- Always protect against XSS and CSRF

Happy to answer questions!
