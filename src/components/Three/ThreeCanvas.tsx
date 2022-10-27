import { Canvas } from "@react-three/fiber";
import { Debug, Physics } from "@react-three/cannon";

import { PhysicsWorld } from "./PhysicsWorld";
import SkyBox from "./SkyBox";
import { DEBUG_OBJECTS } from "../../constants/DEBUG";

import { DEFAULT_CAMERA_Y, DEFAULT_CAMERA_Z } from "../../constants/CAMERA";
import { CAR_BASE_HEIGHT } from "../../constants/CAR";
import { PerspectiveCamera, Stats } from "@react-three/drei";

export default function ThreeCanvas() {
  return (
    <Canvas shadows>
      <fog args={["#a0c1eb", 0, 60]} />
      <ambientLight intensity={0.1} color={"#a0c1eb"} />
      <directionalLight intensity={0.2} color={"#ebe4a0"} castShadow />
      <SkyBox />
      <Physics
        broadphase="SAP"
        defaultContactMaterial={{
          contactEquationRelaxation: 4,
          friction: 1e-3,
        }}
      >
        {DEBUG_OBJECTS ? (
          <Debug scale={1.1} color="black">
            <PhysicsWorld />
          </Debug>
        ) : (
          <PhysicsWorld />
        )}
      </Physics>
    </Canvas>
  );
}
