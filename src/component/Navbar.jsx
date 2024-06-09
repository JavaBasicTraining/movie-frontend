import React from 'react'
import navbarJson from '../config/navbar-config.json'

export const Navbar = () => {
  const listItem = () => {
    return navbarJson["data"].map(value => {
      return (
        value["subItems"].map((value, index) => {
          return (
            <button key={index} value={value} className='list-btn'>
              {value}
            </button>
          )
        }))
    }
    )
  }


  return (
    <div>
      <div className='navbar'>
        {listItem()}
      </div>
    </div>

  )
}



