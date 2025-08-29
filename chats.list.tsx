import { Chat } from "./common/types";
import ChatCard from "./chat.card";

import { GridLayout } from "@/layouts/grid-layout";
interface ChatListProps {
  chats: Chat[];
}

export const ChatList: React.FC<ChatListProps> = ({ chats }) => {
  const isValidHttpUrl = (url: string) => {
    try {
      const parsed = new URL(url);

      return ["http:", "https:"].includes(parsed.protocol);
    } catch {
      return false;
    }
  };

  const renderAvatar = (name: string | undefined) => (
    <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center font-semibold">
      {name?.charAt(0).toUpperCase() || "?"}
    </div>
  );

  return (
    <GridLayout>
      <div className="w-full rounded-lg">
        <div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
            {chats.length > 0 ? (
              chats.map((chat) => (
                <ChatCard
                  key={chat.id}
                  chat={chat}
                  isValidHttpUrl={isValidHttpUrl}
                  renderAvatar={renderAvatar}
                />
              ))
            ) : (
              <span className="text-center text-gray-600 col-span-3">
                No chats found.
              </span>
            )}
          </div>
        </div>
      </div>
    </GridLayout>
  );
};
