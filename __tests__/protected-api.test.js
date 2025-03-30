import {
  createRequest,
  createAuthenticatedRequest,
  assertions,
} from "../utils/test-utils.js";
import { API_URL } from "../utils/env.js";

describe("Protected API Endpoints", () => {
  // Setup a regular request and an authenticated request
  const request = createRequest(API_URL);
  const {
    request: authRequest,
    user,
    token,
  } = createAuthenticatedRequest(API_URL);

  describe("GET /profile", () => {
    it("should return 401 unauthorized without token", async () => {
      const response = await request.get("/profile");

      expect(response.status).toBe(401);
    });

    it("should return user profile with valid token", async () => {
      const response = await authRequest.get("/profile");

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("id", user.id);
      expect(response.body).toHaveProperty("email", user.email);
    });
  });

  describe("POST /orders", () => {
    const orderData = {
      items: [
        { productId: "product-1", quantity: 2 },
        { productId: "product-2", quantity: 1 },
      ],
      shippingAddress: {
        street: "123 Test St",
        city: "Test City",
        zipCode: "12345",
      },
    };

    it("should return 401 unauthorized without token", async () => {
      const response = await request.post("/orders").send(orderData);

      expect(response.status).toBe(401);
    });

    it("should create an order with valid token", async () => {
      const response = await authRequest.post("/orders").send(orderData);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("id");
      expect(response.body).toHaveProperty("userId", user.id);
      expect(response.body).toHaveProperty("items");
      expect(response.body.items).toHaveLength(orderData.items.length);
    });

    it("should return 400 for invalid order data", async () => {
      const invalidOrder = { items: [] }; // Missing required items

      const response = await authRequest.post("/orders").send(invalidOrder);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("error");
    });
  });

  describe("PUT /profile", () => {
    const profileUpdates = {
      name: "Updated Name",
      phoneNumber: "555-123-4567",
    };

    it("should update user profile with valid token", async () => {
      const response = await authRequest.put("/profile").send(profileUpdates);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("name", profileUpdates.name);
      expect(response.body).toHaveProperty(
        "phoneNumber",
        profileUpdates.phoneNumber
      );
    });
  });
});
