import { MessageBubble } from "./MessageBubble";
interface ChatMessage {
    id: number;
    content: string;
    threadId: string;
    userEmail: string;
    senderType: string;
    createdAt: Date;
}

type Props = {
    messages: ChatMessage[];
    messagesEndRef: React.RefObject<HTMLDivElement | null>;
};

export const MessageList = ({ messages, messagesEndRef }: Props) => (
    <div className="flex flex-col gap-2 overflow-y-auto p-4 h-[300px] max-h-[300px]">
        {messages.map((message) => (
            <MessageBubble key={message.id} content={message.content} isUser={message.senderType == "USER"}/>
        ))}
        <div ref={messagesEndRef} />
    </div>
);
