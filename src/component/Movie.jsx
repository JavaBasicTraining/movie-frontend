import React from 'react'
import Moviejson from "../config/movie-config.json"

export const Movie = () => {

  const getmovie = () => {
    return Moviejson["data"].map((value, index) => (
      <>
        {value && value.videoSource && (
          <video key={index} className='videos' width='500' height="500" controls >
            <source src={`/video/${value.videoSource}`} type="video/mp4" />
          </video>
        )}
      </>
    ))
  }

  return (
    <div> {getmovie()} </div>
  )
}
