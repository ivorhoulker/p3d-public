import { Triplet, useBox } from "@react-three/cannon";
import { PerspectiveCamera } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { FC, useEffect, useRef, useState } from "react";
import { Vector3, Quaternion, Mesh } from "three";
import Wheel, { wheelTypes } from "./Wheel";
import Beetle from "./Beetle";
import { KeyStateObject } from "../../../types/KeyStateObject";
import {
  CAR_BASE_HEIGHT,
  CAR_ROTATION_SPEED,
  CAR_SPEED,
  DEFAULT_CAMERA_X,
  DEFAULT_CAMERA_Y,
  DEFAULT_CAMERA_Z,
} from "../../../utils/carConfig";

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
    mass: 200,
    position: [0, CAR_BASE_HEIGHT, 0],
    type: "Dynamic",
    args: [2.2, 1.5, 3.5],
    material: {
      friction: 0,
    },
  }));
  const velocity = useRef<Triplet>([0, 0, 0]);
  useEffect(() => {
    api.velocity.subscribe((v) => (velocity.current = v));
  }, [api.velocity]);
  useFrame((state, delta) => {
    if (ref.current && velocity.current) {
      const moveRight = keyStates.d;
      const moveLeft = keyStates.a;
      const strafeRight = keyStates.e;
      const strafeLeft = keyStates.q;
      const moveForward = keyStates.w;
      const moveBackward = keyStates.s;

      const playerWorldPosition = ref.current.getWorldPosition(
        ref.current.position
      );
      // console.log(playerWorldPosition.y);
      if (playerWorldPosition.y <= -25) {
        api.position.set(0, CAR_BASE_HEIGHT, 0);
        state.camera.position.set(
          0,
          CAR_BASE_HEIGHT + DEFAULT_CAMERA_Y,
          DEFAULT_CAMERA_Z
        );
      }
      const playerQuaternion = ref.current.getWorldQuaternion(new Quaternion());

      const velocityToApply = new Vector3(
        strafeRight ? -delta : strafeLeft ? delta : 0,
        0,
        moveForward ? delta : moveBackward ? -delta : 0
      )
        .normalize()
        .multiplyScalar(CAR_SPEED);

      api.angularVelocity.set(
        0,
        moveRight
          ? -CAR_ROTATION_SPEED * delta
          : moveLeft
          ? CAR_ROTATION_SPEED * delta
          : 0,
        0
      );
      velocityToApply.applyQuaternion(playerQuaternion);

      //applying constant -10 velocity in y axis seems to keep the car grounded, need to test if it can be flipped though
      api.velocity.set(velocityToApply.x, -10, velocityToApply.z);

      // api.applyLocalForce([vel.x, vel.y, vel.z], [0, 0, 0]);
      const lookAtPosition = new Vector3()
        .copy(playerWorldPosition)
        .add(new Vector3(0, 0, 4).applyQuaternion(playerQuaternion));
      // .applyQuaternion(quaternion);
      const cameraPosition = new Vector3()
        .copy(playerWorldPosition)
        .add(
          new Vector3(
            DEFAULT_CAMERA_X,
            DEFAULT_CAMERA_Y,
            DEFAULT_CAMERA_Z
          ).applyQuaternion(playerQuaternion)
        );

      //keep the car grounded with force to the Y axis... this is probably not the right way to do it
      // api.applyLocalImpulse([0, -100, 0], [1, 0, 1]);
      // api.applyLocalImpulse([0, -100, 0], [-1, 0, -1]);

      state.camera.position.lerp(cameraPosition, 5 * delta);

      state.camera.lookAt(lookAtPosition);
      state.camera.updateProjectionMatrix();
    }
  });
  return (
    <>
      <PerspectiveCamera
        makeDefault
        args={[70, 1.2, 1, 1000]}
        position={[0, CAR_BASE_HEIGHT + DEFAULT_CAMERA_Y, DEFAULT_CAMERA_Z]}
      />
      <mesh ref={ref as React.Ref<Mesh>} castShadow>
        <Beetle />
        {wheelTypes.map((type) => (
          <Wheel key={type} type={type} keyStates={keyStates} />
        ))}
        <rectAreaLight
          intensity={1}
          color="lime"
          scale={0.1}
          height={4}
          width={2.5}
          position={[0, -0.3, 0]}
          rotation={[Math.PI * 1.5, 0, 0]}
        />
      </mesh>
    </>
  );
};

export default Player;
