import React from 'react'
import MenuIndex from '../components/MenuComponent/MenuIndex'
import Router from '../routes/Router'

const mainView = () => {
    return (
        <div className='main-view'>
            <div className='main-menu'>
                <MenuIndex />
            </div>
            <div className='main-container'>
                {/* <div className="main-header-container"></div> */}
                <div className="main-content-container">
                    <Router/>
                </div>
            </div>
        </div>
    )
}

export default mainView
