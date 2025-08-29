import { Card, CardHeader, CardBody, CardFooter } from "@heroui/card";
import { TruncateText } from "dff-util";
import { Image } from "@heroui/react";
import { JSX } from "react";

import { Chat } from "./common/types";

import TypeButton from "@/types/type.button";
import { AppRouter } from "@/utils/services/app.router";
import { RouterChange } from "@/utils/services/app.event";

interface ChatCardProps {
  chat: Chat;
  isValidHttpUrl: (url: string) => boolean;
  renderAvatar: (name: string | undefined) => JSX.Element;
}

export const ChatCard: React.FC<ChatCardProps> = ({
  chat,
  isValidHttpUrl,
  renderAvatar,
}) => {
  return (
    <Card className="shadow-lg rounded-xl bg-white text-gray-900 dark:bg-gray-900 dark:text-gray-100 transition-colors">
      <CardHeader className="flex justify-between items-start w-full">
        <div className="flex flex-col space-y-3">
          {chat.userProfile.length > 0 ? (
            chat.userProfile.map((user, index) => (
              <div key={index} className="flex items-center space-x-3">
                {isValidHttpUrl(user.pic || "") ? (
                  <Image
                    alt={`${user.name || "User"}'s profile`}
                    className="w-12 h-12 rounded-full"
                    src={user.pic}
                  />
                ) : (
                  renderAvatar(user.name)
                )}
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-gray-500 dark:text-gray-400">
                    User
                  </span>
                  <span className="text-sm font-bold text-gray-900 dark:text-white">
                    {user.name || "Unknown User"}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <span className="text-sm text-gray-500 dark:text-gray-400">
              No User Profile
            </span>
          )}
        </div>
        <div className="flex flex-col space-y-3">
          {chat.astrologerProfile.length > 0 ? (
            chat.astrologerProfile.map((astrologer, index) => (
              <div key={index} className="flex items-center space-x-3">
                <div className="flex flex-col text-right">
                  <span className="text-xs font-bold text-gray-500 dark:text-gray-400">
                    Astrologer
                  </span>
                  <span className="text-sm font-bold text-gray-900 dark:text-white">
                    {astrologer.name || "Unknown Astrologer"}
                  </span>
                </div>
                {isValidHttpUrl(astrologer.pic || "") ? (
                  <Image
                    alt={`${astrologer.name || "Astrologer"}'s profile`}
                    className="w-12 h-12 rounded-full"
                    src={astrologer.pic}
                  />
                ) : (
                  renderAvatar(astrologer.name)
                )}
              </div>
            ))
          ) : (
            <span className="text-sm text-gray-500 dark:text-gray-400">
              No Astrologer Profile
            </span>
          )}
        </div>
      </CardHeader>

      <CardBody className="flex flex-col space-y-2 mt-2">
        {chat.userProfile.length > 0 ? (
          chat.userProfile.map((user, index) => (
            <div key={index} className="flex flex-col space-y-1">
              {user.email && (
                <span className="text-sm">
                  <span className="font-bold text-gray-600 dark:text-gray-400">
                    📧 Email:
                  </span>{" "}
                  {user.email}
                </span>
              )}
              {user.mobile && (
                <span className="text-sm">
                  <span className="font-bold text-gray-600 dark:text-gray-400">
                    📱 Mobile:
                  </span>{" "}
                  {user.telCode} {user.mobile}
                </span>
              )}
              {user.dob && (
                <span className="text-sm">
                  <span className="font-bold text-gray-600 dark:text-gray-400">
                    📅 DOB:
                  </span>{" "}
                  {new Date(user.dob).toLocaleString()}
                </span>
              )}
              {user.gothram && (
                <span className="text-sm">
                  <span className="font-bold text-gray-600 dark:text-gray-400">
                    🙌 Gothram:
                  </span>{" "}
                  {user.gothram}
                </span>
              )}
              {user.zodiacSign && (
                <span className="text-sm">
                  <span className="font-bold text-gray-600 dark:text-gray-400">
                    🔮 Zodiac Sign:
                  </span>{" "}
                  {user.zodiacSign}
                </span>
              )}
            </div>
          ))
        ) : (
          <span className="text-sm text-gray-500 dark:text-gray-400">
            No User Details Available
          </span>
        )}
        <span className="text-sm">
          <span className="font-bold text-gray-600 dark:text-gray-400">
            ❓ Question:
          </span>{" "}
          {TruncateText(chat.question, 40)}
        </span>
        <span className="text-xs text-gray-500 dark:text-gray-500">
          <span className="font-bold text-gray-600 dark:text-gray-400">
            🕒 Date:
          </span>{" "}
          {new Date(chat.updatedAt).toLocaleString()}
        </span>
      </CardBody>

      <CardFooter className="flex justify-center mt-2">
        <div className="relative inline-block">
          <TypeButton
            action="primary"
            className="relative px-4 py-2"
            disabled={false}
            isLoading={false}
            label="View Conversation"
            radius="full"
            variant="solid"
            onPress={() =>
              RouterChange(AppRouter.SUPPORT_CHAT_CONVERSATIONS, {
                id: chat.id,
              })
            }
          />
          {chat.unreadMessageCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
              {chat.unreadMessageCount}
            </span>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default ChatCard;
