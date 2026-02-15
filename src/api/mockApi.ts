import { v4 as uuidv4 } from "uuid";
import type {
  ApiClient,
  Designer,
  SceneObject,
  CreateDesignerDto,
  UpdateDesignerDto,
  CreateObjectDto,
  UpdateObjectDto,
} from "./types";

const DESIGNERS_KEY = "dashboard3d_designers";
const OBJECTS_KEY = "dashboard3d_objects";

function loadFromStorage<T>(key: string, fallback: T[]): T[] {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function saveToStorage<T>(key: string, data: T[]): void {
  localStorage.setItem(key, JSON.stringify(data));
}

function delay(ms = 150): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const seedDesigners: Designer[] = [
  {
    id: uuidv4(),
    fullName: "Alice Johnson",
    workingHours: 40,
    attachedObjectsCount: 0,
  },
  {
    id: uuidv4(),
    fullName: "Bob Martinez",
    workingHours: 35,
    attachedObjectsCount: 0,
  },
  {
    id: uuidv4(),
    fullName: "Clara Chen",
    workingHours: 45,
    attachedObjectsCount: 0,
  },
];

let designers: Designer[] = loadFromStorage<Designer>(
  DESIGNERS_KEY,
  seedDesigners,
);
let objects: SceneObject[] = loadFromStorage<SceneObject>(OBJECTS_KEY, []);

if (!localStorage.getItem(DESIGNERS_KEY)) {
  saveToStorage(DESIGNERS_KEY, designers);
}

function recalculateAttachedCounts(): void {
  const countMap = new Map<string, number>();
  for (const obj of objects) {
    countMap.set(obj.designerId, (countMap.get(obj.designerId) ?? 0) + 1);
  }
  designers = designers.map((d) => ({
    ...d,
    attachedObjectsCount: countMap.get(d.id) ?? 0,
  }));
  saveToStorage(DESIGNERS_KEY, designers);
}

recalculateAttachedCounts();

export const mockApi: ApiClient = {
  async getDesigners() {
    await delay();
    return [...designers];
  },

  async getDesigner(id: string) {
    await delay();
    return designers.find((d) => d.id === id) ?? null;
  },

  async createDesigner(data: CreateDesignerDto) {
    await delay();
    const newDesigner: Designer = {
      id: uuidv4(),
      fullName: data.fullName,
      workingHours: data.workingHours,
      attachedObjectsCount: 0,
    };
    designers = [...designers, newDesigner];
    saveToStorage(DESIGNERS_KEY, designers);
    return newDesigner;
  },

  async updateDesigner(id: string, data: UpdateDesignerDto) {
    await delay();
    const index = designers.findIndex((d) => d.id === id);
    if (index === -1) throw new Error(`Designer ${id} not found`);

    designers[index] = { ...designers[index], ...data };
    designers = [...designers];
    saveToStorage(DESIGNERS_KEY, designers);
    return designers[index];
  },

  async deleteDesigner(id: string) {
    await delay();
    objects = objects.filter((o) => o.designerId !== id);
    saveToStorage(OBJECTS_KEY, objects);

    designers = designers.filter((d) => d.id !== id);
    saveToStorage(DESIGNERS_KEY, designers);
    recalculateAttachedCounts();
  },

  async getObjects() {
    await delay();
    return [...objects];
  },

  async getObject(id: string) {
    await delay();
    return objects.find((o) => o.id === id) ?? null;
  },

  async createObject(data: CreateObjectDto) {
    await delay();
    const newObject: SceneObject = {
      id: uuidv4(),
      name: data.name,
      designerId: data.designerId,
      color: data.color,
      position: data.position,
      size: data.size,
      geometry: data.geometry,
    };
    objects = [...objects, newObject];
    saveToStorage(OBJECTS_KEY, objects);
    recalculateAttachedCounts();
    return newObject;
  },

  async updateObject(id: string, data: UpdateObjectDto) {
    await delay();
    const index = objects.findIndex((o) => o.id === id);
    if (index === -1) throw new Error(`Object ${id} not found`);

    objects[index] = { ...objects[index], ...data };
    objects = [...objects];
    saveToStorage(OBJECTS_KEY, objects);
    recalculateAttachedCounts();
    return objects[index];
  },

  async deleteObject(id: string) {
    await delay();
    objects = objects.filter((o) => o.id !== id);
    saveToStorage(OBJECTS_KEY, objects);
    recalculateAttachedCounts();
  },
};
