import React, { useEffect, useRef, useState } from "react";
import logo from "../Asset/logo_bg.png";
import Client from "../components/Client";
import Editor from "../components/Editor";
import { initSocket } from "../socket";
import ACTIONS from "../Action";
import toast from "react-hot-toast";
import {
  useLocation,
  useNavigate,
  Navigate,
  useParams,
} from "react-router-dom";

const EditorPage = () => {
  const [client, setClient] = useState([]);
  const socketRef = useRef(null);
  const codeRef = useRef(null);
  const location = useLocation();
  const reactNavigate = useNavigate();
  const { roomId } = useParams();

  const handdleError = (err) => {
    console.log("Socket error", err);
    toast.error("Socket connection failed, try again later");
    reactNavigate("/");
  };

  const copyHandler = async () => {
    await navigator.clipboard.writeText(roomId);
    toast.success("Room Id has been copied to clipboard");
  };

  const leaveRoomHandler = () => {
    reactNavigate("/");
  };
  useEffect(() => {
    const init = async () => {
      socketRef.current = await initSocket();
      socketRef.current.on("connect_error", (err) => handdleError(err));
      socketRef.current.on("coonect_failed", (err) => handdleError(err));

      socketRef.current.emit(ACTIONS.JOIN, {
        roomId,
        username: location.state?.name,
      });

      //Listening for JOINED event
      socketRef.current.on(ACTIONS.JOINED, ({ client, username, socketId }) => {
        if (username !== location.state.name) {
          toast.success(`${username} has joined the room`);
          console.log(`${username} joined`);
        }
        setClient(client);
        socketRef.current.emit(ACTIONS.SYNC_CODE, {
          code: codeRef.current,
          socketId,
        });
        console.log("sync--", codeRef.current);
      });

      //Listening for DISCONNETED
      socketRef.current.on(ACTIONS.DISCONNECTED, ({ socketId, username }) => {
        toast.success(`${username} left the room`);
        setClient((prev) => {
          return prev.filter((client) => client.socketId !== socketId);
        });
      });
    };
    init();
    return () => {
      socketRef.current.disconnect();
      socketRef.current.off(ACTIONS.JOINED);
      socketRef.current.off(ACTIONS.DISCONNECTED);
    };
  }, []);

  if (!location.state) {
    return <Navigate to="/" />;
  }
  return (
    <div className="mainWrap">
      <div className="aside">
        <div className="asideInner">
          <div className="logo">
            <img className="logoImage" src={logo} alt="logo" />
          </div>
          <div className="clientList">
            {client.map((client) => (
              <Client key={client.socketId} username={client.username} />
            ))}
          </div>
        </div>
        <button className="btn copyBtn" onClick={copyHandler}>
          Copy Room ID
        </button>
        <button className="btn levaeBtn" onClick={leaveRoomHandler}>
          Leave
        </button>
      </div>
      <div className="editorWrap">
        <Editor
          socketRef={socketRef}
          roomId={roomId}
          onCodeChange={(code) => {
            codeRef.current = code;
          }}
        />
      </div>
    </div>
  );
};

export default EditorPage;
