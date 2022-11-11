import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import movieConfig from "../config/movie-config.json";
import { PosterItem } from "./poster-item";

const responsive = {
    superLargeDesktop: {
        // the naming can be any, depends on you.
        breakpoint: { max: 4000, min: 3000 },
        items: 5
    },
    desktop: {
        breakpoint: { max: 3000, min: 1024 },
        items: 5
    },
    tablet: {
        breakpoint: { max: 1024, min: 464 },
        items: 2
    },
    mobile: {
        breakpoint: { max: 464, min: 0 },
        items: 1
    }
};
export const PosterCarousel = () => {
    return (<div style={{ width: "100%", height: "fit-content", background: "#333", padding: "8px 16px", marginTop: "12px" }}>
        
        <Carousel responsive={responsive}
            autoPlay={true}
            autoPlaySpeed={2000}
            infinite={true}
            customTransition="all 0.5s">
                
            {movieConfig.data.map((poster, index) => {
                return <PosterItem key={index} movie={poster} />
            })}
            <PosterItem movie={movieConfig.data[0]} />
            <PosterItem movie={movieConfig.data[0]} />
            <PosterItem movie={movieConfig.data[0]} />
            <PosterItem movie={movieConfig.data[0]} />
            <PosterItem movie={movieConfig.data[0]} />
            <PosterItem movie={movieConfig.data[0]} />
        </Carousel>
    </div>)
}