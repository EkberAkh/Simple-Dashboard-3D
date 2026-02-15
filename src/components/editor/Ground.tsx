import React, { useCallback, useRef } from "react";
import * as THREE from "three";
import type { ThreeEvent } from "@react-three/fiber";
import { useEditorStore } from "@/store/editorStore";

interface GroundProps {
  size?: number;
}

export const Ground: React.FC<GroundProps> = ({ size = 30 }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const setPendingPlacement = useEditorStore((s) => s.setPendingPlacement);
  const selectObject = useEditorStore((s) => s.selectObject);

  const handleDoubleClick = useCallback(
    (e: ThreeEvent<MouseEvent>) => {
      e.stopPropagation();
      const { x, z } = e.point;
      setPendingPlacement([Math.round(x * 2) / 2, 0, Math.round(z * 2) / 2]);
    },
    [setPendingPlacement],
  );

  const handleClick = useCallback(
    (e: ThreeEvent<MouseEvent>) => {
      e.stopPropagation();
      selectObject(null);
    },
    [selectObject],
  );

  return (
    <mesh
      ref={meshRef}
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, -0.01, 0]}
      receiveShadow
      onDoubleClick={handleDoubleClick}
      onClick={handleClick}
    >
      <planeGeometry args={[size, size]} />
      <meshStandardMaterial color="#1E293B" roughness={0.9} metalness={0.1} />
    </mesh>
  );
};
