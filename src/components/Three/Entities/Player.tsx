import { Triplet, useBox, useRaycastAny } from "@react-three/cannon";
import { PerspectiveCamera } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { FC, useEffect, useImperativeHandle, useRef, useState } from "react";
import { Vector3, Quaternion, Mesh, DoubleSide, Group } from "three";
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
    mass: 1,
    broadphase: "Naive",
    allowSleep: false,
    sleepSpeedLimit: 1,

    // position: [0, CAR_BASE_HEIGHT + 1, 0],
    // linearDamping: 0,
    type: "Dynamic",
    // shouldInvalidate: true,
    args: [2.2, 1.5, 3.5], //rough size of the car model
    onCollideBegin(e) {
      console.log(e);
      if (e.body.userData.resetMomentum) {
        resetMomentum.current = true;
      }
    },
    onCollideEnd(e) {
      if (e.body.userData.resetMomentum) {
        resetMomentum.current = false;
      }
    },
    material: {
      friction: 0, // slide, no real wheel physics
      restitution: 10,
    },
    collisionFilterGroup: 1,
  }));
  const speedVector = useRef<Vector3>(new Vector3());
  const rotationalSpeedVector = useRef<Vector3>(new Vector3());
  const velocity = useRef<Triplet>([0, 0, 0]);
  const resetMomentum = useRef(false);
  useEffect(() => {
    const unsubscribe = api.velocity.subscribe((v) => (velocity.current = v));
    return unsubscribe;
  }, []);

  const position = useRef<Triplet>([0, 0, 0]);
  useEffect(() => {
    const unsubscribe = api.position.subscribe((v) => (position.current = v));
    return unsubscribe;
  }, []);

  useFrame((state, delta) => {
    if (ref.current) {
      const moveRight = keyStates.d;
      const moveLeft = keyStates.a;
      const strafeRight = keyStates.e;
      const strafeLeft = keyStates.q;
      const moveForward = keyStates.w;
      const moveBackward = keyStates.s;
      // //these mutate!
      const playerQuaternion = new Quaternion();
      ref.current.getWorldQuaternion(playerQuaternion);
      const playerWorldPosition = new Vector3();
      ref.current.getWorldPosition(playerWorldPosition);

      const CAR_MOMENTUM = 19;
      if (resetMomentum.current && !moveBackward && !moveForward) {
        speedVector.current.z = 0;
      }
      if (resetMomentum.current && !strafeLeft && !strafeRight) {
        speedVector.current.x = 0;
      }

      const diff = CAR_MOMENTUM * delta;
      if (moveForward && speedVector.current.z < CAR_SPEED) {
        speedVector.current.z += diff;
      }
      if (moveBackward && speedVector.current.z > -CAR_SPEED) {
        speedVector.current.z -= diff;
      }
      if (strafeLeft && speedVector.current.x < CAR_SPEED) {
        speedVector.current.x += diff;
      }
      if (strafeRight && speedVector.current.x > -CAR_SPEED) {
        speedVector.current.x -= diff;
      }
      if (!strafeLeft && !strafeRight && speedVector.current.x > 0) {
        if (speedVector.current.x - diff < 0) speedVector.current.x = 0;
        else speedVector.current.x -= diff;
      }
      if (!strafeLeft && !strafeRight && speedVector.current.x < 0) {
        if (speedVector.current.x + diff > 0) speedVector.current.x = 0;
        else speedVector.current.x += diff;
      }
      if (!moveForward && !moveBackward && speedVector.current.z > 0) {
        if (speedVector.current.z - diff < 0) speedVector.current.z = 0;
        else speedVector.current.z -= diff;
      }
      if (!moveForward && !moveBackward && speedVector.current.z < 0) {
        if (speedVector.current.z + diff > 0) speedVector.current.z = 0;
        else speedVector.current.z += diff;
      }
      speedVector.current.y = -10;

      const angularDiff = CAR_ROTATION_SPEED * 2 * delta;
      if (moveLeft && rotationalSpeedVector.current.y < CAR_ROTATION_SPEED) {
        rotationalSpeedVector.current.y += angularDiff;
      }
      if (moveRight && rotationalSpeedVector.current.y > -CAR_ROTATION_SPEED) {
        rotationalSpeedVector.current.y -= angularDiff;
      }
      if (!moveLeft && !moveRight && rotationalSpeedVector.current.y > 0) {
        if (rotationalSpeedVector.current.y - angularDiff < 0)
          rotationalSpeedVector.current.y = 0;
        else rotationalSpeedVector.current.y -= angularDiff;
      }
      if (!moveLeft && !moveRight && rotationalSpeedVector.current.y < 0) {
        if (rotationalSpeedVector.current.y + angularDiff > 0)
          rotationalSpeedVector.current.y = 0;
        else rotationalSpeedVector.current.y += angularDiff;
      }

      api.angularVelocity.set(...rotationalSpeedVector.current.toArray());

      const velocityToApply = new Vector3()
        .copy(speedVector.current)
        .applyQuaternion(playerQuaternion);
      api.velocity.set(...velocityToApply.toArray());
    }
  }, 0);
  return (
    <>
      <group ref={ref as React.Ref<Group>} castShadow>
        {/* <mesh>
          <boxBufferGeometry attach="geometry" args={[2, 2, 2]} />
          <meshStandardMaterial color="red" side={DoubleSide} roughness={0} />
        </mesh> */}
        <PerspectiveCamera
          // frames={1}
          makeDefault
          frustumCulled={false}
          args={[90, 1.2, 0.1, 700]}
          rotation={[-Math.PI / 12, Math.PI, 0]}
          position={[0, 2.4, -2]}
        />
        <Beetle />
        {wheelTypes.map((type) => (
          <Wheel key={type} type={type} keyStates={keyStates} />
        ))}
        {/* <PerspectiveCamera
          makeDefault
          args={[70, 1.2, 1, 1000]}
          position={[0, CAR_BASE_HEIGHT + DEFAULT_CAMERA_Y, DEFAULT_CAMERA_Z]}
          // lookAt={ref.current}
        /> */}
        <rectAreaLight
          intensity={1}
          color="lime"
          scale={0.1}
          height={8}
          width={2.5}
          position={[0, -0.3, 0]}
          rotation={[Math.PI * 1.5, 0, 0]}
        />
      </group>
    </>
  );
};

export default Player;
