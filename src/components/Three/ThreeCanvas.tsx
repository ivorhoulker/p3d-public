import { Canvas } from "@react-three/fiber";
import { Debug, Physics } from "@react-three/cannon";

import { PhysicsWorld } from "./PhysicsWorld";
import SkyBox from "./SkyBox";
import { DEBUG_OBJECTS } from "../../constants/DEBUG";

export default function ThreeCanvas() {
  return (
    <Canvas shadows>
      <fog args={["#a0c1eb", 0, 60]} />
      <ambientLight intensity={0.1} color={"#a0c1eb"} />
      <directionalLight intensity={0.2} color={"#ebe4a0"} castShadow />
      <SkyBox />
      <Physics gravity={[0, -9.8, 0]}>
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
