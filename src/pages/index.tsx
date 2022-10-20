import Button from "../components/UI/Button";

export default function Index() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-5 bg-gray-900">
      <nav className="flex flex-row items-center justify-center gap-5">
        <Button href="game">Test Game</Button>
        <Button href="login">Sign in</Button>
      </nav>
    </div>
  );
}
