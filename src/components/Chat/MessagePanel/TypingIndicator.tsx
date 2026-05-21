function TypingIndicator() {
  return (
    <div className="flex items-end gap-2 px-1">
      <div className="flex items-center gap-1 bg-muted rounded-2xl rounded-bl-sm px-3.5 py-2.5">
        <span
          className="h-1.5 w-1.5 rounded-full bg-muted-foreground/60 animate-bounce"
          style={{ animationDelay: "0ms" }}
        />
        <span
          className="h-1.5 w-1.5 rounded-full bg-muted-foreground/60 animate-bounce"
          style={{ animationDelay: "150ms" }}
        />
        <span
          className="h-1.5 w-1.5 rounded-full bg-muted-foreground/60 animate-bounce"
          style={{ animationDelay: "300ms" }}
        />
      </div>
    </div>
  );
}

export default TypingIndicator;
