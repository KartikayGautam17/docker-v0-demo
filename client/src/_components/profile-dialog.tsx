import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dispatch, SetStateAction, useState } from "react";

interface ProfileDialogProps {
  username: string;
  setUsername: Dispatch<SetStateAction<string>>;
  avatarUrl: string;
  isRoomOpen: boolean;
  socketSetName: (newUsername: string) => void;
}

export default function ProfileDialog({
  socketSetName,
  isRoomOpen,
  username,
  setUsername,
  avatarUrl,
}: ProfileDialogProps) {
  const [newUsername, setNewUsername] = useState<string>(
    username || "Anonymous"
  );
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Your Profile</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Your Profile</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center gap-4 py-4">
          <Avatar className="h-24 w-24">
            <AvatarImage src={avatarUrl} alt={username || "my room"} />
            <AvatarFallback>
              {username?.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="text-center">
            <p className="font-semibold">{username || "Anonymous"}</p>
          </div>
          <div className="flex flex-col gap-2 w-full">
            <input
              type="text"
              placeholder="Enter your name"
              defaultValue={username || "Anonymous"}
              onChange={(e) => setNewUsername(e.target.value)}
              className="input p-2"
            />
            <Button
              onClick={() => {
                setUsername(newUsername);
                socketSetName(newUsername);
              }}
              variant="default"
              className="w-[70px] ml-auto mr-5 mt-2 "
              disabled={isRoomOpen}
            >
              Save
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
