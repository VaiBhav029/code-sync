import React, { useState } from "react";
import logo from "../Asset/logo_bg.png";

import { v4 as uuidv4 } from "uuid";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import Typer from "../components/Typer";

const Home = () => {
  const navigate = useNavigate();
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const createRoom = (e) => {
    e.preventDefault();
    const id = uuidv4();
    setId(id);
    toast.success("Created new room");

    console.log(id);
  };
  const joinRoom = () => {
    if (!id || !name) {
      toast.error("Room id and name is required");
      return;
    }
    //Redirect
    navigate(`editor/${id}`, {
      state: {
        name,
      },
    });
  };
  const handleInputEnter = (e) => {
    if (e.code === "Enter") {
      joinRoom();
    }
  };
  return (
    <div className="homePageWrapper">
      <div className="formWrapper">
        <div className="logoWrapper">
          <img src={logo} className="logo" alt="logo" />
        </div>
        <Typer />
        {/* <h4 className='mainLabel'>Paste invitation ROOM ID</h4> */}
        <div className="inputGroup">
          <input
            type="text"
            className="inputBox"
            placeholder="ROOM ID"
            value={id}
            onChange={(e) => setId(e.target.value)}
            onKeyUp={handleInputEnter}
          />
          <input
            type="text"
            className="inputBox"
            placeholder="Username"
            onChange={(e) => setName(e.target.value)}
            onKeyUp={handleInputEnter}
          />
          <button className="btn joinBtn" onClick={joinRoom}>
            Join
          </button>
          <span className="createInfo">
            If you dont have an invite then create &nbsp;
            <a href="" onClick={createRoom} className="createNewBtn">
              new room
            </a>
          </span>
        </div>
      </div>
      <footer>
        <h4>Built with ❤ by Vaibhav</h4>
      </footer>
    </div>
  );
};

export default Home;
