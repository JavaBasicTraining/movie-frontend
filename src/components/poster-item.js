import { Link } from 'react-router-dom';

export const PosterItem = ({ movie }) => {
    return (<Link to={`/video/${movie.id}`} className="poster_item_link">
        <div className="poster_item">
            <img src={movie.posterSource} alt="" />
            <label>{movie.viTitle}</label>
            <label>{movie.enTitle}</label>
        </div>
    </Link>)
}