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
  echo "  -o, --open-report       Open HTML report after tests complete"
  echo "  -r, --report-type TYPE  Report type to open (html, coverage) (default: html)"
  echo ""
  echo "Examples:"
  echo "  ./run-tests.sh                               # Run all tests with default settings"
  echo "  ./run-tests.sh -f __tests__/public-api.test.js  # Run only public API tests"
  echo "  ./run-tests.sh -u https://staging-api.com    # Use staging API"
  echo "  ./run-tests.sh -e .env.staging              # Use staging environment variables"
  echo "  ./run-tests.sh -o                           # Open HTML report after tests complete"
  echo ""
}

# Default values
TEST_FILE=""
ENV_FILE=".env"
BUILD=false
API_URL=""
OPEN_REPORT=false
REPORT_TYPE="html"

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
    -o|--open-report)
      OPEN_REPORT=true
      shift
      ;;
    -r|--report-type)
      REPORT_TYPE="$2"
      shift 2
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

# Create reports directory if it doesn't exist
mkdir -p reports

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

# Open report if requested
if [ "$OPEN_REPORT" = true ]; then
  if [ "$REPORT_TYPE" = "html" ]; then
    echo "Opening HTML test report..."
    # Check which command to use for opening files based on OS
    if [ "$(uname)" == "Darwin" ]; then
      # macOS
      open ./reports/test-report.html
    elif [ "$(expr substr $(uname -s) 1 5)" == "Linux" ]; then
      # Linux
      if command -v xdg-open > /dev/null; then
        xdg-open ./reports/test-report.html
      else
        echo "Cannot open report: xdg-open not found. Please open manually: ./reports/test-report.html"
      fi
    elif [ "$(expr substr $(uname -s) 1 10)" == "MINGW32_NT" ] || [ "$(expr substr $(uname -s) 1 10)" == "MINGW64_NT" ]; then
      # Windows
      start ./reports/test-report.html
    else
      echo "Cannot determine OS to open report. Please open manually: ./reports/test-report.html"
    fi
  elif [ "$REPORT_TYPE" = "coverage" ]; then
    echo "Opening code coverage report..."
    if [ "$(uname)" == "Darwin" ]; then
      open ./reports/coverage/lcov-report/index.html
    elif [ "$(expr substr $(uname -s) 1 5)" == "Linux" ]; then
      if command -v xdg-open > /dev/null; then
        xdg-open ./reports/coverage/lcov-report/index.html
      else
        echo "Cannot open report: xdg-open not found. Please open manually: ./reports/coverage/lcov-report/index.html"
      fi
    elif [ "$(expr substr $(uname -s) 1 10)" == "MINGW32_NT" ] || [ "$(expr substr $(uname -s) 1 10)" == "MINGW64_NT" ]; then
      start ./reports/coverage/lcov-report/index.html
    else
      echo "Cannot determine OS to open report. Please open manually: ./reports/coverage/lcov-report/index.html"
    fi
  else
    echo "Unknown report type: $REPORT_TYPE. Please use 'html' or 'coverage'."
  fi
fi 