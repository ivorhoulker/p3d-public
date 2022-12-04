import { FC, Ref, useEffect, useRef, useState } from "react";
import { Group, Object3D, Quaternion, SpotLight, Vector3 } from "three";
import { Triplet, useBox } from "@react-three/cannon";
import Wheel, { wheelTypes } from "./Wheel";

import Beetle from "./Beetle";
import { PerspectiveCamera } from "@react-three/drei";
import { Quartet } from "../../../helpers/Quartet";
import { useFrame } from "@react-three/fiber";

export type KeyStateObject = Record<string, boolean>;

const CAR_MOMENTUM = 19;
const CAR_BASE_HEIGHT = 1;
const CAR_SPEED = 10;
const CAR_ROTATION_SPEED = 2;
const CAR_MODEL_SIZE: Triplet = [2.2, 1.5, 3.5];
const CAR_CAMERA_RELATIVE_POSITION: Triplet = [0, 2.4, -2];

const Player: FC = () => {
  const keyStates = useRef<KeyStateObject>({});
  const previousPosition = useRef<Triplet>([0, 0, 0]);
  const previousRotation = useRef<Quartet>([0, 0, 0, 0]);

  const [color, setColor] = useState("#D9F99D")
 

  useEffect(() => {
    const onKeydown = (event: KeyboardEvent) => {
      keyStates.current[event.key] = true;
      if (event.key === " ") {
        setColor(v => {
          if (v === "#D9F99D") return "#FDE047"
          if (v === "#FDE047") return "#67E8F9"
          return "#D9F99D"
        })
      }
    };
    const onKeyup = (event: KeyboardEvent) => {
      keyStates.current[event.key] = false;
    };
    document.addEventListener("keydown", onKeydown);
    document.addEventListener("keyup", onKeyup);
    return () => {
      document.removeEventListener("keydown", onKeydown);
      document.removeEventListener("keyup", onKeyup);
    };
  }, []);

  const [ref, api] = useBox(() => ({
    mass: 100,
    allowSleep: false,
    position: [10, CAR_BASE_HEIGHT + 1, 3],
    linearDamping: 0,
    type: "Dynamic",
    args: CAR_MODEL_SIZE, //rough size of the car model
    onCollideBegin(e) {
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
      restitution: 0,
    },
    collisionFilterGroup: 1,
  }));

  const position = useRef<Triplet>([0, 0, 0]);
  const rotation = useRef<Quartet>([0, 0, 0, 0]);
  const speedVector = useRef<Vector3>(new Vector3());
  const rotationalSpeedVector = useRef<Vector3>(new Vector3());
  const velocity = useRef<Triplet>([0, 0, 0]);
  const resetMomentum = useRef(false);



  useEffect(() => {
    const unsubscribe = api.velocity.subscribe((v) => (velocity.current = v));
    return unsubscribe;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useFrame((_state, delta) => {
    if (ref.current) {
      const moveRight = keyStates.current.d;
      const moveLeft = keyStates.current.a;
      const strafeRight = keyStates.current.e;
      const strafeLeft = keyStates.current.q;
      const moveForward = keyStates.current.w;
      const moveBackward = keyStates.current.s;
      // careful, these 'gets' mutate!
      const playerQuaternion = new Quaternion();
      ref.current.getWorldQuaternion(playerQuaternion);

      const dir = new Vector3();
      ref.current.getWorldDirection(dir);

      const playerWorldPosition = new Vector3();
      ref.current.getWorldPosition(playerWorldPosition);

      rotation.current = playerQuaternion.toArray() as Quartet;
      position.current = playerWorldPosition.toArray() as Triplet;


      //reset if fall of world
      if (position.current[1] <= -25) {
        api.position.set(0, CAR_BASE_HEIGHT + 1, 0);
        api.velocity.set(0, 0, 0);
        api.angularVelocity.set(0, 0, 0);
      }

      if (resetMomentum.current && !moveBackward && !moveForward) {
        speedVector.current.z = 0;
      }
      if (resetMomentum.current && !strafeLeft && !strafeRight) {
        speedVector.current.x = 0;
      }

      const diff = CAR_MOMENTUM * delta;
      if (moveForward && !moveBackward && speedVector.current.z < CAR_SPEED) {
        speedVector.current.z += diff;
      }
      if (moveBackward && !moveForward && speedVector.current.z > -CAR_SPEED) {
        speedVector.current.z -= diff;
      }
      if (strafeLeft && !strafeRight && speedVector.current.x < CAR_SPEED) {
        speedVector.current.x += diff;
      }
      if (strafeRight && !strafeLeft && speedVector.current.x > -CAR_SPEED) {
        speedVector.current.x -= diff;
      }
      if (
        ((!strafeLeft && !strafeRight) || (strafeLeft && strafeRight)) &&
        speedVector.current.x > 0
      ) {
        if (speedVector.current.x - diff < 0) speedVector.current.x = 0;
        else speedVector.current.x -= diff;
      }
      if (
        ((!strafeLeft && !strafeRight) || (strafeLeft && strafeRight)) &&
        speedVector.current.x < 0
      ) {
        if (speedVector.current.x + diff > 0) speedVector.current.x = 0;
        else speedVector.current.x += diff;
      }
      if (
        ((!moveForward && !moveBackward) || (moveForward && moveBackward)) &&
        speedVector.current.z > 0
      ) {
        if (speedVector.current.z - diff < 0) speedVector.current.z = 0;
        else speedVector.current.z -= diff;
      }
      if (
        ((!moveForward && !moveBackward) || (moveForward && moveBackward)) &&
        speedVector.current.z < 0
      ) {
        if (speedVector.current.z + diff > 0) speedVector.current.z = 0;
        else speedVector.current.z += diff;
      }
      speedVector.current.y = -10;

      const angularDiff = CAR_ROTATION_SPEED * 2 * delta;
      if (
        moveLeft &&
        !moveRight &&
        rotationalSpeedVector.current.y < CAR_ROTATION_SPEED
      ) {
        rotationalSpeedVector.current.y += angularDiff;
      }
      if (
        moveRight &&
        !moveLeft &&
        rotationalSpeedVector.current.y > -CAR_ROTATION_SPEED
      ) {
        rotationalSpeedVector.current.y -= angularDiff;
      }
      if (
        ((!moveLeft && !moveRight) || (moveLeft && moveRight)) &&
        rotationalSpeedVector.current.y > 0
      ) {
        if (rotationalSpeedVector.current.y - angularDiff < 0)
          rotationalSpeedVector.current.y = 0;
        else rotationalSpeedVector.current.y -= angularDiff;
      }
      if (
        ((!moveLeft && !moveRight) || (moveLeft && moveRight)) &&
        rotationalSpeedVector.current.y < 0
      ) {
        if (rotationalSpeedVector.current.y + angularDiff > 0)
          rotationalSpeedVector.current.y = 0;
        else rotationalSpeedVector.current.y += angularDiff;
      }

      api.angularVelocity.set(...rotationalSpeedVector.current.toArray());
      // console.log(rotation.current);

      const velocityToApply = new Vector3()
        .copy(speedVector.current)
        .applyQuaternion(playerQuaternion);
      api.velocity.set(...velocityToApply.toArray());

      // const lookAtPosition = new Vector3()
      // .copy(playerWorldPosition)
      // .add(new Vector3(0, 0, 100).applyQuaternion(playerQuaternion));
      // const cameraPosition = new Vector3()
      //   .copy(playerWorldPosition)
      //   .add(
      //     new Vector3(
      //       DEFAULT_CAMERA_X,
      //       DEFAULT_CAMERA_Y,
      //       DEFAULT_CAMERA_Z
      //     ).applyQuaternion(playerQuaternion)
      //   );

      // //keep the car grounded with force to the Y axis... this is probably not the right way to do it
      // api.applyLocalImpulse([0, -100, 0], [1, 0, 1]);
      // api.applyLocalImpulse([0, -100, 0], [-1, 0, -1]);

      // state.camera.position.lerp(cameraPosition, 5 * delta);

      // state.camera.lookAt(lookAtPosition);
      // state.camera.updateProjectionMatrix();
    }
  });

  const spotlightRef = useRef<SpotLight>(null);
  const spotlightTargetRef = useRef<Object3D<Event>>();
  return (
    <>
      <group ref={ref as React.Ref<Group>} castShadow>
        <Beetle />
        {wheelTypes.map((type) => (
          <Wheel key={type} type={type} keyStates={keyStates.current} />
        ))}
        <PerspectiveCamera
          // frames={1}
          makeDefault
          frustumCulled={false}
          args={[90, 1.2, 0.1, 700]}
          rotation={[-Math.PI / 12, Math.PI, 0]}
          position={CAR_CAMERA_RELATIVE_POSITION}
        />
        <object3D
          name="car spotlight target"
          ref={spotlightTargetRef as Ref<Object3D<Event>>}
          position={[0, -2, 10]}
        >
          {/* <boxBufferGeometry attach="geometry" args={[1, 1, 1]} />
          <meshStandardMaterial color="red" /> */}
        </object3D>
        <spotLight
          ref={spotlightRef as React.Ref<SpotLight>}
          intensity={1}
          angle={0.5}
          color={color}
          penumbra={1}
          target={spotlightTargetRef.current}
        />
        <rectAreaLight
          intensity={1}
          color={color}
          scale={0.1}
          height={8}
          width={4}
          position={[0, -0.3, 0]}
          rotation={[Math.PI * 1.5, 0, 0]}
        />
      </group>
    </>
  );
};

export default Player;
