import React, { useState } from 'react';
import Header from '../components/HeaderComponent/HeaderComponent';
import DateSelectorMonth from '../components/DateSelector/DateSelectorMonth';
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval
} from 'date-fns';

const Upcoming = () => {
  const [selectedMonth, setSelectedMonth] = useState(new Date());

  const today = new Date();
  const isSameMonth =
    selectedMonth.getMonth() === today.getMonth() &&
    selectedMonth.getFullYear() === today.getFullYear();

  const isFutureMonth =
    selectedMonth.getFullYear() > today.getFullYear() ||
    (selectedMonth.getFullYear() === today.getFullYear() &&
      selectedMonth.getMonth() > today.getMonth());

  const startDate = isSameMonth
    ? today
    : isFutureMonth
      ? startOfMonth(selectedMonth)
      : null; // Don't show past months

  const daysInMonth = startDate
    ? eachDayOfInterval({
      start: startDate,
      end: endOfMonth(selectedMonth)
    })
    : [];

  // Mock task data
  const mockTasks = {
    '2025-06-05': ['Submit report', 'Send email to client'],
    '2025-06-12': ['Team meeting', 'Product test run'],
    '2025-06-18': ['Write presentation slides']
  };

  const getTasksByDay = (date) => {
    const key = format(date, 'yyyy-MM-dd');
    return mockTasks[key] || [];
  };

  return (
    <div className="page-transition">
      <Header title="Upcoming">
        <DateSelectorMonth
          selectedMonth={selectedMonth}
          onChange={setSelectedMonth}
        />
      </Header>

      <div className="upcoming-container">
        {daysInMonth.length === 0 ? (
          <p className="no-task" style={{ padding: '1rem' }}>
            No tasks to display for this month.
          </p>
        ) : (
          daysInMonth.map((day) => {
            const tasks = getTasksByDay(day);
            return (
              <div className="day-block" key={day.toISOString()}>
                <h4 className="day-title">{format(day, 'dd-MM-yyyy')}</h4>
                {tasks.length > 0 ? (
                  <ul className="task-list">
                    {tasks.map((task, index) => (
                      <li key={index}>{task}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="no-task">No tasks</p>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Upcoming;
