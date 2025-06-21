import React from 'react'
import { FaCalendarAlt, FaListUl } from 'react-icons/fa';
import Header from '../components/HeaderComponent/HeaderComponent';

const Calendar = () => {
  return (
    <div  className="page-transition">
      <Header title="Calendar">
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

      <div className="content-container">
        <p>Calendar will be displayed here</p>
      </div>
    </div>
  )
}

export default Calendar
