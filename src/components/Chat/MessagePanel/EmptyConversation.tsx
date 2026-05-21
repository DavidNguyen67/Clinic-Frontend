import { MessageSquare } from "lucide-react";

function EmptyConversation() {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-3 text-center px-6">
      <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
        <MessageSquare className="h-6 w-6 text-muted-foreground" />
      </div>
      <div>
        <p className="text-sm font-medium">No conversation selected</p>
        <p className="text-xs text-muted-foreground mt-1">
          Choose a conversation from the list or start a new one
        </p>
      </div>
    </div>
  );
}

export default EmptyConversation;
