import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { MoreVertical, Trash, Star } from "lucide-react";

interface MessageProps {
  message: {
    id: number;
    user: string;
    text: string;
    isDeleted?: boolean;
    isHighlighted?: boolean;
  };
  isCurrentUser: boolean;
  isAdmin: boolean;
  onDelete: () => void;
  onHighlight: () => void;
}

export default function Message({
  message,
  isCurrentUser,
  isAdmin,
  onDelete,
  onHighlight,
}: MessageProps) {
  return (
    <Card
      className={`mb-2 ${isCurrentUser ? "bg-primary/10" : ""} ${
        message.isHighlighted ? "border-amber-400 border-2" : ""
      }`}
    >
      <CardContent className="p-1">
        <div className="flex items-start justify-between">
          <div>
            <span
              className={`font-semibold ${
                isCurrentUser ? "text-primary" : "text-secondary-foreground"
              }`}
            >
              {message.user}:
            </span>
            <span className="ml-2">{message.text}</span>
          </div>
          {isAdmin && !message.isDeleted && (
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="sm" className="h-6 w-4 p-0">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <div className="flex flex-col">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onDelete}
                    className="px-2 py-1 flex justify-start"
                  >
                    <Trash className="mr-2 h-4 w-4" />
                    <span>Delete</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onHighlight}
                    className="px-2 py-1 flex justify-start"
                  >
                    <Star className="mr-2 h-4 w-4" />
                    {message.isHighlighted ? "Unhighlight" : "Highlight"}
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
