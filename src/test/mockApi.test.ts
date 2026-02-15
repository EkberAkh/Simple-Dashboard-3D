import { describe, it, expect, beforeEach } from "vitest";
import { mockApi } from "@/api/mockApi";

describe("Mock API — Designers", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("should return seed designers on first load", async () => {
    const designers = await mockApi.getDesigners();
    expect(designers.length).toBe(3);
    expect(designers[0]).toHaveProperty("id");
    expect(designers[0]).toHaveProperty("fullName");
    expect(designers[0]).toHaveProperty("workingHours");
    expect(designers[0]).toHaveProperty("attachedObjectsCount");
  });

  it("should create a new designer", async () => {
    const created = await mockApi.createDesigner({
      fullName: "Test User",
      workingHours: 30,
    });
    expect(created.fullName).toBe("Test User");
    expect(created.workingHours).toBe(30);
    expect(created.attachedObjectsCount).toBe(0);
    expect(created.id).toBeTruthy();

    const all = await mockApi.getDesigners();
    expect(all.find((d) => d.id === created.id)).toBeTruthy();
  });

  it("should update a designer", async () => {
    const designers = await mockApi.getDesigners();
    const first = designers[0];
    const updated = await mockApi.updateDesigner(first.id, {
      fullName: "Updated Name",
    });
    expect(updated.fullName).toBe("Updated Name");
    expect(updated.id).toBe(first.id);
  });

  it("should delete a designer", async () => {
    const designers = await mockApi.getDesigners();
    const countBefore = designers.length;
    await mockApi.deleteDesigner(designers[0].id);
    const after = await mockApi.getDesigners();
    expect(after.length).toBe(countBefore - 1);
  });

  it("should get a single designer", async () => {
    const designers = await mockApi.getDesigners();
    const found = await mockApi.getDesigner(designers[0].id);
    expect(found).toBeTruthy();
    expect(found?.id).toBe(designers[0].id);
  });

  it("should return null for non-existent designer", async () => {
    const found = await mockApi.getDesigner("non-existent-id");
    expect(found).toBeNull();
  });
});

describe("Mock API — Objects", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("should start with no objects", async () => {
    const objects = await mockApi.getObjects();
    expect(objects.length).toBe(0);
  });

  it("should create a new object", async () => {
    const designers = await mockApi.getDesigners();
    const created = await mockApi.createObject({
      name: "Test Cube",
      designerId: designers[0].id,
      color: "#6366F1",
      position: [1, 0, 2],
      size: "normal",
      geometry: "box",
    });
    expect(created.name).toBe("Test Cube");
    expect(created.color).toBe("#6366F1");
    expect(created.geometry).toBe("box");
    expect(created.position).toEqual([1, 0, 2]);
  });

  it("should update an object", async () => {
    const designers = await mockApi.getDesigners();
    const created = await mockApi.createObject({
      name: "Obj",
      designerId: designers[0].id,
      color: "#FF0000",
      position: [0, 0, 0],
      size: "small",
      geometry: "sphere",
    });
    const updated = await mockApi.updateObject(created.id, {
      name: "Renamed",
      color: "#00FF00",
      geometry: "cone",
    });
    expect(updated.name).toBe("Renamed");
    expect(updated.color).toBe("#00FF00");
    expect(updated.geometry).toBe("cone");
  });

  it("should delete an object", async () => {
    const designers = await mockApi.getDesigners();
    const created = await mockApi.createObject({
      name: "ToDelete",
      designerId: designers[0].id,
      color: "#000000",
      position: [0, 0, 0],
      size: "normal",
      geometry: "cylinder",
    });
    await mockApi.deleteObject(created.id);
    const objects = await mockApi.getObjects();
    expect(objects.find((o) => o.id === created.id)).toBeUndefined();
  });

  it("should update attached object count on designer", async () => {
    const designers = await mockApi.getDesigners();
    const designer = designers[0];
    const initialCount = designer.attachedObjectsCount;

    await mockApi.createObject({
      name: "A",
      designerId: designer.id,
      color: "#000",
      position: [0, 0, 0],
      size: "normal",
      geometry: "box",
    });

    const updatedDesigners = await mockApi.getDesigners();
    const updatedDesigner = updatedDesigners.find((d) => d.id === designer.id);
    expect(updatedDesigner?.attachedObjectsCount).toBe(initialCount + 1);
  });
});
