
import React from "react";
import VideoPlayer from "./components/VideoPlayer";

function App() {
  return (
    <div>
      <h1 style={{ textAlign: "center", margin: "20px 0" , color: "#333" }}>
        Livestream Player
      </h1>
      <VideoPlayer />
    </div>
  );
}

export default App;

