import { Record } from "pocketbase";
import { ReactNode, FC } from "react";
interface Props {
  className?: string;
  children?: ReactNode;
  record: Record;
}
const ChatMessage: FC<Props> = ({ className, children, record }) => {
  return (
    <div className="flex gap-2 pt-1">
      <div className="text-gray-400">
        {record["@expand"].profile?.name || record.userName}:
      </div>
      <div>{record.text}</div>
    </div>
  );
};

export default ChatMessage;
