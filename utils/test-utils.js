import supertest from "supertest";
import { createTestUser } from "./auth.js";
import { API_URL } from "./env.js";

/**
 * Create a supertest request object for testing an API
 *
 * @param {Object|string} app - Express app or API URL
 * @returns {Object} Supertest request object
 */
export function createRequest(app = API_URL) {
  return supertest(app);
}

/**
 * Create an authenticated supertest request
 *
 * @param {Object|string} app - Express app or API URL
 * @param {Object} options - Options
 * @param {Object} options.user - Custom user properties
 * @returns {Object} { request, user, token }
 */
export function createAuthenticatedRequest(app = API_URL, options = {}) {
  const request = createRequest(app);
  const { user, token } = createTestUser(options.user);

  // Add authorization header to all requests
  const authRequest = Object.create(request);
  const methods = ["get", "post", "put", "patch", "delete", "head"];

  methods.forEach((method) => {
    authRequest[method] = function (url, ...args) {
      return request[method](url, ...args).set(
        "Authorization",
        `Bearer ${token}`
      );
    };
  });

  return {
    request: authRequest,
    user,
    token,
  };
}

/**
 * Test helpers for common assertions
 */
export const assertions = {
  /**
   * Expect a response to be successful
   *
   * @param {Object} response - Supertest response
   * @returns {Object} The response for chaining
   */
  success(response) {
    expect(response.status).toBe(200);
    return response;
  },

  /**
   * Expect a response to be created
   *
   * @param {Object} response - Supertest response
   * @returns {Object} The response for chaining
   */
  created(response) {
    expect(response.status).toBe(201);
    return response;
  },

  /**
   * Expect an unauthorized response
   *
   * @param {Object} response - Supertest response
   * @returns {Object} The response for chaining
   */
  unauthorized(response) {
    expect(response.status).toBe(401);
    return response;
  },

  /**
   * Expect a forbidden response
   *
   * @param {Object} response - Supertest response
   * @returns {Object} The response for chaining
   */
  forbidden(response) {
    expect(response.status).toBe(403);
    return response;
  },

  /**
   * Expect a not found response
   *
   * @param {Object} response - Supertest response
   * @returns {Object} The response for chaining
   */
  notFound(response) {
    expect(response.status).toBe(404);
    return response;
  },
};
