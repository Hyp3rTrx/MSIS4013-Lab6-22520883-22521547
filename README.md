Lab6 Solution

Setup

1. Copy `.env.example` to `.env` and edit if needed.
2. Install dependencies:

```bash
npm install
```

3. Initialize DB and seed users:

```bash
npm run setup
```

Run

- Start API server:

```bash
npm start
```

- Start RabbitMQ consumer:

```bash
npm run consumer
```

- Start producers (each in separate terminals):

```bash
npm run producer1
npm run producer2
```

Endpoints

- `POST /login` body `{ "username":"admin"|"user", "password":"admin123"|"user123" }` returns `token` (JWT includes `loginTime` and `loginAddress` and `role`).
- `GET /profile` (Bearer token) returns decoded JWT payload.
- `GET /admin` (requires admin role) returns a welcome message.

Notes

- Uses SQLite for auth data and MongoDB for message storage.
- RabbitMQ is used for messaging between producers and consumer.
