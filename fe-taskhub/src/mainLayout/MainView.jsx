import React from 'react'
import MenuIndex from '../components/MenuComponent/MenuIndex'
import { Outlet } from 'react-router-dom'

const mainView = () => {
    return (
        <div>
            <div className='main-menu'>
                <MenuIndex />
            </div>
            <div className='main-container'>
                {/* <div className="main-header-container"></div> */}
                <div className="main-content-container">
                    <Outlet/>
                </div>
            </div>
        </div>
    )
}

export default mainView
