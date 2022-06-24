import styles from "./Home.module.css";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { GamesContext } from "../context/GamesContext";

const Home = () => {
  const { games } = useContext(GamesContext);
  
  return (
    <section>
      {games.map(({ id, name, img }) => (
        <div key={id}>
          <figure>
            <img src={img} alt={name} />
            <figcaption>{name}</figcaption>
            <button type="button">
              <Link to={`/game/${id}`}>Info</Link>
            </button>
          </figure>
        </div>
      ))}
    </section>
  );
};

export default Home;
