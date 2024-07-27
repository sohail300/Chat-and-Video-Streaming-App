import { useEffect, useRef } from "react";
import { Video } from "lucide-react";

const Receiver = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const socket = new WebSocket("http://localhost:8085");

    socket.onopen = () => {
      socket?.send(JSON.stringify({ type: "receiver" }));
    };

    startReceiving(socket);

    return () => socket.close();
  }, []);

  function startReceiving(socket: WebSocket) {
    const pc = new RTCPeerConnection();

    socket.onmessage = async (event) => {
      console.log("inside msg");
      console.log(event.data);
      const message = JSON.parse(event.data);

      if (message.type === "createOffer") {
        console.log("createOffer");
        await pc.setRemoteDescription(message.sdp);

        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);

        socket.send(
          JSON.stringify({ type: "createAnswer", sdp: pc.localDescription })
        );
      } else if (message.type === "iceCandidate") {
        console.log("iceCandidate");
        await pc.addIceCandidate(message.candidate);
      }
    };

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        socket.send(
          JSON.stringify({ type: "iceCandidate", candidate: event.candidate })
        );
      }
    };

    pc.ontrack = (event) => {
      console.log(event.track);
      if (videoRef.current) {
        videoRef.current.srcObject = new MediaStream([event.track]);
        videoRef.current.play();
      }
    };
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-green-100 to-blue-100">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center">
        <h1 className="font-bold text-4xl mb-6 text-slate-700 flex items-center justify-center">
          <Video className="mr-2" size={32} />
          Receiver
        </h1>
        <video
          ref={videoRef}
          className="w-full max-w-2xl h-auto border-2 text-slate-700 rounded-lg shadow-md"
        ></video>
      </div>
    </div>
  );
};

export default Receiver;
