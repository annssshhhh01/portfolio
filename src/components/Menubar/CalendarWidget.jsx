import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function CalendarWidget({ onClose }) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const renderDays = () => {
    const days = [];
    // Empty slots for previous month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="w-8 h-8"></div>);
    }
    // Actual days
    const today = new Date();
    for (let i = 1; i <= daysInMonth; i++) {
      const isToday =
        i === today.getDate() &&
        currentDate.getMonth() === today.getMonth() &&
        currentDate.getFullYear() === today.getFullYear();

      days.push(
        <div
          key={`day-${i}`}
          className={`w-8 h-8 flex items-center justify-center text-xs sm:text-sm rounded-full cursor-default ${
            isToday
              ? "bg-blue-500 text-white font-bold shadow-md"
              : "text-gray-200 hover:bg-white/10"
          }`}
        >
          {i}
        </div>
      );
    }
    return days;
  };

  return (
    <div className="absolute top-10 right-4 w-[280px] p-4 bg-[#1a1b26]/75 dark:bg-[#111111]/80 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl z-[200]">
      <div className="flex items-center justify-between mb-4">
        <button onClick={prevMonth} className="p-1 rounded-full hover:bg-white/10 text-white transition-colors">
          <ChevronLeft className="w-4 h-4" />
        </button>
        <span className="text-white font-semibold text-sm">
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </span>
        <button onClick={nextMonth} className="p-1 rounded-full hover:bg-white/10 text-white transition-colors">
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {dayNames.map((day) => (
          <div key={day} className="w-8 flex justify-center text-[10px] font-medium text-gray-400">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1 place-items-center">
        {renderDays()}
      </div>
    </div>
  );
}
