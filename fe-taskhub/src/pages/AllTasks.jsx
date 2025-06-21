import React from 'react'
import { FaFilter } from 'react-icons/fa';
import { MdSort } from 'react-icons/md';
import Header from '../components/HeaderComponent/HeaderComponent';

const AllTasks = () => {
    return (
        <div  className="page-transition">
           
            <Header title="All Tasks">
                <div className="header-icon-button">
                    <FaFilter />
                </div>
                <div className="header-icon-button">
                    <MdSort />
                </div>
                <button className="header-button">Add Task</button>
            </Header>

            <div className="content-container">
                <p>All tasks will be displayed here</p>
            </div>
        </div>
    )
}

export default AllTasks
