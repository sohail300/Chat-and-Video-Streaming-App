import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

const RoomChatId: React.FC = () => {
  const [roomId, setRoomId] = useState<string>("");
  const [userId, setUserId] = useState<string>("");

  useEffect(() => {
    setUserId(uuidv4());
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold text-center mb-6 text-indigo-700">
          Join a Chat Room
        </h2>
        <div className="space-y-4">
          <label
            htmlFor="roomId"
            className="block text-sm font-medium text-gray-700"
          >
            Enter the room ID
          </label>
          <Input
            id="roomId"
            type="text"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            placeholder="e.g., abc123"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
          <Link to={`/roomchat/join/${roomId}/${userId}`} className="block">
            <Button
              className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 transition-colors duration-300 text-white font-semibold rounded-md"
              disabled={!roomId.trim()}
            >
              Proceed
            </Button>
          </Link>
        </div>
        <p className="mt-6 text-center text-gray-600 text-sm">
          Make sure you have the correct room ID before proceeding.
        </p>
      </div>
    </div>
  );
};

export default RoomChatId;
