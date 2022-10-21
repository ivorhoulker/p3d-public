import React, { Suspense } from "react";

import { Ball } from "./Entities/Ball";
import { Triplet, useBox } from "@react-three/cannon";

import { Ground } from "./Entities/Ground";
import Player from "./Entities/Player";
import { Mesh } from "three";
import { Cube } from "./Entities/Cube";
export const boxPositions: Array<Triplet> = [
  [-1, 1, 16],
  [-2, 1, -10],
  [-10, 1, 16],
  [8, 1, -10],
];

export const ballPositions: Array<Triplet> = [
  [-5, 1, 11],
  [15, 5, 5],
  [3, 5, 3],
  [-3, 5, -5],
];

export function PhysicsWorld() {
  return (
    <Suspense fallback={null}>
      <Ground />
      {boxPositions.map((position, idx) => (
        <Cube position={position} key={idx} />
      ))}
      {ballPositions.map((position, idx) => (
        <Ball position={position} key={idx} />
      ))}

      <Player />
    </Suspense>
  );
}
