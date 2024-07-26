import { Route, Routes } from "react-router-dom";
import "./App.css";
import Group from "./pages/Group";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Group />} />
    </Routes>
  );
}

export default App;

// Assignment
// ! WebSocket              WebRTC
// Group Chat               Group Chat
// Rooms using id           Room logic
//                          p2p (single)
//                          p2p (double)
//                          A single producer can produce to multiple people
//                          Replace p2p logic with an SFU (mediasoup)
