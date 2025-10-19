import { useState } from 'react'
import './main.scss'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import PageNotFound from './pages/404/404'
import ComponentHader from './components/header/hader'
import PageHome from './pages/home/home'

function MyRoutes() {

  return (
    <BrowserRouter>
        <ComponentHader />
        <Routes>
          <Route path="/" element={<PageHome />}/>
          <Route path="*" element={<PageNotFound />}/>
        </Routes>
    </BrowserRouter>
  )
}

export default MyRoutes
