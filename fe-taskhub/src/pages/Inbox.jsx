import React from 'react'
import BoxAddTask from '../components/BoxAddTaskComponent/BoxAddTask'
import { FaCalendarAlt, FaListUl } from 'react-icons/fa'
import Header from '../components/HeaderComponent/HeaderComponent'

const Inbox = () => {
    return (
        <div className="inbox-container page-transition">
            <Header title="Inbox">
                <div className="view-switcher" style={{ display: 'flex', gap: '0.5rem' }}>
                    <button className="header-button secondary">
                        <FaCalendarAlt style={{ marginRight: '5px' }} /> Month
                    </button>
                    <button className="header-button secondary">
                        <FaListUl style={{ marginRight: '5px' }} /> Week
                    </button>
                </div>
                <button className="header-button">Create Event</button>
            </Header>

            <BoxAddTask />
        </div>
    )
}

export default Inbox
