import React, { useState, useRef, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";

const DateSelectorMonth = () => {
    const [selectedMonth, setSelectedMonth] = useState(new Date());
    const [isOpen, setIsOpen] = useState(false);
    const wrapperRef = useRef(null); // ref để xử lý click bên ngoài

    const handleChange = (date) => {
        setSelectedMonth(date);
        setIsOpen(false); // Đóng khi chọn xong
    };

    const handleClick = (e) => {
        e.preventDefault();
        setIsOpen(!isOpen);
    };

    // Đóng DatePicker nếu click ra ngoài
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
                {format(selectedMonth, "MM-yyyy")}
            </button>

            {isOpen && (
                <div style={{ position: "absolute", zIndex: 10, right: 0 }}>
                    <DatePicker
                        selected={selectedMonth}
                        onChange={handleChange}
                        dateFormat="MM-yyyy"
                        showMonthYearPicker
                        showFullMonthYearPicker
                        inline
                    />
                </div>
            )}
        </div>
    );
};

export default DateSelectorMonth;
