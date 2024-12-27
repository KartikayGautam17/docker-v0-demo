"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ChatRoom from "./_components/chat-room";
import { ThemeProvider } from "./_components/theme-provider";
import { ThemeToggle } from "./_components/theme-toggle";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import ProfileDialog from "./_components/profile-dialog";
import CreateRoomDialog from "./_components/create-room-dialog";
import { Loader2 } from "lucide-react";
import { io, Socket } from "socket.io-client";

export default function Home() {
  const [clientSocket, setClientSocket] = useState<Socket | null>(null);
  const [username, setUsername] = useState<string>("Anonymous");
  useEffect(() => {
    const socket = io("http://localhost:8080", { autoConnect: false });
    setClientSocket(socket);
    socket.connect();
    socketSetName(username);
    return () => {
      clientSocket?.disconnect();
      console.log("disconnected from server");
    };
  }, []);
  if (clientSocket) {
    clientSocket.on("connect", () => {
      console.log("connected to server");
      console.log("your socket id", clientSocket.id);
    });
  }
  const socketSetName = (newUsername: string | null) => {
    console.log("Why is this not working");
    console.log(clientSocket);
    clientSocket?.emit("username", newUsername);
  };
  const [roomId, setRoomId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isRoomOpen, setIsRoomOpen] = useState<boolean>(false);
  const { toast } = useToast();

  const avatarUrl = "https://github.com/shadcn.png";

  const joinRoom = (enteredRoomId: string) => {
    setIsLoading(true);
    setTimeout(() => {
      if (enteredRoomId === "1234" || enteredRoomId === "giyu's room") {
        setRoomId(enteredRoomId);
        setIsRoomOpen(true);
      } else {
        toast({
          title: "Error",
          description: "Room not found",
          variant: "destructive",
        });
      }
      setIsLoading(false);
    }, 2000);
  };

  const createRoom = (roomName: string) => {
    setRoomId(roomName);
    setIsRoomOpen(true);
  };

  const closeRoom = () => {
    setRoomId(null);
    setIsRoomOpen(false);
  };

  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Welcome to the Chatroom</h1>
          <div className="flex items-center space-x-4">
            <ProfileDialog
              socketSetName={socketSetName}
              username={username}
              setUsername={setUsername}
              avatarUrl={avatarUrl}
              isRoomOpen={isRoomOpen}
            />
            <ThemeToggle />
          </div>
        </div>
        {!roomId ? (
          <div className="space-y-4">
            <CreateRoomDialog username={username} onCreateRoom={createRoom} />
            <div className="flex flex-col space-y-2">
              <div className="flex space-x-2">
                <Input
                  placeholder="Enter room ID to join"
                  onKeyPress={(e) =>
                    e.key === "Enter" && joinRoom(e.currentTarget.value)
                  }
                  disabled={isLoading}
                />
                <Button
                  onClick={() =>
                    joinRoom(
                      (document.querySelector("input") as HTMLInputElement)
                        .value
                    )
                  }
                  disabled={isLoading}
                >
                  Join Room
                </Button>
              </div>
              {isLoading && (
                <div className="flex items-center space-x-2 text-primary">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Connecting...</span>
                </div>
              )}
            </div>
          </div>
        ) : (
          <ChatRoom
            roomId={roomId}
            currentUser={username || "my room"}
            isAdmin={true}
            onLeaveRoom={closeRoom}
            isRoomOpen={isRoomOpen}
            onCloseRoom={closeRoom}
            clientSocket={clientSocket as Socket}
          />
        )}
      </div>
      <Toaster />
    </ThemeProvider>
  );
}
