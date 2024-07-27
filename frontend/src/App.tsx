import { Route, Routes } from "react-router-dom";
import "./App.css";
import RoomChat from "./pages/RoomChat";
import GroupChat from "./pages/GroupChat";
import RoomChatOwner from "./pages/RoomChatOwner";
import RoomChatId from "./pages/RoomChatId";
import RoomChatMembers from "./pages/RoomChatMembers";
import Home from "./pages/Home";
import Receiver from "./pages/Receiver";
import Sender from "./pages/Sender";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/sender" element={<Sender />} />
      <Route path="/receiver" element={<Receiver />} />

      <Route path="/groupchat/:id" element={<GroupChat />} />
      <Route path="/roomchat" element={<RoomChat />} />
      <Route path="/roomchat/create/:roomId/:id" element={<RoomChatOwner />} />
      <Route path="/roomchat/join" element={<RoomChatId />} />
      <Route path="/roomchat/join/:roomId/:id" element={<RoomChatMembers />} />
    </Routes>
  );
}

export default App;

// Assignment
// ! WebSocket              WebRTC
// Group Chat ✅            Group Chat
// Rooms using id           Room logic
//                          p2p (single)
//                          p2p (double)
//                          A single producer can produce to multiple people
//                          Replace p2p logic with an SFU (mediasoup)
