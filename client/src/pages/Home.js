import { Link } from "react-router-dom";

const Home = ({ games }) => {
  return (
    <section className="container">
      <div className="row justify-content-center">
        <h1 className="text-center">Games</h1>
        {games.map(({ id, name, img }) => (
          <div className="col-md-3" key={id}>
            <figure className="text-center">
              <img className="img-fluid" src={img} alt={name} />
              <figcaption className="fw-bold">{name}</figcaption>
              <Link className="btn btn-primary" to={`/games/${id}`}>
                Info
              </Link>
            </figure>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Home;
