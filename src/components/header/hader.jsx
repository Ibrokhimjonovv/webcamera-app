import React from 'react';
import "./header.scss"

const ComponentHader = () => {

    const isHome = window.location.pathname == '/' ? "home-header" : "" 

  return (
    <div className={`component-header ${isHome}`}>
        <div className="logo">
            <a href="/">
                <img src="/assets/images/diaphragm.png" alt="" />
                <span>My Webcam<sup>®</sup></span>
            </a>
        </div>

        <div className="gg-ad"></div>
    </div>
  )
}

export default ComponentHader