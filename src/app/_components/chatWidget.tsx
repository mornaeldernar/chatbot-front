"use client";

import { useState, useEffect, useRef } from "react";
import { api } from "~/trpc/react";
import { nanoid } from "nanoid";

interface ChatWidgetProps {
  token: string;
  domain: string;
}

interface ChatMessage {
  id: number;
  content: string;
  threadId: string;
  userEmail: string;
  senderType: string;
  createdAt: Date;
}

export default function ChatWidget({ token, domain }: ChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [hasEmail, setHasEmail] = useState(false);
  const [threadId, setThreadId] = useState<string>("");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [newChatMessage, setNewChatMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { data: widgetCredentialsVerification } =
    api.widgetAuth.verifyWidgetCredentials.useQuery({
      token,
      allowedDomain: domain,
    });

  const sendChatMessage = api.chatbot.sendChatMessage.useMutation();

  const sendWelcomeMessage = api.chatbot.sendWelcomeMessage.useMutation();

  const { data: updatedThreadMessages, refetch: refetchThreadMessages } =
    api.chatbot.getThreadMessages.useQuery({
      threadId: threadId,
      userEmail: userEmail,
    });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  useEffect(() => {
    if (updatedThreadMessages) {
      setChatMessages(updatedThreadMessages);
    }
  }, [updatedThreadMessages]);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userEmail || !widgetCredentialsVerification?.isValid) return;

    setIsLoading(true);
    try {
      const newThreadId = nanoid();
      setThreadId(newThreadId);

      await sendWelcomeMessage.mutateAsync({
        threadId: newThreadId,
        userEmail: userEmail,
        userName: userName,
      });

      await refetchThreadMessages();

      setHasEmail(true);
    } catch (error) {
      console.error("Error creating conversation:", error);
    }
    setIsLoading(false);
  };

  const handleSendChatMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChatMessage.trim() || !threadId) return;

    setIsLoading(true);

    try {
      await sendChatMessage.mutateAsync({
        threadId,
        content: newChatMessage.trim(),
        userEmail: userEmail,
      });

      setNewChatMessage("");

      await refetchThreadMessages();
    } catch (error) {
      console.error("Error sending message:", error);
    }
    setIsLoading(false);
  };

  if (!widgetCredentialsVerification?.isValid) {
    return null;
  }

  return (
    <div className="fixed right-4 bottom-4 z-50">
     {!isOpen && (
  <button
    onClick={() => setIsOpen(true)}
    className="rounded-full bg-green-500 p-4 text-white shadow-lg transition-all duration-300 hover:scale-110 hover:bg-blue-600 group"
  >
    <div className="flex items-center">
      <svg width="40" height="40" viewBox="0 0 64 64" fill="none" className="animate-pulse drop-shadow-glow" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="grad" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#ff00cc" />
            <stop offset="100%" stopColor="#3300ff" />
          </linearGradient>
        </defs>
          <path d="M8 12C8 8.68629 10.6863 6 14 6H50C53.3137 6 56 8.68629 56 12V42C56 45.3137 53.3137 48 50 48H24L14 58V48H14C10.6863 48 8 45.3137 8 42V12Z" stroke="url(#grad)" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M24 30a8 8 0 0116 0Z" fill="#3300ff"/>
          <circle cx="29" cy="26" r="2" fill="white"/>
          <circle cx="35" cy="26" r="2" fill="white"/>
          <line x1="32" y1="18" x2="32" y2="14" stroke="#3300ff" stroke-width="3" stroke-linecap="round"/>
      </svg>
      <span className="text-sm font-medium">Chatea con EBAC IA</span>
    </div>
  </button>
)}

      {isOpen && (
        <div className="flex h-96 w-80 flex-col rounded-2x1 bg-white shadow-xl transition-all duration-300 animate-fade-in">
          <div className="flex items-center justify-between rounded-t-lg bg-gradient-to-r from-[#ff00cc] to-[#3300ff] p-4 text-white">
            <h3 className="font-semibold">EBAC IA te responderá</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-gray-200"
              aria-label="Cerrar chat"
            >
              ✕
            </button>
          </div>

          {!hasEmail && (
            <div className="flex flex-1 flex-col justify-center p-4">
              <h4 className="mb-4 text-lg font-medium">¡Hola! 👋</h4>
              <p className="mb-4 text-gray-600">
                Para comenzar, me gustaría saber a quien voy a atender:
              </p>
              <form onSubmit={handleEmailSubmit}>
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="Tu nombre"
                  className="mb-4 w-full rounded border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  required
                />
                <input
                  type="email"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  placeholder="tu@email.com"
                  className="mb-4 w-full rounded border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  required
                />
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full rounded bg-gradient-to-r from-[#ff00cc] to-[#3300ff] p-2 text-white hover:bg-blue-600 disabled:opacity-50"
                >
                  {isLoading ? "Iniciando..." : "Comenzar Chat"}
                </button>
              </form>
            </div>
          )}

          {hasEmail && threadId && (
            <>
              <div className="flex-1 overflow-y-auto p-4">
                {chatMessages.map((message) => (
                  <div
                    key={message.id}
                    className={`mb-2 ${message.senderType == "USER" ? "text-right" : "text-left"}`}
                  >
                    <div
                      className={getBubbleClass(message.senderType == "USER")}
                    >
                      <div className="whitespace-pre-wrap">
                        {message.content}
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              <form onSubmit={handleSendChatMessage} className="border-t p-2">
                <div className="flex items-end gap-2">
                  <textarea
                    ref={(textArea) => {
                      if (textArea && !newChatMessage) {
                        textArea.focus();
                      }
                    }}
                    value={newChatMessage}
                    onChange={(e) => setNewChatMessage(e.target.value)}
                    onKeyDown={async (
                      e: React.KeyboardEvent<HTMLTextAreaElement>,
                    ) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        if (newChatMessage.trim() && !isLoading) {
                          await handleSendChatMessage(
                            e as unknown as React.FormEvent,
                          );
                        }
                      }
                    }}
                    placeholder="Escribe tu mensaje..."
                    className="flex-1 resize-none rounded border border-gray-300 p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    disabled={isLoading}
                    rows={2}
                  />
                  {!isLoading ? 
                  <button
                    type="submit"
                    disabled={isLoading || !newChatMessage.trim()}
                    className="rounded bg-gradient-to-b from-[#ff00cc] to-[#3300ff] px-3 py-1 text-sm text-white hover:opacity-80 disabled:opacity-50"
                  >
                    Enviar
                  </button>
                  : 
                  <svg className="h-5 w-5 animate-spin text-gradient" viewBox="0 0 24 24" fill="none">
  <defs>
    <linearGradient id="spinner-gradient" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stopColor="#ff00cc" />
      <stop offset="100%" stopColor="#3300ff" />
    </linearGradient>
  </defs>
  <circle
    className="opacity-25"
    cx="12"
    cy="12"
    r="10"
    stroke="url(#spinner-gradient)"
    strokeWidth="4"
    fill="none"
  />
  <path
    className="opacity-75"
    fill="url(#spinner-gradient)"
    d="M4 12a8 8 0 018-8V0C5.4 0 0 5.4 0 12h4z"
  />
</svg>

                  }
                </div>
              </form>
            </>
          )}
        </div>
      )}
    </div>
  );
}
