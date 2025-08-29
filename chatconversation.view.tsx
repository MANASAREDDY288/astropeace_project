import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { ConstMessages } from "dff-util";

import { fetchChatById, addAstrologerResponse } from "../chats/common/service";
import { Chat } from "../chats/common/types";

import TypeInput from "@/types/type.input";
import TypeButton from "@/types/type.button";
import { GridLayout } from "@/layouts/grid-layout";
import { ShowToast } from "@/utils/services/app.event";

interface ChatConversationProps {
  chat: Chat;
  onChatUpdated: (updatedChat: Chat) => void;
}

type FormValues = {
  reply: string;
};

export const ChatConversation: React.FC<ChatConversationProps> = ({
  chat,
  onChatUpdated,
}) => {
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [isSending, setIsSending] = useState(false);

  const { control, handleSubmit, reset, watch } = useForm<FormValues>({
    defaultValues: { reply: "" },
  });

  const reply = watch("reply") || "";

  const handleSendReply = async (data?: FormValues) => {
    const replyText = data?.reply ?? reply;

    if (!replyText.trim()) return; // Prevent empty input
    setIsSending(true);
    try {
      // Send the reply to the server
      await addAstrologerResponse(chat.id, replyText);

      // Fetch updated chat data after sending the reply
      const updatedChat = await fetchChatById(chat.id);

      if (
        !updatedChat ||
        (Array.isArray(updatedChat) && updatedChat.length === 0)
      ) {
        ShowToast("Failed to load updated chat", "warning");

        return;
      }

      reset({ reply: "" }); // Clear the input field
      onChatUpdated(updatedChat); // Update the chat in the parent component
    } catch (error: any) {
      ShowToast(error?.error?.message || ConstMessages.WENT_WRONG, "warning");
    } finally {
      setIsSending(false);
    }
  };

  useEffect(() => {
    if (chatContainerRef.current && chat.conversation?.length) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [chat.conversation]);

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const updatedChat = await fetchChatById(chat.id);

        if (
          !updatedChat ||
          (Array.isArray(updatedChat) && updatedChat.length === 0)
        ) {
          return;
        }
        onChatUpdated(updatedChat);
      } catch (error: any) {
        const message = error?.error?.message || ConstMessages.WENT_WRONG;

        ShowToast(message, "warning");
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [chat.id, onChatUpdated]);

  return (
    <GridLayout>
      <div className="flex flex-col h-screen">
        {/* Chat Messages */}
        <div
          ref={chatContainerRef}
          className="flex-1 overflow-y-auto p-4 overscroll-auto rounded-b-md"
        >
          {chat.conversation && chat.conversation.length > 0 ? (
            chat.conversation.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.fromAstrologer ? "justify-start" : "justify-end"} mb-3`}
              >
                <div
                  className={`max-w-[75%] p-3 rounded-xl shadow-md ${
                    msg.fromAstrologer
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-black"
                  }`}
                >
                  <span>{msg.text}</span>
                  <div className="mt-1 text-xs flex items-center justify-start">
                    <span className="opacity-75">
                      {new Date(msg.timestamp).toLocaleTimeString()}
                    </span>
                    <span
                      className={`ml-2 ${
                        msg.fromAstrologer
                          ? msg.isReadByUser
                            ? "text-blue-300"
                            : "text-gray-200"
                          : msg.isReadByAstrologer
                            ? "text-blue-500"
                            : "text-gray-500"
                      }`}
                    >
                      {msg.fromAstrologer
                        ? msg.isReadByUser
                          ? "✓✓"
                          : "✓"
                        : msg.isReadByAstrologer
                          ? "✓✓"
                          : "✓"}
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-gray-500 text-center">No messages yet</div>
          )}
        </div>

        {/* Input Section */}
        <form
          autoComplete="off"
          className="sticky bottom-0 left-0 right-0 p-3 shadow-inner"
          onSubmit={handleSubmit(handleSendReply)}
        >
          <div className="flex items-end mx-auto max-w-2xl gap-3">
            <TypeInput
              className="flex-grow"
              control={control}
              label="Type a message..."
              name="reply"
              radius="full"
              type="text"
              onChange={() => {}}
            />
            <TypeButton
              action="primary"
              className="px-4 py-2"
              disabled={!reply?.trim() || isSending}
              isLoading={isSending}
              label="Send"
              name="Send"
              radius="full"
              variant="solid"
              onPress={handleSubmit(handleSendReply)}
            />
          </div>
        </form>
      </div>
    </GridLayout>
  );
};
