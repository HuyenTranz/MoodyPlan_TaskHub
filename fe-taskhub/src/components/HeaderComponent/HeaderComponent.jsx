import React from 'react';
import '../../styles/index.scss';

const Header = ({ title, children }) => {
    return (
        <div className="header-container">
            <div className="header-left">
                <h1 className="header-title">{title}</h1>
            </div>
            <div className="header-right">
                {children}
            </div>
        </div>
    );
};

export default Header;