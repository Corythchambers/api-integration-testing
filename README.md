# API Integration Testing Framework

A minimal test framework using Supertest and Jest for testing APIs.

## Features

- Built with **Supertest** and **Jest** for API testing
- Support for environment variables using **dotenv**
- Uses ES modules (import/export) instead of CommonJS
- Support for testing protected routes using JWT authentication
- Utility functions for common testing scenarios
- **Dockerized** for consistent testing environments and easy CI/CD integration
- **Comprehensive Test Reports** with HTML and JUnit XML formats

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

# Run tests and open HTML report
./run-tests.sh -o

# Run tests and open coverage report
./run-tests.sh -o -r coverage

# Get help
./run-tests.sh -h
```

## Test Reports

The framework generates several types of test reports that help you understand test results, diagnose failures, and measure code coverage.

### HTML Test Report

A comprehensive HTML report showing test results, including:

- Test summary
- Detailed test cases
- Pass/fail status
- Error messages for failed tests

View the HTML report at: `./reports/test-report.html`

Or use the helper script to run tests and open the report automatically:

```bash
./run-tests.sh -o
```

#### Using the HTML Report

The HTML report provides an interactive way to analyze your test results:

1. **Summary View**: The report begins with a summary showing:

   - Total test suites and test cases
   - Number of passing and failing tests
   - Overall execution time

2. **Test Suite Details**: Each test suite is expandable to show individual test cases:

   - Green checkmarks indicate passing tests
   - Red X marks indicate failing tests
   - Click on a failing test to view the full error and stack trace

3. **Troubleshooting**: For failing tests, the report shows:

   - Expected vs. actual values
   - Line numbers where failures occurred
   - Context that helps identify the issue quickly

4. **Sharing Results**: The HTML report can be:
   - Saved as an artifact in CI/CD pipelines
   - Shared with team members for collaborative debugging
   - Archived for historical comparison

### JUnit XML Report

XML format report compatible with CI/CD systems like Jenkins, GitLab CI, GitHub Actions, etc.

View the XML report at: `./reports/junit.xml`

#### Using JUnit XML Reports

The JUnit XML report is primarily designed for integration with CI/CD systems:

1. **CI/CD Integration**:

   - Jenkins: Use the JUnit plugin to display test results
   - GitHub Actions: Use the `upload-artifact` action with test results reporter
   - GitLab CI: Configure the JUnit report artifact

2. **Example GitHub Actions Configuration**:

   ```yaml
   - name: Run Tests
     run: ./run-tests.sh

   - name: Upload Test Results
     uses: actions/upload-artifact@v2
     with:
       name: test-results
       path: reports/junit.xml

   - name: Publish Test Results
     uses: EnricoMi/publish-unit-test-result-action@v1
     if: always()
     with:
       files: reports/junit.xml
   ```

3. **Example Jenkins Configuration**:
   - Add a post-build action: "Publish JUnit test result report"
   - Set test report XMLs to: `reports/junit.xml`

### Code Coverage Report

Detailed code coverage analysis showing:

- Line coverage
- Branch coverage
- Function coverage
- Statement coverage

View the coverage report at: `./reports/coverage/lcov-report/index.html`

Or use the helper script:

```bash
./run-tests.sh -o -r coverage
```

#### Using the Coverage Report

The code coverage report helps identify untested parts of your codebase:

1. **Summary View**: The report starts with an overview showing:

   - Overall coverage percentages
   - Coverage by file and directory
   - Color-coded indicators (green for high coverage, red for low)

2. **Detailed File View**: Click on a file to see line-by-line coverage:

   - Green highlights indicate covered lines
   - Red highlights indicate uncovered lines
   - Yellow highlights indicate partially covered branches

3. **Improving Coverage**:

   - Identify files with low coverage percentages
   - Focus on critical paths with insufficient testing
   - Set coverage thresholds in your CI/CD pipeline

4. **Example Coverage Threshold Configuration**:
   Add to your Jest config:
   ```javascript
   // In jest.config.js
   coverageThreshold: {
     global: {
       branches: 80,
       functions: 80,
       lines: 80,
       statements: 80
     }
   }
   ```

### Integrating Reports with Development Workflow

For the most effective use of these reports:

1. **Regular Review**: Check reports after each test run to catch issues early
2. **Track Trends**: Monitor coverage and test success rates over time
3. **Team Visibility**: Make reports accessible to all team members
4. **CI/CD Gates**: Use coverage thresholds and test pass requirements as quality gates

### Customizing Reports

You can customize the reports by modifying the Jest configuration:

1. **HTML Report Options**: Update the `jest-html-reporter` section in `jest.config.js`
2. **Coverage Report Settings**: Modify the `coverageReporters` and `coverageDirectory` options
3. **JUnit Report Format**: Adjust the `jest-junit` configuration settings

For more options, refer to the documentation for each reporter:

- [jest-html-reporter](https://github.com/Hargne/jest-html-reporter)
- [jest-junit](https://github.com/jest-community/jest-junit)
- [Jest Coverage Configuration](https://jestjs.io/docs/configuration#coveragereporters-arraystring)

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
