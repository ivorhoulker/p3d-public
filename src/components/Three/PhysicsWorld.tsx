import { Suspense } from "react";
import { Ball } from "./Entities/Ball";
import { Ground } from "./Entities/Ground";
import Player from "./Entities/Player";

import {
  BALL_POSITIONS,
  PILLAR_POSITIONS,
} from "../../constants/WORLD_OBJECTS";
import { Pillar } from "./Entities/Pillar";

export function PhysicsWorld() {
  return (
    <Suspense fallback={null}>
      <Ground />
      {PILLAR_POSITIONS.map((position, idx) => (
        <Pillar position={position} key={idx} />
      ))}
      {BALL_POSITIONS.map((position, idx) => (
        <Ball position={position} key={idx} />
      ))}

      <Player />
    </Suspense>
  );
}
