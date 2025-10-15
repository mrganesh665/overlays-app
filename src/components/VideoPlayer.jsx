
import React, { useEffect, useRef, useState } from "react";
import Hls from "hls.js";
import axios from "axios";


const VideoPlayer = () => {
  const videoRef = useRef(null);
  const [overlays, setOverlays] = useState([]);
  const [newOverlay, setNewOverlay] = useState({ content: "", x: 10, y: 10 });
  const [editingOverlay, setEditingOverlay] = useState(null);
  const varOcg = "OverlaySystem"; 


  const STREAM_URL = "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8";
  const API_URL = "http://localhost:5000/api/overlays";

 
  useEffect(() => {
    const video = videoRef.current;
    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(STREAM_URL);
      hls.attachMedia(video);
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = STREAM_URL;
    }
  }, []);

 
  const fetchOverlays = async () => {
    try {
      const res = await axios.get(API_URL);
      setOverlays(res.data);
    } catch (error) {
      console.error("Error fetching overlays:", error);
    }
  };

  useEffect(() => {
    fetchOverlays();
  }, []);


  const handleAddOverlay = async () => {
    if (!newOverlay.content) return alert("Please enter overlay text");
    const payload = {
      type: "text",
      content: newOverlay.content,
      position: { x: newOverlay.x, y: newOverlay.y },
      size: { width: 120, height: 50 },
      color: "yellow",
    };
    await axios.post(API_URL, payload);
    await fetchOverlays();
    setNewOverlay({ content: "", x: 10, y: 10 });
  };

 
  const handleDeleteOverlay = async (id) => {
    await axios.delete(`${API_URL}/${id}`);
    await fetchOverlays();
  };


  const handleEditOverlay = (overlay) => {
    setEditingOverlay(overlay);
    setNewOverlay({
      content: overlay.content,
      x: overlay.position.x,
      y: overlay.position.y,
    });
  };


  const handleUpdateOverlay = async () => {
    console.log("Updating Overlay ID:", editingOverlay._id);

    if (!editingOverlay) return;
    const payload = {
      content: newOverlay.content,
      position: { x: newOverlay.x, y: newOverlay.y },
    };
    await axios.put(`${API_URL}/${editingOverlay._id}`, payload);
    await fetchOverlays();
    setEditingOverlay(null);
    setNewOverlay({ content: "", x: 10, y: 10 });
  };

  return (
    <div style={{ position: "relative", width: "80%", margin: "auto" }}>

      <video
        ref={videoRef}
        controls
        style={{
          width: "100%",
          borderRadius: "10px",
          backgroundColor: "black",
        }}
      />


      {overlays.map((overlay) => (
        <div
          key={overlay._id}
          style={{
            position: "absolute",
            top: overlay.position.y,
            left: overlay.position.x,
            backgroundColor: overlay.color,
            color: "black",
            padding: "4px 10px",
            borderRadius: "4px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          {overlay.content}
          <button
            onClick={() => handleEditOverlay(overlay)}
            style={{
              marginLeft: "5px",
              background: "#08c4fdff",
              color: "white",
              border: "none",
              padding: "2px 5px",
              borderRadius: "3px",
            }}
          >
            Edit
          </button>
          <button
            onClick={() => handleDeleteOverlay(overlay._id)}
            style={{
              marginLeft: "5px",
              background: "red",
              color: "white",
              border: "none",
              padding: "2px 5px",
              borderRadius: "3px",
            }}
          >
            Delete
          </button>
        </div>
      ))}


      <div
        style={{
          marginTop: "20px",
          background: "#222",
          color: "white",
          padding: "15px",
          borderRadius: "8px",
        }}
      >
        <h3>{editingOverlay ? "Edit Overlay" : "Add Overlay"}</h3>
        <input
          type="text"
          placeholder="Enter overlay text"
          value={newOverlay.content}
          onChange={(e) =>
            setNewOverlay({ ...newOverlay, content: e.target.value })
          }
          style={{
            padding: "8px",
            marginRight: "10px",
            borderRadius: "5px",
            border: "none",
            color: "black",
          }}
        />
        <button
          onClick={editingOverlay ? handleUpdateOverlay : handleAddOverlay}
          style={{
            padding: "8px 16px",
            backgroundColor: editingOverlay ? "orange" : "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          {editingOverlay ? "Update Overlay" : "Add Overlay"}
        </button>
      </div>
    </div>
  );
};

export default VideoPlayer;
