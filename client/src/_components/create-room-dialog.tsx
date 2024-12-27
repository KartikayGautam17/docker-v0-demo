import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface CreateRoomDialogProps {
  username: string | null;
  onCreateRoom: (roomName: string) => void;
}

export default function CreateRoomDialog({
  username,
  onCreateRoom,
}: CreateRoomDialogProps) {
  const [roomName, setRoomName] = useState(username);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Create Room</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a New Room</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="roomName" className="text-right">
              Room Name
            </Label>
            <Input
              id="roomName"
              value={roomName || "my room"}
              onChange={(e) => setRoomName(e.target.value)}
              className="col-span-3"
            />
          </div>
        </div>
        <DialogTrigger asChild>
          <Button onClick={() => onCreateRoom(roomName || "my room")}>
            Create Room
          </Button>
        </DialogTrigger>
      </DialogContent>
    </Dialog>
  );
}
