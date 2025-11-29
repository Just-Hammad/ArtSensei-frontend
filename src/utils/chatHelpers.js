export const generateSideButtonClass = isActive => {
  return `
    w-16 h-16 transition-all duration-300 ease-in shadow-lg shadow-primary/30 rounded-full relative
    ${isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}
  `;
};

export function formatMessagesForSummary(messages) {
  return messages
    .map((msg) => {
      const role = msg.role === "user" ? "User" : "Assistant";
      let content = msg.content || "";

      if (msg.attachments && msg.attachments.length > 0) {
        content += ` [Attached ${msg.attachments.length} image(s)]`;
      }

      return `${role}: ${content}`;
    })
    .join("\n\n");
}
