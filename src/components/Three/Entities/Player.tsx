import { Triplet, useBox } from "@react-three/cannon";
import { PerspectiveCamera } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { FC, useEffect, useRef, useState } from "react";
import { Vector3, Quaternion, Mesh } from "three";
import Wheel, { wheelTypes } from "./Wheel";
import Beetle from "./Beetle";

import {
  CAR_BASE_HEIGHT,
  CAR_DOWNWARD_VELOCITY,
  CAR_ROTATION_SPEED,
  CAR_SPEED,
} from "../../../constants/CAR";
import {
  DEFAULT_CAMERA_Y,
  DEFAULT_CAMERA_Z,
  DEFAULT_CAMERA_X,
  CAMERA_LERP_SPEED,
  LOOK_IN_FRONT_BY_OFFSET,
} from "../../../constants/CAMERA";
import { lerp } from "three/src/math/MathUtils";
import { inRange } from "../../../helpers/inRange";
export type KeyStateObject = Record<string, boolean>;

const Player: FC = () => {
  const [keyStates, setKeyStates] = useState<KeyStateObject>({});

  useEffect(() => {
    const onKeydown = (event: KeyboardEvent) => {
      setKeyStates((s) => ({ ...s, [event.key]: true }));
    };
    const onKeyup = (event: KeyboardEvent) => {
      setKeyStates((s) => ({ ...s, [event.key]: false }));
    };
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
    args: [2.2, 1.5, 3.5], //rough size of the car model
    material: {
      friction: 0, // slide, no real wheel physics
    },
  }));
  const speedVector = useRef<Vector3>(new Vector3());

  useFrame((state, delta) => {
    if (ref.current) {
      const moveRight = keyStates.d;
      const moveLeft = keyStates.a;
      const strafeRight = keyStates.e;
      const strafeLeft = keyStates.q;
      const moveForward = keyStates.w;
      const moveBackward = keyStates.s;

      const isMoving = moveForward || moveBackward || strafeLeft || strafeRight;
      const N = 10;
      if (moveForward && speedVector.current.z < CAR_SPEED) {
        speedVector.current.z += N * delta;
      }
      if (moveBackward && speedVector.current.z > -CAR_SPEED) {
        speedVector.current.z -= N * delta;
      }
      if (strafeLeft && speedVector.current.x < CAR_SPEED) {
        speedVector.current.x += N * delta;
      }
      if (strafeRight && speedVector.current.x > -CAR_SPEED) {
        speedVector.current.x -= N * delta;
      }
      if (!strafeLeft && !strafeRight && speedVector.current.x > 0) {
        speedVector.current.x -= N * delta;
      }
      if (!strafeLeft && !strafeRight && speedVector.current.x < 0) {
        speedVector.current.x += N * delta;
      }
      if (!moveForward && !moveBackward && speedVector.current.z > 0) {
        speedVector.current.z -= N * delta;
      }
      if (!moveForward && !moveBackward && speedVector.current.z < 0) {
        speedVector.current.z += N * delta;
      }

      const R = 7 * delta;
      if (
        inRange(speedVector.current.x, -R, R) &&
        inRange(speedVector.current.z, -R, R)
      ) {
        speedVector.current.x = 0;
        speedVector.current.z = 0;
      }
      const playerWorldPosition = ref.current.getWorldPosition(
        ref.current.position
      );

      //reset player position if they fall off the world
      if (playerWorldPosition.y <= -25) {
        api.position.set(0, CAR_BASE_HEIGHT, 0);
        state.camera.position.set(
          0,
          CAR_BASE_HEIGHT + DEFAULT_CAMERA_Y,
          DEFAULT_CAMERA_Z
        );
      }

      // const velocityToApply = new Vector3(
      //   strafeRight ? -delta : strafeLeft ? delta : 0,
      //   0,
      //   moveForward ? delta : moveBackward ? -delta : 0
      // )
      //   .normalize()
      //   .multiplyVectors()
      //   .applyQuaternion(playerQuaternion);

      api.angularVelocity.set(
        0,
        moveRight
          ? -CAR_ROTATION_SPEED * delta
          : moveLeft
          ? CAR_ROTATION_SPEED * delta
          : 0,
        0
      );
      const playerQuaternion = ref.current.getWorldQuaternion(new Quaternion());
      const velocityToApply =
        speedVector.current.applyQuaternion(playerQuaternion);

      //applying constant -10 velocity in y axis seems to keep the car grounded, need to test if it can be flipped though
      api.velocity.set(
        velocityToApply.x,
        -Math.abs(CAR_DOWNWARD_VELOCITY),
        velocityToApply.z
      );

      //lerp the camera to player position with offset behind and above
      const cameraPosition = new Vector3()
        .copy(playerWorldPosition)
        .add(
          new Vector3(
            DEFAULT_CAMERA_X,
            DEFAULT_CAMERA_Y,
            DEFAULT_CAMERA_Z
          ).applyQuaternion(playerQuaternion)
        );
      state.camera.position.lerp(cameraPosition, CAMERA_LERP_SPEED * delta);

      //get a position in front of the car for the camera to look at
      const lookAtPosition = new Vector3()
        .copy(playerWorldPosition)
        .add(
          new Vector3(0, 0, LOOK_IN_FRONT_BY_OFFSET).applyQuaternion(
            playerQuaternion
          )
        );

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
