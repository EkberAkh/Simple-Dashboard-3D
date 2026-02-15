import React from "react";
import { Grid, OrbitControls, Environment } from "@react-three/drei";
import { Ground } from "./Ground";
import { SceneObjectMesh } from "./SceneObjectMesh";
import type { SceneObject } from "@/api";

interface SceneProps {
  objects: SceneObject[];
}

export const Scene: React.FC<SceneProps> = ({ objects }) => {
  return (
    <>
      <OrbitControls
        makeDefault
        enablePan
        enableZoom
        enableRotate
        maxPolarAngle={Math.PI / 2.1}
        minDistance={3}
        maxDistance={40}
        target={[0, 0, 0]}
      />

      <ambientLight intensity={0.4} />
      <directionalLight
        position={[10, 15, 10]}
        intensity={1}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={50}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
      />
      <directionalLight position={[-5, 8, -5]} intensity={0.3} />

      <Environment preset="city" />

      <Ground />

      <Grid
        args={[30, 30]}
        position={[0, 0.005, 0]}
        cellSize={1}
        cellThickness={0.5}
        cellColor="#334155"
        sectionSize={5}
        sectionThickness={1}
        sectionColor="#475569"
        fadeDistance={25}
        fadeStrength={1}
        followCamera={false}
        infiniteGrid={false}
      />

      {objects.map((obj) => (
        <SceneObjectMesh key={obj.id} object={obj} />
      ))}
    </>
  );
};
