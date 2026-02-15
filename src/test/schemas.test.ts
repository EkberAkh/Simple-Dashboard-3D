import { describe, it, expect } from "vitest";
import { designerSchema } from "@/schemas/designerSchema";
import { objectSchema } from "@/schemas/objectSchema";

describe("Designer Schema Validation", () => {
  it("should accept valid designer data", () => {
    const result = designerSchema.safeParse({
      fullName: "John Doe",
      workingHours: 40,
    });
    expect(result.success).toBe(true);
  });

  it("should reject empty full name", () => {
    const result = designerSchema.safeParse({
      fullName: "",
      workingHours: 40,
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const msg = result.error.issues[0].message;
      expect(msg).toBe("This field is required");
    }
  });

  it("should reject too short full name", () => {
    const result = designerSchema.safeParse({
      fullName: "A",
      workingHours: 40,
    });
    expect(result.success).toBe(false);
  });

  it("should reject full name with numbers", () => {
    const result = designerSchema.safeParse({
      fullName: "John123",
      workingHours: 40,
    });
    expect(result.success).toBe(false);
  });

  it("should reject working hours below 1", () => {
    const result = designerSchema.safeParse({
      fullName: "John Doe",
      workingHours: 0,
    });
    expect(result.success).toBe(false);
  });

  it("should reject working hours above 80", () => {
    const result = designerSchema.safeParse({
      fullName: "John Doe",
      workingHours: 100,
    });
    expect(result.success).toBe(false);
  });

  it("should accept names with hyphens and apostrophes", () => {
    const result = designerSchema.safeParse({
      fullName: "Mary-Jane O'Brien",
      workingHours: 35,
    });
    expect(result.success).toBe(true);
  });
});

describe("Object Schema Validation", () => {
  it("should accept valid object data", () => {
    const result = objectSchema.safeParse({
      name: "Test Cube",
      designerId: "some-uuid",
      color: "#6366F1",
      size: "normal",
      geometry: "box",
    });
    expect(result.success).toBe(true);
  });

  it("should reject empty name", () => {
    const result = objectSchema.safeParse({
      name: "",
      designerId: "some-uuid",
      color: "#6366F1",
      size: "normal",
      geometry: "box",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const msg = result.error.issues[0].message;
      expect(msg).toBe("This field is required");
    }
  });

  it("should reject empty designerId", () => {
    const result = objectSchema.safeParse({
      name: "Obj",
      designerId: "",
      color: "#6366F1",
      size: "normal",
      geometry: "box",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const msg = result.error.issues[0].message;
      expect(msg).toBe("This field is required");
    }
  });

  it("should reject invalid color format", () => {
    const result = objectSchema.safeParse({
      name: "Obj",
      designerId: "some-uuid",
      color: "red",
      size: "normal",
      geometry: "box",
    });
    expect(result.success).toBe(false);
  });

  it("should reject invalid size", () => {
    const result = objectSchema.safeParse({
      name: "Obj",
      designerId: "some-uuid",
      color: "#6366F1",
      size: "huge",
      geometry: "box",
    });
    expect(result.success).toBe(false);
  });

  it("should accept all valid geometry types", () => {
    const geometries = ["box", "sphere", "cylinder", "cone", "torus"];
    geometries.forEach((geometry) => {
      const result = objectSchema.safeParse({
        name: "Obj",
        designerId: "some-uuid",
        color: "#6366F1",
        size: "normal",
        geometry,
      });
      expect(result.success).toBe(true);
    });
  });

  it("should reject invalid geometry type", () => {
    const result = objectSchema.safeParse({
      name: "Obj",
      designerId: "some-uuid",
      color: "#6366F1",
      size: "normal",
      geometry: "pyramid",
    });
    expect(result.success).toBe(false);
  });

  it("should accept all valid sizes", () => {
    const sizes = ["small", "normal", "large"];
    sizes.forEach((size) => {
      const result = objectSchema.safeParse({
        name: "Obj",
        designerId: "some-uuid",
        color: "#6366F1",
        size,
        geometry: "box",
      });
      expect(result.success).toBe(true);
    });
  });
});
