import { createRequest } from "../utils/test-utils.js";
import { API_URL } from "../utils/env.js";

describe("Public API Endpoints", () => {
  // Setup a request object using our test utilities
  const request = createRequest(API_URL);

  describe("GET /health", () => {
    it("should return a 200 status and health data", async () => {
      const response = await request.get("/health");

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("status", "ok");
      expect(response.body).toHaveProperty("version");
    });
  });

  describe("GET /items", () => {
    it("should return a list of items", async () => {
      const response = await request.get("/items");

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });

    it("should filter items by category", async () => {
      const category = "electronics";
      const response = await request.get(`/items?category=${category}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);

      // Check that all returned items match the category
      if (response.body.length > 0) {
        response.body.forEach((item) => {
          expect(item.category).toBe(category);
        });
      }
    });
  });
});
