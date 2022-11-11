import { useRef } from "react"
import posterJson from "../config/poster-config.json";
import { PosterItem } from "./poster-item";

export const PosterScroll = () => {
    const posterScrollRef = useRef();

    const scrollLeft = () => {
        var difference = -300;
        var element = posterScrollRef.current;
        var to = element.scrollLeft + difference;

        scrollTo(element, to, 60);
        // posterScrollRef.current.scrollTo(posterScrollRef.current.scrollLeft - 300, 10000);
    }

    const scrollRight = () => {
        var difference = 300;
        var element = posterScrollRef.current;
        var to = element.scrollLeft + difference;
        
        scrollTo(element, to, 60);
        // posterScrollRef.current.scrollTo(posterScrollRef.current.scrollLeft + 300, 10000);
    }

    function scrollTo(element, to, duration) {
        if (duration <= 0) return;
        var difference = to - element.scrollLeft;
        var perTick = difference / duration * 10;

        setTimeout(function () {
            element.scrollLeft = element.scrollLeft + perTick;
            if (element.scrollLeft === to) return;
            scrollTo(element, to, duration - 10);
        }, 10);
    }

    return <div className="poster_scroll">
        <div className="arrow arrow_left" onClick={scrollLeft}>
            <i class="fa-sharp fa-solid fa-chevron-left"></i>
        </div>
        <div className="content" ref={posterScrollRef}>
            {/* <PosterList posters={posterJson.data}/> */}
            {posterJson.data.map((poster, index) => {
                return <PosterItem key={index} poster={poster} />
            })}
            <PosterItem poster={posterJson.data[0]} />
            <PosterItem poster={posterJson.data[0]} />
            <PosterItem poster={posterJson.data[0]} />
            <PosterItem poster={posterJson.data[0]} />
            <PosterItem poster={posterJson.data[0]} />
            <PosterItem poster={posterJson.data[0]} />
        </div>
        <div className="arrow arrow_right" onClick={scrollRight}>
            <i class="fa-sharp fa-solid fa-chevron-right"></i>
        </div>
    </div>
}