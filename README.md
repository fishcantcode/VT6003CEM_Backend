# Hotel Booking API Backend

## Project Overview
A containerized backend service for a hotel booking platform, built with Node.js, Express, and TypeScript. This API provides authentication, user management, and hotel booking functionality.

## Features
-  JWT-based authentication
-  User registration and profile management
-  Hotel CRUD operations
-  Test with Jest
-  Docker support

## Technologies Used
- **Runtime**: Node.js
- **Language**: TypeScript
- **Framework**: Express
- **Database**: PostgreSQL
- **Authentication**: JWT
- **Testing**: Jest
- **Containerization**: Docker

## Prerequisites
- [Docker](https://www.docker.com/get-started)
- [Docker Compose](https://docs.docker.com/compose/install/)

## Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/fishcantcode/VT6003CEM_Backend.git
cd VT6003CEM_Backend
```

### 2. Environment Setup
Create a `.env` file in the root directory by copying the example:
```bash
cp .env.example .env
```

Edit the `.env` file with your preferred settings:
```env
# Server
PORT=3000
NODE_ENV=development

# Database
DB_HOST=your_database_host
DB_PORT=your_database_port
DB_NAME=your_database_name
DB_USER=your_database_user
DB_PASS=your_database_password

# JWT
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=24h
```

### 3. Build and Start Containers
```bash
docker-compose up --build
```

This will:
1. Build the Node.js application container
2. Set up a PostgreSQL database container
3. Run database migrations
4. Start the application

The API will be available at `http://localhost:3000`

### 4. Verify the Setup
Check if the containers are running:
```bash
docker-compose ps
```

View application logs:
```bash
docker-compose logs -f app
```

## Development Workflow

### Running Tests
```bash
docker-compose run --rm app npm test
```

### Stopping the Application
```bash
docker-compose down
```

### Resetting the Database
To completely reset the database (warning: this will delete all data):
```bash
docker-compose down -v
docker-compose up --build
```

### Accessing the Database
To connect to the PostgreSQL database directly:
```bash
docker-compose exec postgres psql -U postgres -d hotel_booking
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user profile (protected)

### Users
- `GET /api/users` - Get all users (admin only)
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Hotels
- `GET /api/hotels` - Get all hotels
- `GET /api/hotels/:id` - Get hotel by ID
- `POST /api/hotels` - Create new hotel (protected)
- `PUT /api/hotels/:id` - Update hotel (protected)
- `DELETE /api/hotels/:id` - Delete hotel (protected)

## Project Structure
```
backend/
├── src/
│   ├── __tests__/       # Test files
│   ├── config/          # Configuration files
│   ├── controllers/     # Route controllers
│   ├── middlewares/     # Custom middleware
│   ├── models/          # Database models
│   ├── routes/          # API routes
│   ├── services/        # Business logic
│   ├── app.ts           # Express app configuration
│   └── server.ts        # Server entry point
├── .env                 # Environment variables
├── .gitignore
├── package.json
├── tsconfig.json        # TypeScript configuration
└── README.md
```
