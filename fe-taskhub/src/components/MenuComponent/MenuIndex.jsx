import React from "react";
import { NavLink } from "react-router-dom";

const MenuIndex = () => {
   const ARRAY_MENU = [
      {
         id: 1,
         name: "Today",
         link: "/",
         icons: "",
         isActive: true,
      },
      {
         id: 2,
         name: "Upcoming",
         link: "/upcoming",
         icons: "",
         isActive: true,
      },
      {
         id: 2,
         name: "Calendar",
         link: "/calendar",
         icons: "",
         isActive: true,
      },
   ];

   const renderMenuItems = () => {
      return ARRAY_MENU.map((items) => (
         <div key={items.id} className="menu-item">
            <NavLink to={items.link}>
               {items.name}
            </NavLink>
         </div>
      ));
   };

   return (
      <div>
         <h1>MENU</h1>
         {renderMenuItems()}
      </div>
   );
};

export default MenuIndex;
