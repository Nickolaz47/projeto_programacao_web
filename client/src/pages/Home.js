import styles from "./Home.module.css";
import { Link } from "react-router-dom";


const Home = ({games}) => {
  return (
    <section>
      {games.map(({ id, name, img }) => (
        <div key={id}>
          <figure>
            <img src={img} alt={name} />
            <figcaption>{name}</figcaption>
            <button type="button">
              <Link to={`/games/${id}`}>Info</Link>
            </button>
          </figure>
        </div>
      ))}
    </section>
  );
};

export default Home;
