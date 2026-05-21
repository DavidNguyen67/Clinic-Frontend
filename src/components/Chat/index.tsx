"use client";

import MessagePanel from "@/components/Chat/MessagePanel";
import ConversationList from "@/components/Chat/ConversationList";

function ChatPage() {
  return (
    <div className="container mx-auto h-full flex-1 flex-col flex overflow-hidden">
      <div className="grid grid-cols-12 gap-0 h-full overflow-hidden flex-1 border rounded-lg">
        <div className="col-span-4 border-r h-full overflow-hidden flex flex-col">
          <ConversationList />
        </div>

        <div className="col-span-8 h-full overflow-hidden flex flex-col">
          <MessagePanel />
        </div>
      </div>
    </div>
  );
}

export default ChatPage;
