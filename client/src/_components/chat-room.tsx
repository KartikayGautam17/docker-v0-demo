import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Socket } from "socket.io-client";
import Message from "./message";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ChatRoomProps {
  roomId: string;
  currentUser: string;
  isAdmin: boolean;
  onLeaveRoom: () => void;
  isRoomOpen: boolean;
  onCloseRoom: () => void;
  clientSocket: Socket;
}

interface MessageType {
  id: number;
  user: string;
  text: string;
  isDeleted?: boolean;
  isHighlighted?: boolean;
}

interface UserType {
  id: number;
  name: string;
  avatarUrl: string;
}

export default function ChatRoom({
  roomId,
  currentUser,
  isAdmin,
  onLeaveRoom,
  isRoomOpen,
  onCloseRoom,
  clientSocket,
}: ChatRoomProps) {
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [canSendMessage, setCanSendMessage] = useState(true);
  const [connectedUsers, setConnectedUsers] = useState<UserType[]>([
    { id: 1, name: currentUser, avatarUrl: "https://github.com/shadcn.png" },
    // { id: 2, name: "User 2", avatarUrl: "https://github.com/shadcn.png" },
    // { id: 3, name: "User 3", avatarUrl: "https://github.com/shadcn.png" },
  ]);

  const sendMessage = () => {
    if (newMessage.trim() && isRoomOpen && canSendMessage) {
      setMessages([
        ...messages,
        { id: Date.now(), user: currentUser, text: newMessage.trim() },
      ]);
      setNewMessage("");
      setCanSendMessage(false);
      clientSocket.send(newMessage.trim());
      setTimeout(() => setCanSendMessage(true), 1000);
    }
  };
  clientSocket.on("message", (data: { username: string; data: string }) => {
    setMessages([
      ...messages,
      { id: Date.now(), user: data.username, text: data.data },
    ]);
  });
  return (
    <div className="h-[calc(100vh-8rem)] flex">
      <div className="w-64 border-r p-4">
        <h3 className="font-semibold mb-4">
          Connected Users ({connectedUsers.length})
        </h3>
        <ScrollArea className="h-[calc(100vh-12rem)]">
          {connectedUsers.map((user) => (
            <div key={user.id} className="flex items-center space-x-2 mb-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user.avatarUrl} />
                <AvatarFallback>
                  {user.name.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm">{user.name}</span>
              <span className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></span>
            </div>
          ))}
        </ScrollArea>
      </div>
      <div className="flex-1 flex flex-col">
        <div className="flex justify-between items-center mb-4 p-4">
          <div>
            <h2 className="text-xl font-semibold">Room: {roomId}</h2>
            <p className="text-sm text-muted-foreground">
              Created by: {currentUser}
            </p>
            <p className="text-sm text-muted-foreground">
              Current admin: {currentUser}
            </p>
          </div>
          <div className="space-x-2">
            <Button onClick={onLeaveRoom}>Leave Room</Button>
            {isAdmin && (
              <Button onClick={onCloseRoom} variant="destructive">
                Close Room
              </Button>
            )}
          </div>
        </div>
        <ScrollArea className="flex-grow border rounded-md p-4 mb-4 mx-4">
          {messages.map((message) => (
            <Message
              key={message.id}
              message={message}
              isCurrentUser={message.user === currentUser}
              isAdmin={isAdmin}
              onDelete={() => {
                setMessages(
                  messages.map((m) =>
                    m.id === message.id
                      ? {
                          ...m,
                          text: "This message has been deleted by the admin",
                          isDeleted: true,
                        }
                      : m
                  )
                );
              }}
              onHighlight={() => {
                setMessages(
                  messages.map((m) =>
                    m.user === message.user
                      ? { ...m, isHighlighted: !m.isHighlighted }
                      : m
                  )
                );
              }}
            />
          ))}
        </ScrollArea>
        <div className="flex space-x-2 p-4">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder={isRoomOpen ? "Type your message..." : "Room is closed"}
            onKeyPress={(e) => e.key === "Enter" && sendMessage()}
            disabled={!isRoomOpen}
          />
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <span>
                  <Button
                    onClick={sendMessage}
                    disabled={!isRoomOpen || !canSendMessage}
                  >
                    Send
                  </Button>
                </span>
              </TooltipTrigger>
              <TooltipContent>
                {!canSendMessage
                  ? "Please wait before sending another message"
                  : "Send message"}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </div>
  );
}
