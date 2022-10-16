import { ReactNode, FC } from "react";
import { usePocketList } from "../hooks/usePocket";
interface Props {
  className?: string;
  children?: ReactNode;
}
const Chat: FC<Props> = ({ className, children }) => {
  const { data } = usePocketList("roomChats", "chat", {
    expand: "profile",
    filter: `room="kikbshab5qteg8k"`,
  });
  return (
    <div className={className}>
      {data?.reverse().map((x) => (
        <div key={x.id}>
          {new Date(x.created).toISOString()}{" "}
          {x["@expand"].profile?.name || x.userName}: {x.text}
        </div>
      ))}
    </div>
  );
};

export default Chat;
