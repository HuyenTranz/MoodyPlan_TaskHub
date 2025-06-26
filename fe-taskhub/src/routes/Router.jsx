import React from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import Today from '../pages/Today'
import Upcoming from '../pages/Upcoming'
import StickyWall from '../pages/StickyWall'
import Calendar from '../pages/Calendar'
import Login from '../pages/Login'
import Register from '../pages/Register'
import Completed from '../pages/Completed'
import AllTasks from '../pages/AllTasks'
import Inbox from '../pages/Inbox'

const Router = () => {

    const location = useLocation();
    return (
        <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Today />} />
            <Route path="/upcoming" element={<Upcoming />} />
            <Route path="/sticky-wall" element={<StickyWall />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path='/login' element={<Login />} />
            <Route path='/register' element={<Register />} />
            <Route path="/completed" element={<Completed />} />
            <Route path="/all-tasks" element={<AllTasks />} />
            <Route path="/inbox" element={<Inbox />} />
            {/* <Route path="/settings" element={<Settings />} /> */}
        </Routes>
    )
}

export default Router
