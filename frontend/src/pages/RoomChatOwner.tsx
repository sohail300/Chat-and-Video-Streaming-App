import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Check, Clipboard, Users } from "lucide-react";
import { Message, MessageSend } from "@/types/interfaces";
import Loader from "@/components/Loader";
import { useParams } from "react-router-dom";

const RoomChatOwner: React.FC = () => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [message, setMessage] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [name, setName] = useState<string>("");
  const [isLoading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const { roomId } = useParams();
  const { id } = useParams();

  const copyToClipboard = () => {
    navigator.clipboard.writeText(roomId as string).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  useEffect(() => {
    const newSocket = new WebSocket("ws://localhost:8080");

    newSocket.onopen = () => {
      setLoading(false);
      console.log("Connection established");
    };

    newSocket.onmessage = (event) => {
      const newMessage: Message = JSON.parse(event.data);
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    };

    setSocket(newSocket);

    return () => newSocket.close();
  }, []);

  const sendMessage = () => {
    if (socket && message.trim() && name.trim()) {
      const newMessage: MessageSend = {
        id,
        text: message,
        sender: name,
      };
      socket.send(JSON.stringify(newMessage));
      setMessage("");
    }
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 p-6 flex flex-col items-center justify-center">
      <div className="w-full max-w-3xl mb-6 flex items-center space-x-4 bg-white rounded-lg shadow-md p-4">
        <span className="text-lg font-semibold text-gray-700 whitespace-nowrap">
          Share this link:
        </span>
        <div className="flex-grow flex items-center space-x-2 bg-gray-100 rounded-md p-2">
          <span className="flex-grow truncate">{roomId}</span>
          <button
            onClick={copyToClipboard}
            className="p-1 rounded-md hover:bg-gray-200 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            title="Copy to clipboard"
          >
            {copied ? (
              <Check className="w-5 h-5 text-green-500" />
            ) : (
              <Clipboard className="w-5 h-5 text-gray-500" />
            )}
          </button>
        </div>
      </div>
      <div className="w-full max-w-3xl mb-6 flex items-center space-x-4 bg-white rounded-lg shadow-md p-4">
        <span className="text-lg font-semibold text-gray-700 w-fit">
          Chat as:
        </span>
        <Input
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="flex-grow border-2 border-indigo-200 focus:border-indigo-500 transition-colors duration-300 w-auto"
        />
      </div>
      <Card className="w-full max-w-3xl shadow-2xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
          <CardTitle className="text-3xl font-bold flex items-center justify-between">
            <span className="tracking-wide">World Group Chat</span>
            <div className="flex items-center text-sm font-normal bg-white bg-opacity-20 rounded-full px-3 py-1">
              <Users className="w-5 h-5 mr-2" />
              <span>
                {messages
                  ? `${messages[messages.length - 1].connections} `
                  : 0 + " "}
                online 🟢
              </span>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 bg-gray-50">
          <ScrollArea className="h-[400px] mb-6 pr-4">
            {messages.map((item, index) => (
              <div
                key={index}
                className={`flex items-start space-x-3 mb-6 ${
                  item.id === id ? "justify-end" : "justify-start"
                }`}
              >
                {item.id !== id && (
                  <Avatar className="w-10 h-10 border-2 border-indigo-200">
                    <AvatarImage
                      src={`https://api.dicebear.com/6.x/initials/svg?seed=${item.sender[0]}`}
                    />
                    <AvatarFallback>{item.sender[0]}</AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={`rounded-2xl p-4 max-w-[70%] shadow-md ${
                    item.id === id
                      ? "bg-indigo-600 text-white"
                      : "bg-white text-gray-800"
                  }`}
                >
                  <p className="text-sm font-medium mb-1 opacity-75">
                    {item.sender}
                  </p>
                  <p className="text-sm leading-relaxed">{item.text}</p>
                </div>
                {item.id === id && (
                  <Avatar className="w-10 h-10 border-2 border-indigo-200">
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>{name[0]}</AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
          </ScrollArea>
          <div className="flex space-x-4">
            <Input
              placeholder="Type your message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && sendMessage()}
              className="flex-grow border-2 border-indigo-200 focus:border-indigo-500 transition-colors duration-300"
            />
            <Button
              onClick={sendMessage}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors duration-300"
            >
              Send
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RoomChatOwner;
