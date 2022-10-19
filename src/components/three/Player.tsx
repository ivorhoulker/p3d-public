import { useBox } from "@react-three/cannon";
import { PerspectiveCamera } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { ReactNode, FC, useEffect, useState } from "react";
import { Vector3, Group, Mesh, Quaternion } from "three";
import Beetle from "../../pages/Beetle";
interface Props {
  className?: string;
  children?: ReactNode;
}
const Player: FC<Props> = ({ className, children }) => {
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

  const [ref, api] = useBox(() => ({
    mass: 10,
    position: [0, 1, 0],
    type: "Kinematic",
  }));

  useFrame((state, delta) => {
    const speed = 20;
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
        .multiply(new Vector3(speed, 0, speed));
      vel.applyQuaternion(quaternion);
      api.velocity.set(vel.x, vel.y, vel.z);
      //   state.camera.lookAt(ref.current.position);
      //   state.camera.updateProjectionMatrix();
      //   const offset = new Vector3(
      //     ,
      //     ref.current.position.y + 10,
      //     ref.current.position.z - 20
      //   );

      const worldPosition = ref.current.getWorldPosition(new Vector3(0, 0, 0));
      // .applyQuaternion(quaternion);
      const offset = new Vector3()
        .copy(worldPosition)

        .add(new Vector3(0, 10, -20).applyQuaternion(quaternion));
      // .applyAxisAngle(
      //   new Vector3(0, 1, 0),
      //   ref.current.position.angleTo(new Vector3())
      // ); //   const offset = ref.current.getWorldPosition(
      //     new Vector3(0, 20, -200).applyQuaternion(quaternion)
      //   );
      //   worldPosition.applyQuaternion(
      //     ref.current.getWorldQuaternion(ref.current.quaternion)
      //   );
      //tried to create delay position value for enable smooth transition for camera
      state.camera.position.lerp(offset, 0.1);

      //   state.camera.position.
      //updating lookat alway look at the car
      state.camera.lookAt(worldPosition);
      state.camera.updateProjectionMatrix();
    }
  });
  return (
    <>
      <PerspectiveCamera
        //   up={[0, 0, 1]}
        makeDefault
        position={[0, 10, -20]}
        // args={[45, 1.2, 1, 1000]}
      />
      <mesh ref={ref as React.Ref<Mesh>} castShadow>
        {/* <boxBufferGeometry attach="geometry" args={[2, 2, 2]} /> */}
        {/* <meshStandardMaterial color="red" />
          <meshPhysicalMaterial /> */}
        <Beetle />
      </mesh>
      {/* <group position={[0, 0, 0]}>
      

       
      </group> */}
    </>
  );
};

export default Player;
