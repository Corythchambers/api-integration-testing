#!/bin/bash

# run-tests.sh - A helper script to run API tests with Docker

# Help function
show_help() {
  echo "API Testing Framework - Docker Runner"
  echo ""
  echo "Usage: ./run-tests.sh [options]"
  echo ""
  echo "Options:"
  echo "  -f, --file TEST_FILE    Run specific test file (e.g. __tests__/public-api.test.js)"
  echo "  -e, --env ENV_FILE      Use specific .env file (default: .env)"
  echo "  -u, --url API_URL       Override API URL"
  echo "  -b, --build             Rebuild Docker image before running tests"
  echo "  -h, --help              Show this help message"
  echo ""
  echo "Examples:"
  echo "  ./run-tests.sh                               # Run all tests with default settings"
  echo "  ./run-tests.sh -f __tests__/public-api.test.js  # Run only public API tests"
  echo "  ./run-tests.sh -u https://staging-api.com    # Use staging API"
  echo "  ./run-tests.sh -e .env.staging              # Use staging environment variables"
  echo ""
}

# Default values
TEST_FILE=""
ENV_FILE=".env"
BUILD=false
API_URL=""

# Parse arguments
while [[ $# -gt 0 ]]; do
  case "$1" in
    -f|--file)
      TEST_FILE="$2"
      shift 2
      ;;
    -e|--env)
      ENV_FILE="$2"
      shift 2
      ;;
    -u|--url)
      API_URL="$2"
      shift 2
      ;;
    -b|--build)
      BUILD=true
      shift
      ;;
    -h|--help)
      show_help
      exit 0
      ;;
    *)
      echo "Unknown option: $1"
      show_help
      exit 1
      ;;
  esac
done

# Load environment variables if file exists
if [ -f "$ENV_FILE" ]; then
  echo "Loading environment from $ENV_FILE"
  export $(grep -v '^#' "$ENV_FILE" | xargs)
else
  echo "Warning: Environment file $ENV_FILE not found, using defaults"
fi

# Override API URL if provided
if [ -n "$API_URL" ]; then
  export API_URL="$API_URL"
  echo "Using API URL: $API_URL"
fi

# Build Docker image if requested
if [ "$BUILD" = true ]; then
  echo "Rebuilding Docker image..."
  docker-compose build api-tests
fi

# Prepare the command
if [ -n "$TEST_FILE" ]; then
  echo "Running test file: $TEST_FILE"
  docker-compose run api-tests npm test -- "$TEST_FILE"
else
  echo "Running all tests..."
  docker-compose run api-tests npm test
fi 