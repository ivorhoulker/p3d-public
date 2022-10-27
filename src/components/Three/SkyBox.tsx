import { Environment } from "@react-three/drei";

export default function SkyBox() {
  return (
    <Environment
      background={true}
      files={[
        "right.png",
        "left.png",
        "top.png",
        "bot.png",
        "front.png",
        "back.png",
      ]}
      path="/skybox/"
    />
  );
}
