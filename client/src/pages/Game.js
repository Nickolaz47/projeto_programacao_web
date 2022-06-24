import styles from "./Game.module.css";
import { useParams, Link } from "react-router-dom";
import { useContext } from "react";
import { GamesContext } from "../context/GamesContext";

const Game = () => {
  const { id } = useParams();
  const { games } = useContext(GamesContext);
  const { name, img, developer, genre, released } = games.find(
    (game) => game.id === id
  );

  return (
    <section>
      <div>
        <h3>{name}</h3>
        <img src={img} alt={name} />
        <div>
          <p>Desenvolvedora: {developer}</p>
          <p>Gênero: {genre}</p>
          <p>Lançamento: {released}</p>
        </div>
        <button type="button">
          <Link to={"/"}>Info</Link>
        </button>
      </div>
    </section>
  );
};

export default Game;
