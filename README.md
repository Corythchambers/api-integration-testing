# API Integration Testing Framework

A minimal test framework using Supertest and Jest for testing APIs.

## Features

- Built with **Supertest** and **Jest** for API testing
- Support for environment variables using **dotenv**
- Uses ES modules (import/export) instead of CommonJS
- Support for testing protected routes using JWT authentication
- Utility functions for common testing scenarios
- **Dockerized** for consistent testing environments and easy CI/CD integration

## Installation

### Standard Installation

1. Clone this repository
2. Install dependencies:

```bash
npm install
```

3. Copy the example environment file and customize it:

```bash
cp .env.example .env
```

### Docker Installation

1. Clone this repository
2. Make sure Docker and Docker Compose are installed on your system
3. Build the Docker image:

```bash
docker-compose build
```

## Configuration

Configure your environment variables in the `.env` file:

```
# API Configuration
API_URL=http://localhost:3000
API_VERSION=v1

# Authentication
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRATION=1h

# Test User Credentials
TEST_USER_EMAIL=test@example.com
TEST_USER_PASSWORD=password123
```

## Project Structure

```
api-integration-testing/
├── __tests__/               # Test files
│   ├── public-api.test.js   # Tests for public endpoints
│   └── protected-api.test.js# Tests for protected endpoints
├── utils/                   # Utility functions
│   ├── api-client.js        # API client for making requests
│   ├── auth.js              # Authentication utilities
│   ├── env.js               # Environment variable loader
│   └── test-utils.js        # Testing utilities
├── .env                     # Environment variables (private)
├── .env.example             # Example environment variables
├── .dockerignore            # Files excluded from Docker build
├── docker-compose.yml       # Docker Compose configuration
├── Dockerfile               # Docker image definition
├── jest.config.js           # Jest configuration
├── package.json             # Project metadata and dependencies
└── README.md                # Project documentation
```

## Writing Tests

### Public API Endpoints

For testing public endpoints that don't require authentication:

```javascript
import { createRequest } from "../utils/test-utils.js";

describe("Public API", () => {
  const request = createRequest();

  it("should return health status", async () => {
    const response = await request.get("/health");

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("status", "ok");
  });
});
```

### Protected API Endpoints

For testing protected endpoints that require authentication:

```javascript
import { createAuthenticatedRequest } from "../utils/test-utils.js";

describe("Protected API", () => {
  const { request, user } = createAuthenticatedRequest();

  it("should return user profile", async () => {
    const response = await request.get("/profile");

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("id", user.id);
  });
});
```

## Running Tests

### Running Tests Locally

Run all tests:

```bash
npm test
```

Run a specific test file:

```bash
npm test -- __tests__/public-api.test.js
```

### Running Tests with Docker

Run all tests:

```bash
docker-compose up
```

Run tests with specific environment variables:

```bash
API_URL=https://staging-api.example.com docker-compose up
```

Run a specific test file:

```bash
docker-compose run api-tests npm test -- __tests__/public-api.test.js
```

### Using the Helper Script

For convenience, you can use the included helper script:

```bash
# Run all tests
./run-tests.sh

# Run specific test file
./run-tests.sh -f __tests__/public-api.test.js

# Use a specific environment file
./run-tests.sh -e .env.staging

# Override API URL
./run-tests.sh -u https://dev-api.example.com

# Rebuild Docker image before running tests
./run-tests.sh -b

# Get help
./run-tests.sh -h
```

## Creating Custom Authentication

To create a custom authenticated request with specific user properties:

```javascript
const { request, user, token } = createAuthenticatedRequest({
  user: {
    id: "custom-id",
    email: "custom@example.com",
    role: "admin",
  },
});

// This request will be authenticated with the custom user
const response = await request.get("/admin/dashboard");
```

## Making API Requests with Custom Client

You can also use the API client directly for more flexibility:

```javascript
import ApiClient from "../utils/api-client.js";

const client = new ApiClient();
client.setAuthToken("your-jwt-token");

const response = await client.get("/profile");
console.log(response.data);
```
