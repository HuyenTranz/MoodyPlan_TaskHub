import React, { useState, useRef, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";

const DateSelectorDay = () => {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [isOpen, setIsOpen] = useState(false);
    const wrapperRef = useRef(null); // ✅ để tham chiếu component

    const handleChange = (date) => {
        setSelectedDate(date);
        setIsOpen(false);
    };

    const handleClick = (e) => {
        e.preventDefault();
        setIsOpen(!isOpen);
    };

    // ✅ useEffect: đóng khi click bên ngoài
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div
            ref={wrapperRef}
            style={{ position: "relative", display: "inline-block" }}
        >
            <button className="header-button secondary" onClick={handleClick}>
                {format(selectedDate, "dd-MM-yyyy")}
            </button>
            {isOpen && (
                <div style={{ position: "absolute", zIndex: 10, right: 0 }}>
                    <DatePicker
                        selected={selectedDate}
                        onChange={handleChange}
                        dateFormat="dd-MM-yyyy"
                        inline
                    />
                </div>
            )}
        </div>
    );
};

export default DateSelectorDay;
