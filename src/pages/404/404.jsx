import React from 'react';
import "./404.scss";

const PageNotFound = () => {
  return (
    <div className='page-not-found'>
        <h1>Oh no!</h1>
        <p>That page does not exist. Please check and try again.</p>
        <a href="/">Go home →</a>

        <span>Error 404 — Page not found</span>
    </div>
  )
}

export default PageNotFound