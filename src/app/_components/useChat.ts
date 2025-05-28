import { useEffect, useRef, useState } from "react";
import { api } from "~/trpc/react";
import { nanoid } from "nanoid";

export function useChat(token: string, domain: string) {
    const [isOpen, setIsOpen] = useState(false);
    const [userEmail, setUserEmail] = useState("");
    const [userName, setUserName] = useState("");
    const [hasEmail, setHasEmail] = useState(false);
    const [threadId, setThreadId] = useState<string>("");
    const [chatMessages, setChatMessages] = useState<any[]>([]);
    const [newChatMessage, setNewChatMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const {data: widgetCredentialsVerification} =
        api.widgetAuth.verifyWidgetCredentials.useQuery({
            token,
            allowedDomain: domain,
        });
    const sendChatMessage = api.chatbot.sendChatMessage.useMutation();
    const sendWelcomeMessage = api.chatbot.sendWelcomeMessage.useMutation();
    const getMessagesQuery = api.chatbot.getThreadMessages.useQuery(
        {
            threadId,
            userEmail,
        },
        {
            enabled: !!threadId && !!userEmail,
        }
    );
    // Actualiza los mensajes cuando cambian
    useEffect(() => {
        if (getMessagesQuery.data) {
            setChatMessages(getMessagesQuery.data);
        }
    }, [getMessagesQuery.data]);

    // Scroll automático
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [chatMessages]);
    const handleEmailSubmit = async () => {
        if (!userEmail || !widgetCredentialsVerification?.isValid) return;

        setIsLoading(true);
        try {
            const newThreadId = nanoid();
            setThreadId(newThreadId);

            await sendWelcomeMessage.mutateAsync({
                threadId: newThreadId,
                userEmail,
                userName,
            });

            await getMessagesQuery.refetch();
            setHasEmail(true);
        } catch (error) {
            console.error("Error creating conversation:", error);
        }
        setIsLoading(false);
    };
    const handleSendChatMessage = async () => {
    if (!newChatMessage.trim() || !threadId) return;

    setIsLoading(true);
        try {
            await sendChatMessage.mutateAsync({
                threadId,
                content: newChatMessage.trim(),
                userEmail,
            });

            setNewChatMessage("");
            await getMessagesQuery.refetch();
        } catch (error) {
            console.error("Error sending message:", error);
        }
        setIsLoading(false);
    };
    return {
        isOpen,
        setIsOpen,
        chatMessages,
        userEmail,
        userName,
        hasEmail,
        newChatMessage,
        isLoading,
        threadId,
        messagesEndRef,
        setUserEmail,
        setUserName,
        setNewChatMessage,
        handleEmailSubmit,
        handleSendChatMessage,
        isValidWidget: widgetCredentialsVerification?.isValid,
    };
}