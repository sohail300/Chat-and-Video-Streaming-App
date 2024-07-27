import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState } from "react";
import { Camera, Video } from "lucide-react";

const Sender = () => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [pc, setPc] = useState<RTCPeerConnection | null>(null);
  const [sender, setSender] = useState<RTCRtpSender | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isConnected, setConnected] = useState(false);

  useEffect(() => {
    const newSocket = new WebSocket("http://localhost:8085");

    newSocket.onopen = () => {
      setSocket(newSocket);
      newSocket?.send(JSON.stringify({ type: "sender" }));
    };

    return () => newSocket.close();
  }, []);

  async function initiateConnection() {
    console.log(socket);
    if (!socket) {
      return;
    }

    const pc = new RTCPeerConnection();
    setPc(pc);

    pc.onnegotiationneeded = async () => {
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      socket?.send(
        JSON.stringify({ type: "createOffer", sdp: pc.localDescription })
      );
    };

    socket.onmessage = async (event) => {
      console.log("inside msg");
      const message = JSON.parse(event.data);

      if (message.type === "createAnswer") {
        await pc.setRemoteDescription(message.sdp);
      } else if (message.type === "iceCandidate") {
        await pc.addIceCandidate(message.candidate);
      }
    };

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        console.log("ice");
        socket.send(
          JSON.stringify({ type: "iceCandidate", candidate: event.candidate })
        );
      }
    };

    await getCameraStreamAndSend(pc);
  }

  async function getCameraStreamAndSend(pc: RTCPeerConnection) {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: false,
    });

    if (videoRef.current) {
      videoRef.current.srcObject = stream;
      videoRef.current.play();
    }

    setSender(pc?.addTrack(stream.getTracks()[0]));
    setConnected(true);
  }

  async function disconnect() {
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setConnected(false);
    if (sender) {
      pc?.removeTrack(sender);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-purple-100">
      <div className="bg-white p-8 rounded-lg shadow-lg flex flex-col ">
        <h1 className="font-bold text-4xl mb-6 text-slate-700 flex items-center justify-center">
          <Video className="mr-2" size={32} />
          Sender
        </h1>
        <video
          ref={videoRef}
          className="w-full max-w-2xl h-auto border-2 text-slate-700 rounded-lg shadow-md"
        ></video>
        {isConnected === true ? (
          <Button
            onClick={() => disconnect()}
            className=" text-white font-semibold py-2 px-4 rounded-md transition duration-300 ease-in-out transform hover:scale-105 flex items-center mt-4"
          >
            <Camera className="mr-2" size={20} />
            Disconnect
          </Button>
        ) : (
          <Button
            onClick={() => initiateConnection()}
            className=" text-white font-semibold py-2 px-4 rounded-md transition duration-300 ease-in-out transform hover:scale-105 flex items-center"
          >
            <Camera className="mr-2" size={20} />
            Send Video
          </Button>
        )}
      </div>
    </div>
  );
};

export default Sender;
