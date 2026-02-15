export type ObjectSize = "small" | "normal" | "large";

export type GeometryType = "box" | "sphere" | "cylinder" | "cone" | "torus";

export interface Designer {
  id: string;
  fullName: string;
  workingHours: number;
  attachedObjectsCount: number;
}

export interface SceneObject {
  id: string;
  name: string;
  designerId: string;
  color: string;
  position: [number, number, number];
  size: ObjectSize;
  geometry: GeometryType;
}

export interface CreateDesignerDto {
  fullName: string;
  workingHours: number;
}

export interface UpdateDesignerDto {
  fullName?: string;
  workingHours?: number;
}

export interface CreateObjectDto {
  name: string;
  designerId: string;
  color: string;
  position: [number, number, number];
  size: ObjectSize;
  geometry: GeometryType;
}

export interface UpdateObjectDto {
  name?: string;
  designerId?: string;
  color?: string;
  position?: [number, number, number];
  size?: ObjectSize;
  geometry?: GeometryType;
}

export interface ApiClient {
  getDesigners(): Promise<Designer[]>;
  getDesigner(id: string): Promise<Designer | null>;
  createDesigner(data: CreateDesignerDto): Promise<Designer>;
  updateDesigner(id: string, data: UpdateDesignerDto): Promise<Designer>;
  deleteDesigner(id: string): Promise<void>;

  getObjects(): Promise<SceneObject[]>;
  getObject(id: string): Promise<SceneObject | null>;
  createObject(data: CreateObjectDto): Promise<SceneObject>;
  updateObject(id: string, data: UpdateObjectDto): Promise<SceneObject>;
  deleteObject(id: string): Promise<void>;
}
