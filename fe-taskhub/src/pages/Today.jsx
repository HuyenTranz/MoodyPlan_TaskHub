import React from 'react'
import Header from '../components/HeaderComponent/HeaderComponent';

const Today = () => {
  return (
    <div className="page-transition">
      <Header title="Today" />

      <div className="content-container">
        <p>All tasks will be displayed here</p>
      </div>
    </div>
  )
}

export default Today
