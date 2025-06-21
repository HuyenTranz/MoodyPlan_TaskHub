import React, { useState } from 'react';
import Header from '../components/HeaderComponent/HeaderComponent';
import DateSelectorMonth from '../components/DateSelectorMonth';
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval
} from 'date-fns';

const Upcoming = () => {
  const [selectedMonth, setSelectedMonth] = useState(new Date());

  const daysInMonth = eachDayOfInterval({
    start: new Date() > startOfMonth(selectedMonth)
      ? new Date()
      : startOfMonth(selectedMonth),
    end: endOfMonth(selectedMonth)
  });

  const mockTasks = {
    '2025-06-05': ['Làm báo cáo', 'Gửi email cho khách hàng'],
    '2025-06-12': ['Họp nhóm', 'Chạy thử sản phẩm'],
    '2025-06-18': ['Viết bài thuyết trình']
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
        {daysInMonth.map((day) => {
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
                <p className="no-task">Không có công việc</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Upcoming;
