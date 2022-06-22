import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Game from "./pages/Game";
import axios from "axios";

function App() {
  const url = "";
  const games = axios.get(url);

  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home games={games} />}></Route>
          <Route path="/game/:id" element={<Game />}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
