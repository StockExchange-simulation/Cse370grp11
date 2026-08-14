import { useEffect, useState } from "react";
import { api } from "../services/api";

function App() {
  const [status, setStatus] = useState("");

  useEffect(() => {
    api.get("/api/health")
      .then((response) => {
        setStatus(response.data.status);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return (
    <div>
      <h1>Stock Exchange</h1>
      <p>Backend status: {status}</p>
    </div>
  );
}

export default App;