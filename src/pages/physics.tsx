import React, { Suspense, useEffect, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  Physics,
  Triplet,
  useBox,
  usePlane,
  useSphere,
} from "@react-three/cannon";
import { BufferGeometry, DoubleSide, Group, Mesh, Vector3 } from "three";
import { PerspectiveCamera } from "@react-three/drei";
import Skydome from "../components/three/Skydome";
import Player from "../components/three/Player";

const positions: Array<Triplet> = [
  [0, 2, 3],
  [-1, 5, 16],
  [-2, 5, -10],
  [0, 12, 3],
  [-10, 5, 16],
  [8, 5, -10],
];

function Marble() {
  const [ref] = useSphere(() => ({
    mass: 10,
    position: [2, 5, 0],
  }));

  return (
    <mesh ref={ref as React.Ref<Mesh<BufferGeometry>>} castShadow>
      <sphereBufferGeometry
        attach="geometry"
        args={[1, 32, 32]}
      ></sphereBufferGeometry>
      <meshStandardMaterial color="white" />
    </mesh>
  );
}

function Box({ position }: { position: Triplet }) {
  const [ref] = useBox(() => ({
    mass: 10,
    position: position,
    type: "Dynamic",
    args: [2, 2, 2],
  }));

  return (
    <mesh ref={ref as React.Ref<Mesh<BufferGeometry>>} castShadow>
      <boxBufferGeometry attach="geometry" args={[2, 2, 2]} />
      <meshStandardMaterial color="white" />
    </mesh>
  );
}

const Plane = () => {
  const [ref, api] = usePlane(() => ({
    mass: 1,
    position: [0, 0, 0],
    type: "Static",
    rotation: [-Math.PI / 2, 0, 0],
  }));
  //   useFrame(({ mouse }) => {
  //     api.rotation.set(-Math.PI / 2 - mouse.y * 0.2, 0 + mouse.x * 0.2, 0);
  //   });

  return (
    <mesh
      scale={200}
      ref={ref as React.Ref<Mesh<BufferGeometry>>}
      receiveShadow
    >
      <planeBufferGeometry />
      <meshStandardMaterial color="white" side={DoubleSide} roughness={100} />
    </mesh>
  );
};

export default function App() {
  return (
    <Canvas shadows>
      <color attach="background" args={["#94ebd8"]} />
      <fog attach="fog" args={["#94ebd8", 0, 60]} />
      <ambientLight intensity={0.1} color={"orange"} />
      <directionalLight intensity={0.1} castShadow />
      {/* <pointLight
        castShadow
        intensity={1}
        color="white"
        // args={[0xff0000, 1, 100]}
        position={[-1, 3, 1]}
      /> */}
      <spotLight
        castShadow
        intensity={1}
        color="yellow"
        // args={["blue", 1, 100]}
        position={[-1, 4, -1]}
        penumbra={1}
      />
      <Skydome />
      <Physics
      // gravity={[0, -1000, 0]}
      // frictionGravity={[100, 100, 100]}
      // defaultContactMaterial={{
      //   friction: 100,
      //   restitution: 100,
      //   contactEquationStiffness: 6000,
      //   contactEquationRelaxation: 0.000001,
      // }}
      >
        {/* <Marble /> */}

        <PhysicsWorld />
      </Physics>
    </Canvas>
  );
}

export function PhysicsWorld() {
  //   const targetRef = useRef<Group>(null);

  return (
    <Suspense fallback={null}>
      {positions.map((position, idx) => (
        <Box position={position} key={idx} />
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
