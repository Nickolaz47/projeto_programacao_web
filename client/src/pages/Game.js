import { useParams, Link } from "react-router-dom";

const Game = ({ games }) => {
  const { id } = useParams();
  const game = games.find((g) => g.id === Number(id));
  const { name, img, developer, genre, released } = game;

  return (
    <section className="container">
      <div className="text-center">
        <h3>{name}</h3>
        <img src={img} alt={name} />
        <div>
          <p>Desenvolvedora: {developer}</p>
          <p>Gênero: {genre}</p>
          <p>Lançamento: {released}</p>
        </div>
        <Link className="btn btn-secondary" to={"/"}>Voltar</Link>
      </div>
    </section>
  );
};

export default Game;
