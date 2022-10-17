import { Physics } from "@react-three/cannon";
import { Effects, PerspectiveCamera, Plane, Stars } from "@react-three/drei";
import React, { Suspense, useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "react-three-fiber";
import { Group } from "three";
import Camera from "../components/three/Camera";
import FPSControls from "../components/three/FPSControls";
import GroundPlane from "../components/three/GroundPlane";
import Skydome from "../components/three/Skydome";
import { FOG_COLOR, GROUND_COLOR } from "../utils/theme";

export default function App() {
  const contactMaterial = {
    contactEquationStiffness: 1e4,
    friction: 0.001,
  };

  return (
    <Canvas className="absolute top-0 left-0 min-h-full min-w-full">
      {/* <Camera
        position={[0, 0, 15]}
        near={0.1}
        far={100000}
        rotation={[0, 0, 0, "YZX"]}
        up={[0, 0, 1]}
      /> */}
      {/* <mesh>
        <boxGeometry />
        <meshStandardMaterial />
      </mesh> */}
      {/* <Effects /> */}
      {/* <fog attach="fog" args={[FOG_COLOR, 1, 40]} /> */}
      <ambientLight intensity={0.25} />
      <directionalLight
        intensity={0.5}
        position={[2000, 2000, 1000]}
        castShadow
        // shadow-mapSize-height={4096}
        // shadow-mapSize-width={4096}
      />

      <Skydome />
      {/* <Stars
        radius={100} // Radius of the inner sphere (default=100)
        depth={50} // Depth of area where stars should fit (default=50)
        count={5000} // Amount of stars (default=5000)
        factor={4} // Size factor (default=4)
        saturation={0} // Saturation 0-1 (default=0)
        fade // Faded dots (default=false)
      /> */}
      <Physics gravity={[0, 0, -25]} defaultContactMaterial={contactMaterial}>
        <PhysicsWorld />
      </Physics>
    </Canvas>
  );
}

export function PhysicsWorld() {
  const targetRef = useRef<Group>(null);
  const [keyStates, setKeyStates] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const onKeydown = (event: KeyboardEvent) => {
      setKeyStates((s) => ({ ...s, [event.key]: true }));
      //   keyStates[event.code] = true;
    };
    const onKeyup = (event: KeyboardEvent) => {
      setKeyStates((s) => ({ ...s, [event.key]: false }));
    };
    //document.addEventListener("mousemove", onMousemove);
    document.addEventListener("keydown", onKeydown);
    document.addEventListener("keyup", onKeyup);
    return () => {
      document.removeEventListener("keydown", onKeydown);
      document.removeEventListener("keyup", onKeyup);
    };
  });

  useFrame((state, delta) => {
    const speed = 15;
    const rotationSpeed = 1;
    if (targetRef.current) {
      const moveRight = keyStates.d;
      const moveLeft = keyStates.a;
      const moveForward = keyStates.w;
      const moveBackward = keyStates.s;
      targetRef.current.rotateZ(
        moveRight
          ? -rotationSpeed * delta
          : moveLeft
          ? rotationSpeed * delta
          : 0
      );
      const rotation = targetRef.current.matrix.extractRotation;
      targetRef.current.matrix.targetRef.current.position.y += moveForward
        ? -speed * delta
        : moveBackward
        ? speed * delta
        : 0;
      state.camera.lookAt(targetRef.current.position);
      state.camera.updateProjectionMatrix();
    }
  });

  return (
    <Suspense fallback={null}>
      <mesh castShadow receiveShadow position={[5, 5, 1]}>
        <boxBufferGeometry args={[2, 2, 2]} />
        <meshStandardMaterial color={"pink"} />
      </mesh>
      <group ref={targetRef} position={[0, 0, 1]}>
        <PerspectiveCamera
          up={[0, 0, 1]}
          makeDefault
          position={[0, 15, 5]}
          args={[45, 1.2, 1, 1000]}
        />
        <mesh castShadow receiveShadow position={[0, 2, 0]}>
          <boxBufferGeometry args={[2, 2, 2]} />
          <meshStandardMaterial color={"#ff0000"} />
        </mesh>
      </group>
      {/* <GroundPlane /> */}
      <Plane position={[0, 0, 0]} args={[1000, 1000, 1, 1]} receiveShadow>
        <meshPhongMaterial attach="material" color={"gray"} />
      </Plane>
      {/* <FPSControls
        position={spawn}
        rotation={[Math.PI / 2, 0, -Math.PI / 2]}
        setPaused={setPaused}
      /> */}
      {/* <GameDirector /> */}
    </Suspense>
  );
}
