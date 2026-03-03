import { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;


function App() {
  const [msg, setMsg] = useState("");
  console.log("API:", import.meta.env.VITE_API_URL);

  // Acessa o endpoint '/hello'
  useEffect(() => {
    fetch(`${API_URL}/hello/`)
      .then(res => res.json())
      .then(data => setMsg(data.message));
  }, []);

  return <h1>{msg}</h1>;
}

export default App;