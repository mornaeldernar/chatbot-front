"use client";

import { useChat } from "../useChat";
import { ChatButton } from "./ChatButton";
import { ChatHeader } from "./ChatHeader";
import { ChatInput } from "./ChatInput";
import { EmailForm } from "./EmailForm";
import { MessageList } from "./MessagesList";

interface ChatWidgetProps {
  token: string;
  domain: string;
}

export default function ChatWidget({ token, domain }: ChatWidgetProps) {
  const {
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
    isValidWidget,
  } = useChat(token, domain);
  
  if (!isValidWidget) {
    return null;
  }
  
  return (
    <div className="fixed right-4 bottom-4 z-50 w-[350px] max-w-[90vw]">
      {!isOpen && <ChatButton onClick={() => setIsOpen(true)} /> }
      {isOpen && (
        <div className="rounded-lg border bg-white shadow-xl flex flex-col max-h-[80vh] h-[600px]">
          <ChatHeader onClose={()=>setIsOpen(false)}/>
          <div className="flex-1 px-4 py-2">
            {!hasEmail ? (
              <EmailForm
                userEmail={userEmail}
                userName={userName}
                setUserEmail={setUserEmail}
                setUserName={setUserName}
                onSubmit={handleEmailSubmit}
                isLoading={isLoading}
              />) :
              <>
                  <div className="flex-1 overflow-y-auto px-4 py-2">
                    <MessageList messages={chatMessages} messagesEndRef={messagesEndRef}/>
                  </div>
                  <div className="border-t">
                    <ChatInput
                      value={newChatMessage}
                      setValue={setNewChatMessage}
                      isLoading={isLoading}
                      onSubmit={handleSendChatMessage}/>
                  </div>
              </>
            }
          </div>
          
        </div>
      )}
    </div>
  );
}
