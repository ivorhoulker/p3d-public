import { ReactNode, FC } from "react";
import { usePocketList } from "../../hooks/usePocketList";
import ChatMessage from "./ChatMessage";
interface Props {
  className?: string;
  children?: ReactNode;
}
const Chat: FC<Props> = ({ className }) => {
  const { data } = usePocketList("roomChats", "chat", true, {
    expand: "profile",
    filter: `room="kikbshab5qteg8k"`,
  });
  if (!data?.length) return <div>No length!</div>;
  return (
    <div className={className}>
      {data?.reverse().map((x) => (
        <ChatMessage key={x.id} record={x} />
      ))}
    </div>
  );
};

export default Chat;
