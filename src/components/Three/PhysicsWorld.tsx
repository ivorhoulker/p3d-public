import React, { Suspense } from "react";
import Player from "./Player";
import { Plane } from "./Plane";
import { Box } from "./Box";
import { Ball } from "./Ball";
import { Triplet } from "@react-three/cannon";
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
      <Plane />
      {boxPositions.map((position, idx) => (
        <Box position={position} key={idx} />
      ))}
      {ballPositions.map((position, idx) => (
        <Ball position={position} key={idx} />
      ))}

      <Player />
    </Suspense>
  );
}
