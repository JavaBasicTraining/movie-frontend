import { PosterItem } from "./poster-item";

export const PosterList = ({ posters }) => {
    return <div className="poster-list">{
        posters.map((poster, index) => {
            return <PosterItem key={index} movie={poster} />
        })}
        <PosterItem movie={posters[0]} />
        <PosterItem movie={posters[0]} />
        <PosterItem movie={posters[0]} />
    </div>
}
