import React from 'react'
import ReactPlayer from 'react-player';
import Moviejson from "../config/movie-config.json"

export const Movie = () => {

  const getmovie = () => {
    return Moviejson["data"].map(value => {
      return (
        <>
          {value && value.videoSource && (
            <video className='videos' width="500px" height="auto" controls >
              <source src={value.videoSource} type="video/mp4" />
            </video>
          )}
        </>
      )

    }

    )
  }

  return (
    <div> {getmovie()} </div>)
}
