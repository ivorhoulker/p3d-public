import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Debug, Physics, Triplet } from "@react-three/cannon";
import SkyBox from "../components/r3f/SkyBox";
import Player from "../components/r3f/Player";
import { Plane } from "../components/r3f/Plane";
import { Box } from "../components/r3f/Box";
import { Ball } from "../components/r3f/Ball";

const boxPositions: Array<Triplet> = [
  [-1, 5, 16],
  [-2, 5, -10],
  [-10, 5, 16],
  [8, 5, -10],
];

const ballPositions: Array<Triplet> = [
  [-5, 1, 11],
  [15, 5, 5],
];

export default function App() {
  return (
    <Canvas shadows>
      <color attach="background" args={["#94ebd8"]} />
      <fog attach="fog" args={["#94ebd8", 0, 60]} />
      <ambientLight intensity={0.1} color={"orange"} />
      <directionalLight intensity={0.1} castShadow />

      <SkyBox />
      <Physics gravity={[0, -9.8, 0]}>
        {/* <Debug scale={1.1} color="black"> */}
        <PhysicsWorld />
        {/* </Debug> */}
      </Physics>
    </Canvas>
  );
}

export function PhysicsWorld() {
  //   const targetRef = useRef<Group>(null);

  return (
    <Suspense fallback={null}>
      {boxPositions.map((position, idx) => (
        <Box position={position} key={idx} />
      ))}
      {ballPositions.map((position, idx) => (
        <Ball position={position} key={idx} />
      ))}
      <Plane />
      {/* <PerspectiveCamera
        //   up={[0, 0, 1]}
        makeDefault
        position={[0, 30, 0]}
        args={[45, 1.2, 1, 1000]}
      /> */}
      <Player />
      {/* <group ref={targetRef} position={[0, 0, 1]}>
        
      
      </group> */}
      {/* <Box position={[11, 0, 11]} /> */}
    </Suspense>
  );
}
