import styles from "./Game.module.css";
import { useParams, Link } from "react-router-dom";

const Game = () => {
  const { id } = useParams();
  const { name, img, developer, genre, released } = "";

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
