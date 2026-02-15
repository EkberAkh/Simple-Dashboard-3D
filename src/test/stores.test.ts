import { describe, it, expect, beforeEach } from "vitest";
import { useDesignerStore } from "@/store/designerStore";
import { useObjectStore } from "@/store/objectStore";
import { useEditorStore } from "@/store/editorStore";

describe("Designer Store", () => {
  beforeEach(() => {
    localStorage.clear();
    useDesignerStore.setState({ designers: [], isLoading: false, error: null });
  });

  it("should have correct initial state", () => {
    const state = useDesignerStore.getState();
    expect(state.designers).toEqual([]);
    expect(state.isLoading).toBe(false);
    expect(state.error).toBeNull();
  });

  it("should fetch designers", async () => {
    await useDesignerStore.getState().fetchDesigners();
    const state = useDesignerStore.getState();
    expect(state.designers.length).toBeGreaterThan(0);
    expect(state.isLoading).toBe(false);
  });

  it("should add a designer", async () => {
    const designer = await useDesignerStore.getState().addDesigner({
      fullName: "New Designer",
      workingHours: 25,
    });
    expect(designer.fullName).toBe("New Designer");
    const state = useDesignerStore.getState();
    expect(state.designers.find((d) => d.id === designer.id)).toBeTruthy();
  });
});

describe("Object Store", () => {
  beforeEach(() => {
    localStorage.clear();
    useObjectStore.setState({ objects: [], isLoading: false, error: null });
  });

  it("should have correct initial state", () => {
    const state = useObjectStore.getState();
    expect(state.objects).toEqual([]);
    expect(state.isLoading).toBe(false);
    expect(state.error).toBeNull();
  });

  it("should fetch objects (initially empty)", async () => {
    await useObjectStore.getState().fetchObjects();
    const state = useObjectStore.getState();
    expect(Array.isArray(state.objects)).toBe(true);
    expect(state.isLoading).toBe(false);
  });
});

describe("Editor Store", () => {
  beforeEach(() => {
    useEditorStore.setState({
      selectedObjectId: null,
      hoveredObjectId: null,
      pendingPlacement: null,
    });
  });

  it("should select an object", () => {
    useEditorStore.getState().selectObject("test-id");
    expect(useEditorStore.getState().selectedObjectId).toBe("test-id");
  });

  it("should deselect an object", () => {
    useEditorStore.getState().selectObject("test-id");
    useEditorStore.getState().selectObject(null);
    expect(useEditorStore.getState().selectedObjectId).toBeNull();
  });

  it("should set hovered object", () => {
    useEditorStore.getState().hoverObject("hover-id");
    expect(useEditorStore.getState().hoveredObjectId).toBe("hover-id");
  });

  it("should set pending placement", () => {
    useEditorStore.getState().setPendingPlacement([1, 0, 2]);
    expect(useEditorStore.getState().pendingPlacement).toEqual([1, 0, 2]);
  });

  it("should clear pending placement", () => {
    useEditorStore.getState().setPendingPlacement([1, 0, 2]);
    useEditorStore.getState().setPendingPlacement(null);
    expect(useEditorStore.getState().pendingPlacement).toBeNull();
  });
});
