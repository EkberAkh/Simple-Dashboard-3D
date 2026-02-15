import React, { useRef, useState, useCallback, useMemo } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import type { ThreeEvent } from "@react-three/fiber";
import * as THREE from "three";
import type { SceneObject, GeometryType } from "@/api";
import { useEditorStore } from "@/store/editorStore";
import { useObjectStore } from "@/store/objectStore";

interface SceneObjectMeshProps {
  object: SceneObject;
}

const SIZE_SCALE: Record<string, number> = {
  small: 0.5,
  normal: 1.0,
  large: 1.5,
};

function GeometryPrimitive({
  type,
  scale,
}: {
  type: GeometryType;
  scale: number;
}) {
  switch (type) {
    case "sphere":
      return <sphereGeometry args={[scale * 0.5, 32, 32]} />;
    case "cylinder":
      return (
        <cylinderGeometry args={[scale * 0.35, scale * 0.35, scale, 32]} />
      );
    case "cone":
      return <coneGeometry args={[scale * 0.4, scale, 32]} />;
    case "torus":
      return <torusGeometry args={[scale * 0.35, scale * 0.15, 16, 48]} />;
    case "box":
    default:
      return <boxGeometry args={[scale, scale, scale]} />;
  }
}

function getHalfHeight(type: GeometryType, scale: number): number {
  switch (type) {
    case "sphere":
      return scale * 0.5;
    case "cylinder":
    case "cone":
      return scale / 2;
    case "torus":
      return scale * 0.15 + 0.05; // tube radius + small offset
    case "box":
    default:
      return scale / 2;
  }
}

