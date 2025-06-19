import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Today from '../pages/Today'
import Upcoming from '../pages/Upcoming'
import StickyWall from '../pages/StickyWall'
import Calendar from '../pages/Calendar'
import Login from '../pages/Login'
import Register from '../pages/Register'

const Router = () => {
    return (
        <Routes>
            <Route path="/" element={<Today />} />
            <Route path="/upcoming" element={<Upcoming />} />
            <Route path="/sticky-wall" element={<StickyWall />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path='/login ' element={<Login />} />
            <Route path='/register' element={<Register />} />
        </Routes>
    )
}

export default Router
