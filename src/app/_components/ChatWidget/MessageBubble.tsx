type Props = {
    content: string;
    isUser: boolean;
}

export const MessageBubble = ({ content, isUser }: Props) => {
     const bubbleClass =
        `relative inline-block max-w-[70%] rounded-lg p-2 break-words ${
            isUser
            ? "bg-blue-500 text-white rounded-br-none before:right-[-8px] before:border-l-[8px] before:border-l-blue-500"
            : "bg-gray-200 text-gray-800 rounded-bl-none before:left-[-8px] before:border-r-[8px] before:border-r-gray-200"
        } before:absolute before:top-2 before:border-t-[8px] before:border-b-[8px] before:border-t-transparent before:border-b-transparent`;
    
    return (
        <div className={`mb-2 ${isUser ? "text-right" : "text-left"}`}>
            <div className={bubbleClass}>
                <div className="whitespace-pre-wrap">{content}</div>
            </div>
        </div>
    );
}