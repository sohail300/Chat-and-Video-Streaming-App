import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

const Home = () => {
  const [userId, setUserId] = useState<string>("");

  useEffect(() => {
    setUserId(uuidv4());
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-indigo-100 to-blue-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full">
        <h1 className="text-3xl font-bold text-center mb-6 text-indigo-700">
          Choose to Chat
        </h1>
        <div className="space-y-4">
          <Link to={`/groupchat/${userId}`} className=" ">
            <Button className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 transition-colors duration-300 text-lg font-semibold mb-4">
              Group Chat
            </Button>
          </Link>
          <Link to={"/roomchat"}>
            <Button className="w-full py-3 bg-purple-600 hover:bg-purple-700 transition-colors duration-300 text-lg font-semibold">
              Room Chat
            </Button>
          </Link>
        </div>
        <p className="mt-6 text-center text-gray-600 text-sm">
          Connect with others in private chat rooms
        </p>
      </div>
    </div>
  );
};

export default Home;
