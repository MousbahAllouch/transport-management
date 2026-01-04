# Transport Management Backend API

Express.js backend API for Construction Transport Management System

## Prerequisites

- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)

## Setup Instructions

### 1. Install PostgreSQL

**macOS (using Homebrew):**
```bash
brew install postgresql@15
brew services start postgresql@15
```

**Alternative: Use Postgres.app** (Easier for macOS)
- Download from https://postgresapp.com/
- Install and start the app
- PostgreSQL will run automatically

### 2. Create Database

```bash
# Connect to PostgreSQL
psql postgres

# In PostgreSQL prompt, create database and user:
CREATE DATABASE transport_db;
CREATE USER transport_user WITH ENCRYPTED PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE transport_db TO transport_user;
\q
```

### 3. Run Database Schema

```bash
# Navigate to backend folder
cd backend

# Run the schema file
psql -U transport_user -d transport_db -f src/config/schema.sql
```

### 4. Install Dependencies

```bash
npm install
```

### 5. Configure Environment

```bash
# Copy example env file
cp .env.example .env

# Edit .env file and update with your database credentials
```

Example `.env` file:
```
PORT=5000
NODE_ENV=development

DB_HOST=localhost
DB_PORT=5432
DB_NAME=transport_db
DB_USER=transport_user
DB_PASSWORD=your_secure_password

FRONTEND_URL=http://localhost:3000
```

### 6. Start the Server

**Development mode (with auto-restart):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

The API will be available at `http://localhost:5000`

## API Endpoints

### Drivers
- `GET /api/drivers` - Get all drivers
- `GET /api/drivers/:id` - Get single driver
- `POST /api/drivers` - Create driver
- `PUT /api/drivers/:id` - Update driver
- `DELETE /api/drivers/:id` - Delete driver

### Trucks
- `GET /api/trucks` - Get all trucks
- `GET /api/trucks/:id` - Get single truck
- `POST /api/trucks` - Create truck
- `PUT /api/trucks/:id` - Update truck
- `DELETE /api/trucks/:id` - Delete truck

### Clients
- `GET /api/clients` - Get all clients
- `GET /api/clients/:id` - Get single client
- `POST /api/clients` - Create client
- `PUT /api/clients/:id` - Update client
- `DELETE /api/clients/:id` - Delete client

### Trips
- `GET /api/trips?date=YYYY-MM-DD&driver_id=X` - Get trips (with optional filters)
- `GET /api/trips/:id` - Get single trip
- `POST /api/trips` - Create trip
- `PUT /api/trips/:id` - Update trip
- `DELETE /api/trips/:id` - Delete trip

### Costs
- `GET /api/costs?date=YYYY-MM-DD&driver_id=X&category=diesel` - Get costs (with optional filters)
- `GET /api/costs/:id` - Get single cost
- `POST /api/costs` - Create cost
- `PUT /api/costs/:id` - Update cost
- `DELETE /api/costs/:id` - Delete cost

### Payments
- `GET /api/payments?client_id=X` - Get payments (with optional filter)
- `GET /api/payments/:id` - Get single payment
- `POST /api/payments` - Create payment
- `PUT /api/payments/:id` - Update payment
- `DELETE /api/payments/:id` - Delete payment

## Testing the API

```bash
# Test health endpoint
curl http://localhost:5000/api/health

# Create a driver
curl -X POST http://localhost:5000/api/drivers \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","license_number":"DL-12345","email":"john@example.com","phone":"+1234567890"}'
```

## Troubleshooting

### Database Connection Issues
- Make sure PostgreSQL is running: `brew services list` or check Postgres.app
- Verify credentials in `.env` file
- Test connection: `psql -U transport_user -d transport_db`

### Port Already in Use
- Change PORT in `.env` to another port (e.g., 5001)

### Permission Errors
- Make sure database user has proper privileges
- Run: `GRANT ALL PRIVILEGES ON DATABASE transport_db TO transport_user;`
