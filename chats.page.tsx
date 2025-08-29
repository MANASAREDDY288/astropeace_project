"use client";

import { useTranslation } from "react-i18next";
import { useEffect, useMemo, useState } from "react";
import { useSignals } from "@preact/signals-react/runtime";
import { useForm } from "react-hook-form";

import { ChatList } from "./chats.list";
import { fetchAllChats } from "./common/service";
import { Chat } from "./common/types";

import TypeSearch from "@/types/type.search";
import { ArticleLayout } from "@/layouts/article-layout";

export default function ChatsPage() {
  console.log("ChatsPage rendered");
  useSignals();
  const { t } = useTranslation();
  const [chats, setChats] = useState<Chat[]>([]);
  const [error, setError] = useState<string | null>(null);

  const {
    watch,
    setValue,
    formState: { },
  } = useForm({
    defaultValues: {
      dateFrom: null,
      dateTo: null,
      search: "",
    },
  });

  const searchTerm = watch("search");
  const dateFrom: any = watch("dateFrom");
  const dateTo: any = watch("dateTo");

  useEffect(() => {
    console.log("useEffect triggered");
    const fetchChats = async () => {
      try {
        const data = await fetchAllChats();
        console.log("Chats fetched:", data);
        setChats(data);
      } catch (error) {
        console.error("Error fetching chats:", error);
        setError("Failed to load chats");
      }
    };
    fetchChats();
  }, []);

  const searchProps = useMemo(
    () => ({
      className: "w-55",
      value: searchTerm ?? "",
      variant: "underlined" as const,
      onChange: (value: string) => setValue("search", value),
    }),
    [searchTerm, setValue],
  );

  const filteredChats = useMemo(() => {
    console.log("Filtering chats:", chats);
    return chats.filter((chat) => {
      const textMatch =
        (chat.userProfile?.[0]?.name
          ?.toLowerCase()
          .includes((searchTerm ?? "").toLowerCase()) ?? false) ||
        (chat.astrologerProfile?.[0]?.name
          ?.toLowerCase()
          .includes((searchTerm ?? "").toLowerCase()) ?? false) ||
        (chat.question
          ?.toLowerCase()
          .includes((searchTerm ?? "").toLowerCase()) ?? false);

      const chatDate = new Date(chat.createdAt);
      const fromDate = dateFrom instanceof Date ? dateFrom : dateFrom ? new Date(dateFrom) : null;
      const toDateVal = dateTo instanceof Date ? dateTo : dateTo ? new Date(dateTo) : null;

      if (toDateVal) {
        toDateVal.setHours(23, 59, 59, 999);
      }

      const dateMatch =
        (!fromDate || chatDate >= fromDate) &&
        (!toDateVal || chatDate <= toDateVal);

      return textMatch && dateMatch;
    });
  }, [chats, searchTerm, dateFrom, dateTo]);

  return (
    <>
      <ArticleLayout>
        <aside className="flex flex-col lg:flex-row justify-between gap-2">
          <div>
            <h2 className="text-2xl font-bold">{t("Chats")}</h2>
          </div>
          <div className="flex flex-col md:flex-row gap-2 items-center">
            <TypeSearch {...searchProps} />
          </div>
        </aside>
        {error && <div className="text-red-500">{error}</div>}
      </ArticleLayout>
      <ChatList chats={filteredChats} />
    </>
  );
}