export const SceneObjectMesh: React.FC<SceneObjectMeshProps> = ({ object }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const { camera, gl, raycaster, controls } = useThree();

  const selectedId = useEditorStore((s) => s.selectedObjectId);
  const hoveredId = useEditorStore((s) => s.hoveredObjectId);
  const selectObject = useEditorStore((s) => s.selectObject);
  const hoverObject = useEditorStore((s) => s.hoverObject);
  const updateObject = useObjectStore((s) => s.updateObject);

  const isSelected = selectedId === object.id;
  const isHovered = hoveredId === object.id;

  const [isDragging, setIsDragging] = useState(false);
  const isDraggingRef = useRef(false);
  const dragPlane = useMemo(
    () => new THREE.Plane(new THREE.Vector3(0, 1, 0), 0),
    [],
  );
  const dragOffset = useRef(new THREE.Vector3());
  const lastDragPos = useRef<[number, number, number] | null>(null);

  const scale = SIZE_SCALE[object.size] ?? 1;
  const halfHeight = getHalfHeight(object.geometry ?? "box", scale);

  const baseColor = useMemo(
    () => new THREE.Color(object.color),
    [object.color],
  );

  const displayColor = useMemo(() => {
    if (isSelected)
      return new THREE.Color(object.color).lerp(
        new THREE.Color("#ffffff"),
        0.25,
      );
    if (isHovered)
      return new THREE.Color(object.color).lerp(
        new THREE.Color("#ffffff"),
        0.15,
      );
    return baseColor;
  }, [baseColor, isSelected, isHovered, object.color]);

  const emissiveColor = useMemo(() => {
    if (isSelected) return new THREE.Color("#6366F1").multiplyScalar(0.3);
    if (isHovered) return new THREE.Color("#818CF8").multiplyScalar(0.15);
    return new THREE.Color("#000000");
  }, [isSelected, isHovered]);

  const handlePointerDown = useCallback(
    (e: ThreeEvent<PointerEvent>) => {
      e.stopPropagation();
      selectObject(object.id);

      const intersectPoint = new THREE.Vector3();
      raycaster.ray.intersectPlane(dragPlane, intersectPoint);
      dragOffset.current
        .copy(intersectPoint)
        .sub(new THREE.Vector3(object.position[0], 0, object.position[2]));

      lastDragPos.current = null;
      setIsDragging(true);
      isDraggingRef.current = true;
      if (controls) (controls as any).enabled = false;
      (gl.domElement as HTMLElement).style.cursor = "grabbing";

      const handlePointerMove = (event: PointerEvent) => {
        const rect = gl.domElement.getBoundingClientRect();
        const mouse = new THREE.Vector2(
          ((event.clientX - rect.left) / rect.width) * 2 - 1,
          -((event.clientY - rect.top) / rect.height) * 2 + 1,
        );

        raycaster.setFromCamera(mouse, camera);
        const planeIntersect = new THREE.Vector3();
        raycaster.ray.intersectPlane(dragPlane, planeIntersect);

        if (planeIntersect) {
          const newPos: [number, number, number] = [
            planeIntersect.x - dragOffset.current.x,
            0,
            planeIntersect.z - dragOffset.current.z,
          ];
          if (meshRef.current) {
            meshRef.current.position.set(newPos[0], halfHeight, newPos[2]);
          }
          lastDragPos.current = newPos;
        }
      };

      const handlePointerUp = () => {
        setIsDragging(false);
        isDraggingRef.current = false;
        if (controls) (controls as any).enabled = true;
        hoverObject(null);
        (gl.domElement as HTMLElement).style.cursor = "auto";
        window.removeEventListener("pointermove", handlePointerMove);
        window.removeEventListener("pointerup", handlePointerUp);

        if (lastDragPos.current) {
          updateObject(object.id, { position: lastDragPos.current });
        }
      };

      window.addEventListener("pointermove", handlePointerMove);
      window.addEventListener("pointerup", handlePointerUp);
    },
    [
      object.id,
      object.position,
      camera,
      gl,
      raycaster,
      controls,
      dragPlane,
      halfHeight,
      selectObject,
      updateObject,
      hoverObject,
    ],
  );

  const handleClick = useCallback((e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
  }, []);

  const handlePointerOver = useCallback(
    (e: ThreeEvent<PointerEvent>) => {
      e.stopPropagation();
      if (!isDraggingRef.current) {
        hoverObject(object.id);
        (gl.domElement as HTMLElement).style.cursor = "pointer";
      }
    },
    [object.id, gl, hoverObject],
  );

  const handlePointerOut = useCallback(
    (e: ThreeEvent<PointerEvent>) => {
      e.stopPropagation();
      hoverObject(null);
      if (!isDraggingRef.current) {
        (gl.domElement as HTMLElement).style.cursor = "auto";
      }
    },
    [gl, hoverObject],
  );

  const ringRef = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (ringRef.current && isSelected) {
      const t = clock.getElapsedTime();
      ringRef.current.material instanceof THREE.MeshBasicMaterial &&
        (ringRef.current.material.opacity = 0.45 + Math.sin(t * 3) * 0.1);
    }
  });

  return (
    <group>
      <mesh
        ref={meshRef}
        position={[object.position[0], halfHeight, object.position[2]]}
        castShadow
        receiveShadow
        onClick={handleClick}
        onPointerDown={handlePointerDown}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      >
        <GeometryPrimitive type={object.geometry ?? "box"} scale={scale} />
        <meshStandardMaterial
          color={displayColor}
          emissive={emissiveColor}
          roughness={0.4}
          metalness={0.2}
        />
      </mesh>

      {isSelected && (
        <mesh position={[object.position[0], halfHeight, object.position[2]]}>
          <GeometryPrimitive
            type={object.geometry ?? "box"}
            scale={scale * 1.02}
          />
          <meshBasicMaterial
            color="#A5B4FC"
            wireframe
            transparent
            opacity={0.35}
          />
        </mesh>
      )}

      {isSelected && (
        <mesh
          ref={ringRef}
          position={[object.position[0], 0.01, object.position[2]]}
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <ringGeometry args={[scale * 0.7, scale * 0.85, 48]} />
          <meshBasicMaterial color="#6366F1" transparent opacity={0.55} />
        </mesh>
      )}
    </group>
  );
};
