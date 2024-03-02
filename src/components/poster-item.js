import {Link} from 'react-router-dom';

export const PosterItem = ({movie}) => {
  const {posterSource, viTitle, enTitle, id} = movie;

  return (
    <Link to={`/video/${id}`} className="poster-item-link">
      <div className="poster-item">
        <img src={posterSource} alt="" className="poster-item__img"/>
        <label>{viTitle}</label>
        <label>{enTitle}</label>
      </div>
    </Link>
  )
}
