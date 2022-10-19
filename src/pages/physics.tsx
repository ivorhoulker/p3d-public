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

  //   useFrame((state, delta) => {
  //     const speed = 15;
  //     const rotationSpeed = 1;

  //     if (targetRef.current) {
  //       const moveRight = keyStates.d;
  //       const moveLeft = keyStates.a;
  //       const strafeRight = keyStates.e;
  //       const strafeLeft = keyStates.q;
  //       const moveForward = keyStates.w;
  //       const moveBackward = keyStates.s;

  //       targetRef.current.rotateZ(
  //         moveRight
  //           ? -rotationSpeed * delta
  //           : moveLeft
  //           ? rotationSpeed * delta
  //           : 0
  //       );
  //       targetRef.current.translateX(
  //         strafeRight ? -speed * delta : strafeLeft ? speed * delta : 0
  //       );
  //       targetRef.current.translateY(
  //         moveForward ? -speed * delta : moveBackward ? speed * delta : 0
  //       );
  //       state.camera.lookAt(targetRef.current.position);
  //       state.camera.updateProjectionMatrix();
  //     }
  //   });

  const [ref, api] = useBox(() => ({
    mass: 10,
    position: [0, 1, 0],
    // args: [2, 2, 2],
    // isKinematic: true,
    type: "Kinematic",
    // material: {
    //   friction: 100,
    //   restitution: 100,
    // },
  }));

  useFrame((state, delta) => {
    const speed = 5;
    const rotationSpeed = 500;

    if (ref.current) {
      const moveRight = keyStates.d;
      const moveLeft = keyStates.a;
      const strafeRight = keyStates.e;
      const strafeLeft = keyStates.q;
      const moveForward = keyStates.w;
      const moveBackward = keyStates.s;

      if (moveRight || moveLeft) {
        const direction = ref.current?.getWorldDirection(new Vector3(0, 0, 1));
        console.log(direction);
      }
      //   api.position.set(
      //     ref.current.position.x,
      //     ref.current.position.y,
      //     moveForward
      //       ? ref.current.position.z - speed * delta
      //       : moveBackward
      //       ? ref.current.position.z + speed * delta
      //       : 0
      //   );
      // ref.current.translateZ(
      //   moveForward ? -speed * delta : moveBackward ? speed * delta : 0
      // );
      // api.rotation.set(
      //   0,
      //   moveRight
      //     ? ref.current.rotation.y - rotationSpeed * delta
      //     : moveLeft
      //     ? ref.current.rotation.y + rotationSpeed * delta
      //     : 0,
      //   0
      // );
      // const t = state.clock.getElapsedTime();
      // api.position.set(0, 3, Math.cos(t * 2) * 5);
      // api.rotation.set(Math.cos(t * 6), 0, 1);
      // api.applyLocalForce([10, 1, 1], [1, 1, 1]);

      api.angularVelocity.set(
        0,
        moveRight
          ? -rotationSpeed * delta
          : moveLeft
          ? rotationSpeed * delta
          : 0,
        0
      );
      const vel = new Vector3(
        strafeRight ? delta : strafeLeft ? -delta : 0,
        0,
        moveForward ? -delta : moveBackward ? delta : 0
      )
        .normalize()
        .multiply(new Vector3(speed, 0, speed));
      vel.applyQuaternion(
        ref.current.getWorldQuaternion(ref.current.quaternion)
      );

      // const targetVector = moveForward
      //   ? new Vector3(0, 0, 1)
      //   : new Vector3(0, 0, 0);
      // targetVector.applyQuaternion(
      //   ref.current.getWorldQuaternion(ref.current.quaternion)
      // );
      // if (moveForward) console.log(ref.current.rotation);
      // var axis = new Vector3( 0, 1, 0 );
      // var angle = Math.PI / 2;
      // vel.applyQuaternion(ref.current.quaternion);
      // console.log(ref.current.rotation);
      // vel
      //   .applyQuaternion(ref.current.getWorldQuaternion(ref.current.quaternion))
      //   .normalize();

      api.velocity.set(vel.x, vel.y, vel.z);
      state.camera.lookAt(ref.current.position);
      state.camera.updateProjectionMatrix();
      // api.rotation.set(-Math.PI / 2 - 0 * 0.2, 0, ref.current.z + 1 * 0.5);
      // if (moveForward || moveBackward)
      //   api.applyLocalForce(
      //     [
      //       moveForward ? -speed * delta : moveBackward ? speed * delta : 0,
      //       0,
      //       0,
      //     ],
      //     [0, 0, 0]
      //   );
      // state.camera.lookAt(ref.current.position);
      // state.camera.updateProjectionMatrix();
    }
  });

  return (
    <Suspense fallback={null}>
      {positions.map((position, idx) => (
        <Box position={position} key={idx} />
      ))}
      <Plane />
      <PerspectiveCamera
        //   up={[0, 0, 1]}
        makeDefault
        position={[0, 30, 0]}
        args={[45, 1.2, 1, 1000]}
      />
      <mesh
        ref={ref as React.Ref<Mesh<BufferGeometry>>}
        position={[0, 0, 0]}
        castShadow
      >
        <boxBufferGeometry attach="geometry" args={[2, 2, 2]} />
        <meshStandardMaterial color="red" />
        <meshPhysicalMaterial />
      </mesh>

      {/* <group ref={targetRef} position={[0, 0, 1]}>
        
        
      </group> */}
      {/* <Box position={[11, 0, 11]} /> */}
    </Suspense>
  );
}
