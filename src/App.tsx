{showMediaLibrary && (
  <div style={{
    position: "fixed",
    top: "30%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    background: "white",
    border: "2px solid #333",
    padding: "2rem",
    zIndex: 9999
  }}>
    <p>This is the modal!</p>
    <button onClick={() => setShowMediaLibrary(false)}>Close</button>
  </div>
)}
