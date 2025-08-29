import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ConstMessages } from "dff-util";

import { Chat, Message } from "../chats/common/types";
import {
  fetchChatById,
  markAllMessagesAsReadByAstrologer,
} from "../chats/common/service";

import { ChatConversation } from "./chatconversation.view";

import { ArticleLayout } from "@/layouts/article-layout";
import { ShowToast } from "@/utils/services/app.event";
import SkeletonChat from "@/skeleton/skeleton-chat";

export default function ChatConversationPage() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const chatId = searchParams?.get("id");

  const [chat, setChat] = useState<Chat | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!chatId) {
      setLoading(false);

      return;
    }

    const fetchChat = async () => {
      try {
        const data = await fetchChatById(chatId as string);
        const chatData: Chat = Array.isArray(data)
          ? {
              id: chatId,
              conversation: data.map((msg: any) => ({
                id: msg.id,
                text: msg.text,
                fromAstrologer: msg.fromAstrologer,
                timestamp: msg.timestamp,
                isReadByUser: msg.isReadByUser,
                isReadByAstrologer: msg.isReadByAstrologer,
              })),
              userId: "",
              astrologerId: "",
              question: data[0]?.text || "",
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              userProfile: [],
              astrologerProfile: [],
              unreadMessageCount: 0,
              createdBy: "default",
              updatedBy: "default",
              sentMessage: data.length > 0,
              txnOrderId: "",
            }
          : {
              ...data,
              conversation: data.conversation || [],
            };

        await handleMarkAsReadByAstrologer();
        setChat(chatData);
      } catch (error: any) {
        const message = error?.error?.message || ConstMessages.WENT_WRONG;

        ShowToast(message, "warning");
      } finally {
        setLoading(false);
      }
    };

    fetchChat();
  }, [chatId]);

  const handleMarkAsReadByAstrologer = async () => {
    if (!chatId) return;
    try {
      await markAllMessagesAsReadByAstrologer(chatId as string);
    } catch (error) {
      throw error;
    }
  };

  const handleChatUpdated = (updatedChat: Chat | Message[]) => {
    const chatData: Chat = Array.isArray(updatedChat)
      ? {
          id: chatId || "",
          conversation: updatedChat.map((msg: any) => ({
            id: msg.id,
            text: msg.text,
            fromAstrologer: msg.fromAstrologer,
            timestamp: msg.timestamp,
            isReadByUser: msg.isReadByUser,
            isReadByAstrologer: msg.isReadByAstrologer,
          })),
          userId: "",
          astrologerId: "",
          question: updatedChat[0]?.text || "",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          userProfile: [],
          astrologerProfile: [],
          unreadMessageCount: 0,
          createdBy: "default",
          updatedBy: "default",
          sentMessage: updatedChat.length > 0,
          txnOrderId: "",
        }
      : {
          ...updatedChat,
          conversation: updatedChat.conversation || [],
        };

    setChat(chatData);
  };

  const RenderArticle = () => (
    <aside className="flex justify-between gap-2">
      <div>
        <h2 className="text-2xl font-bold">{t("Chat Conversation")}</h2>
      </div>
    </aside>
  );

  const RenderSection = () => {
    return (
      <aside>
        {loading ? (
          <SkeletonChat />
        ) : chat ? (
          <ChatConversation chat={chat} onChatUpdated={handleChatUpdated} />
        ) : (
          <div className="text-gray-500">{t("No chat found")}</div>
        )}
      </aside>
    );
  };

  return (
    <>
      <ArticleLayout>
        <RenderArticle />
      </ArticleLayout>
      <RenderSection />
    </>
  );
}
