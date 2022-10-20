import { useBox } from "@react-three/cannon";
import { PerspectiveCamera } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { FC, useEffect, useState } from "react";
import { Vector3, Group } from "three";
import Wheel from "./Wheel";
import Beetle from "./Beetle";
import { KeyStateObject } from "../../types/KeyStateObject";

const Player: FC = () => {
  const [keyStates, setKeyStates] = useState<KeyStateObject>({});

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

  const [ref, api] = useBox(() => ({
    mass: 100,
    position: [0, 1, 0],
    type: "Kinematic",
    args: [2.2, 1.5, 3.5],
  }));

  useFrame((state, delta) => {
    const speed = 15;
    const rotationSpeed = 300;

    if (ref.current) {
      const moveRight = keyStates.d;
      const moveLeft = keyStates.a;
      const strafeRight = keyStates.e;
      const strafeLeft = keyStates.q;
      const moveForward = keyStates.w;
      const moveBackward = keyStates.s;

      const quaternion = ref.current.getWorldQuaternion(ref.current.quaternion);
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
        strafeRight ? -delta : strafeLeft ? delta : 0,
        0,
        moveForward ? delta : moveBackward ? -delta : 0
      )
        .normalize()
        .multiplyScalar(speed);
      vel.applyQuaternion(quaternion);
      api.velocity.set(vel.x, vel.y, vel.z);

      const worldPosition = ref.current.getWorldPosition(new Vector3());
      const lookAtPosition = new Vector3()
        .copy(worldPosition)
        .add(new Vector3(0, 0, 4).applyQuaternion(quaternion));
      // .applyQuaternion(quaternion);
      const cameraPosition = new Vector3()
        .copy(worldPosition)
        .add(new Vector3(0, 10, -3).applyQuaternion(quaternion));

      state.camera.position.lerp(cameraPosition, 5 * delta);

      state.camera.lookAt(lookAtPosition);
      state.camera.updateProjectionMatrix();
    }
  });
  return (
    <>
      <PerspectiveCamera makeDefault args={[70, 1.2, 1, 1000]} />
      <group ref={ref as React.Ref<Group>} castShadow>
        <Beetle />
        <Wheel type={"frontLeft"} keyStates={keyStates} />
        <Wheel type={"frontRight"} keyStates={keyStates} />
        <Wheel type={"backLeft"} keyStates={keyStates} />
        <Wheel type={"backRight"} keyStates={keyStates} />
        <rectAreaLight
          intensity={1}
          color="lime"
          scale={0.1}
          height={4}
          width={2.5}
          position={[0, -0.5, 0]}
          rotation={[Math.PI * 1.5, 0, 0]}
        />
      </group>
    </>
  );
};

export default Player;
