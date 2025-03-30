import fetch from "node-fetch";
import { API_URL, API_VERSION } from "./env.js";

/**
 * API Client for making requests to the API
 */
export default class ApiClient {
  /**
   * Create a new API client
   *
   * @param {Object} options - Client options
   * @param {string} options.baseUrl - Base URL for API
   * @param {string} options.version - API version
   * @param {Object} options.headers - Default headers
   */
  constructor(options = {}) {
    this.baseUrl = options.baseUrl || API_URL;
    this.version = options.version || API_VERSION;
    this.headers = {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...options.headers,
    };
  }

  /**
   * Get the full URL for an endpoint
   *
   * @param {string} endpoint - API endpoint
   * @returns {string} Full URL
   */
  getUrl(endpoint) {
    // Remove leading slash if present
    const cleanEndpoint = endpoint.startsWith("/")
      ? endpoint.slice(1)
      : endpoint;

    return `${this.baseUrl}/${this.version}/${cleanEndpoint}`;
  }

  /**
   * Set authorization header with JWT token
   *
   * @param {string} token - JWT token
   */
  setAuthToken(token) {
    this.headers.Authorization = `Bearer ${token}`;
  }

  /**
   * Clear authorization header
   */
  clearAuthToken() {
    delete this.headers.Authorization;
  }

  /**
   * Make a request to the API
   *
   * @param {string} method - HTTP method
   * @param {string} endpoint - API endpoint
   * @param {Object} data - Request body data
   * @param {Object} customHeaders - Custom headers to merge with defaults
   * @returns {Promise<Object>} Response data
   */
  async request(method, endpoint, data = null, customHeaders = {}) {
    const url = this.getUrl(endpoint);
    const headers = { ...this.headers, ...customHeaders };

    const options = {
      method,
      headers,
    };

    if (data && ["POST", "PUT", "PATCH"].includes(method.toUpperCase())) {
      options.body = JSON.stringify(data);
    }

    try {
      const response = await fetch(url, options);
      const contentType = response.headers.get("content-type");

      if (contentType && contentType.includes("application/json")) {
        const data = await response.json();
        return {
          status: response.status,
          headers: response.headers,
          data,
        };
      } else {
        const text = await response.text();
        return {
          status: response.status,
          headers: response.headers,
          data: text,
        };
      }
    } catch (error) {
      console.error(`Error making ${method} request to ${url}:`, error);
      throw error;
    }
  }

  /**
   * Make a GET request
   *
   * @param {string} endpoint - API endpoint
   * @param {Object} customHeaders - Custom headers
   * @returns {Promise<Object>} Response data
   */
  get(endpoint, customHeaders = {}) {
    return this.request("GET", endpoint, null, customHeaders);
  }

  /**
   * Make a POST request
   *
   * @param {string} endpoint - API endpoint
   * @param {Object} data - Request body data
   * @param {Object} customHeaders - Custom headers
   * @returns {Promise<Object>} Response data
   */
  post(endpoint, data, customHeaders = {}) {
    return this.request("POST", endpoint, data, customHeaders);
  }

  /**
   * Make a PUT request
   *
   * @param {string} endpoint - API endpoint
   * @param {Object} data - Request body data
   * @param {Object} customHeaders - Custom headers
   * @returns {Promise<Object>} Response data
   */
  put(endpoint, data, customHeaders = {}) {
    return this.request("PUT", endpoint, data, customHeaders);
  }

  /**
   * Make a PATCH request
   *
   * @param {string} endpoint - API endpoint
   * @param {Object} data - Request body data
   * @param {Object} customHeaders - Custom headers
   * @returns {Promise<Object>} Response data
   */
  patch(endpoint, data, customHeaders = {}) {
    return this.request("PATCH", endpoint, data, customHeaders);
  }

  /**
   * Make a DELETE request
   *
   * @param {string} endpoint - API endpoint
   * @param {Object} customHeaders - Custom headers
   * @returns {Promise<Object>} Response data
   */
  delete(endpoint, customHeaders = {}) {
    return this.request("DELETE", endpoint, null, customHeaders);
  }
}
