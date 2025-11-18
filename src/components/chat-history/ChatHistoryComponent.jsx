import React from "react";
import { Separator } from "@/components/ui/separator";
import HistoryCard from "./HistoryCard";
import MenuButton from "@/shared/buttons/MenuButton";
import EmptyState from "./EmptyState";

const ChatHistoryComponent = ({ sessions }) => {
  return (
    <section id="chat-history-ctn" className="h-[100dvh] w-full p-4 px-6 space-y-4">
      <div className="flex items-center gap-4 text-gray-700">
        <MenuButton />
        <span className="text-3xl font-semibold">Chat History</span>
      </div>

      <Separator />

      {sessions.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid grid-cols-2 gap-4 pb-4 overflow-y-auto max-h-[calc(100dvh-120px)]">
          {sessions.map((session) => (
            <HistoryCard key={session.id} session={session} />
          ))}
        </div>
      )}
    </section>
  );
};

export default ChatHistoryComponent;
