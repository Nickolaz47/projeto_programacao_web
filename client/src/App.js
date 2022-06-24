import "./App.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import Home from "./pages/Home";
import Game from "./pages/Game";
import axios from "axios";

function App() {
  const [games, setGames] = useState([]);
  const url = "http://127.0.0.1:8080";
  const api = axios.create({
    baseURL: url,
  });

  useEffect(() => {
    api
      .get("/games")
      .then((response) => setGames(response.data))
      .catch((err) => {
        console.log("ops! ocorreu um erro" + err);
      });
  }, [api]);

  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home games={games} />}></Route>
          <Route path="/games/:id" element={<Game games={games} />}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
