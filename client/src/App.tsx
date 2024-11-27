import { useEffect, useState } from "react";
import "./App.css";
import { io } from "socket.io-client";
function App() {
  const [response, setResponse] = useState<
    { title: string } | null | undefined
  >({ title: "loading" });
  const socket = io("http://localhost:8080");
  useEffect(() => {
    socket.on("welcome", (data) => {
      console.log(data);
    });
    fetch("https://jsonplaceholder.typicode.com/todos/1")
      .then((response) => response.json())
      .then((json) => {
        console.log(json);
        setTimeout(() => {
          setResponse(json);
        }, 2000);
      });
  }, []);

  return (
    <div>
      <span>Fetching API Response </span>
      <div>{response?.title}</div>
    </div>
  );
}

export default App;
