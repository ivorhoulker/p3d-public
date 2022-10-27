import { Suspense } from "react";
import { Ball } from "./Entities/Ball";
import { Ground } from "./Entities/Ground";
import Player from "./Entities/Player";
import { Cube } from "./Entities/Cube";
import { BALL_POSITIONS, BOX_POSITIONS } from "../../constants/WORLD_OBJECTS";

export function PhysicsWorld() {
  return (
    <Suspense fallback={null}>
      <Ground />
      {BOX_POSITIONS.map((position, idx) => (
        <Cube position={position} key={idx} />
      ))}
      {BALL_POSITIONS.map((position, idx) => (
        <Ball position={position} key={idx} />
      ))}

      <Player />
    </Suspense>
  );
}
