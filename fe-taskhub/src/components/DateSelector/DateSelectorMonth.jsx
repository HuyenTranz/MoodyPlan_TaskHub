import React, { useRef, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";

const DateSelectorMonth = ({ selectedMonth, onChange }) => {
    const [isOpen, setIsOpen] = React.useState(false);
    const wrapperRef = useRef(null);

    const handleClick = (e) => {
        e.preventDefault();
        setIsOpen(!isOpen);
    };

    const handleChange = (date) => {
        onChange(date); // truyền ra ngoài
        setIsOpen(false);
    };

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
        <div ref={wrapperRef} style={{ position: "relative", display: "inline-block" }}>
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
