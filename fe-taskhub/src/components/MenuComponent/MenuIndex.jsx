import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { FiSidebar } from "react-icons/fi";
import { PiListBold } from "react-icons/pi";
import { MdOutlineSearch } from "react-icons/md";
import { FaListCheck } from "react-icons/fa6";
import { FaAnglesRight } from "react-icons/fa6";
import { FaCalendarAlt } from "react-icons/fa";
import { FaStickyNote } from "react-icons/fa";
import { RiAddLine } from "react-icons/ri";
import { SiTicktick } from "react-icons/si";
import { FaInbox } from "react-icons/fa";
import { AiOutlineClose } from "react-icons/ai";
import BoxAddTask from "../BoxAddTaskComponent/BoxAddTask";

const MenuIndex = () => {

   const [showModal, setShowModal] = useState(false);

   const account = {
      name: "Huyền Trân",
      avatar: "https://scontent.fsgn5-6.fna.fbcdn.net/v/t1.6435-9/90621636_507074146629284_4123664664292753408_n.jpg?_nc_cat=110&ccb=1-7&_nc_sid=833d8c&_nc_ohc=WkmASdwPo5YQ7kNvwH3QMTM&_nc_oc=Adk-R_dv8JmCokHvWahD3zkJcCN3oFajUmtpEy_TMezvtlBMX7oyD3qKDhFIqYmkg0M&_nc_pt=1&_nc_zt=23&_nc_ht=scontent.fsgn5-6.fna&_nc_gid=VotDeJvo98SZu1X91P76GA&oh=00_AfNYxjGZIbZ7BD-27p20-jhO5XAcGExZLD2pseD3gt8ggw&oe=687B9ABC" // Replace with actual avatar URL
   };


   const ARRAY_MENU = [
      {
         id: 0,
         heading: "TASKS",
         children: [
            {
               id: 0,
               name: "All tasks",
               link: "/all-tasks",
               icons: <PiListBold />,
               isActive: true,
            },
            {
               id: 1,
               name: "Inbox",
               link: "/inbox",
               icons: <FaInbox />,
               isActive: true,
            },
            {
               id: 2,
               name: "Today",
               link: "/",
               icons: <FaListCheck />,
               isActive: true,
            },
            {
               id: 3,
               name: "Upcoming",
               link: "/upcoming",
               icons: <FaAnglesRight />,
               isActive: true,
            },
            // {
            //    id: 4,
            //    name: "Calendar",
            //    link: "/calendar",
            //    icons: <FaCalendarAlt />,
            //    isActive: true,
            // },
            {
               id: 5,
               name: "Completed",
               link: "/completed",
               icons: <SiTicktick />,
               isActive: true,
            },
            // {
            //    id: 6,
            //    name: "Sticky Wall",
            //    link: "/sticky-wall",
            //    icons: <FaStickyNote />,
            //    isActive: true,
            // },
         ]
      }

   ];


   const renderMenuItems = () => {
      return ARRAY_MENU.map((items) => (
         <div>
            <div className="menu-heading">
               {items.heading}
            </div>
            <div className="add-task-btn" onClick={() => setShowModal(true)}>
               <RiAddLine className="add-icon" />
               Add task
            </div>
            {items.children.map((child) => (
               <div key={child.id} className="menu-item">
                  <NavLink to={child.link} className="menu-item-link">
                     <div className="menu-item-icon">
                        {child.icons}
                     </div>
                     <div className="menu-item-text">
                        {child.name}
                     </div>
                  </NavLink>
               </div>
            ))}
         </div>
      ));
   };

   return (
      <div className="menu-index">
         <div className="menu-content">
            <div className="menu-header">
               <div className="text-header">TASKHUB</div>
               <FiSidebar />
            </div>
            <div className="menu-search">
               <MdOutlineSearch className="search-icon" />
               <input
                  type="text"
                  placeholder="Search"
                  className="search-input"
               />
            </div>
            <div className="menu-items">
               {renderMenuItems()}
            </div >
         </div>
         <div className="menu-account">
            <div className="account-avt">
               <img src={account.avatar} alt="Avatar" className="avatar-image" />
            </div>
            <div className="account-name">{account.name}</div>
         </div>

         {/* Modal hiện khi showModal = true */}
         {showModal && (
            <div className="modal-overlay" onClick={() => setShowModal(false)}>
               <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                  <button className="modal-close-btn" onClick={() => setShowModal(false)}>
                     <AiOutlineClose />
                  </button>

                  <BoxAddTask />
               </div>
            </div>
         )}
      </div>
   );
};

export default MenuIndex;
