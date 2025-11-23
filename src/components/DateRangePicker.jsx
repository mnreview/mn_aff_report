import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, X } from 'lucide-react';

const DateRangePicker = ({ startDate, endDate, onChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [hoverDate, setHoverDate] = useState(null);
    const containerRef = useRef(null);

    // Parse 'YYYY-MM-DD' to Date object (local time)
    const parseDate = (dateStr) => {
        if (!dateStr) return null;
        const [y, m, d] = dateStr.split('-').map(Number);
        return new Date(y, m - 1, d);
    };

    // Format Date object to 'YYYY-MM-DD'
    const formatDate = (date) => {
        if (!date) return '';
        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, '0');
        const d = String(date.getDate()).padStart(2, '0');
        return `${y}-${m}-${d}`;
    };

    const [selection, setSelection] = useState({
        start: parseDate(startDate),
        end: parseDate(endDate),
        isSelecting: false // true if we have clicked once and are waiting for second click
    });

    useEffect(() => {
        setSelection({
            start: parseDate(startDate),
            end: parseDate(endDate),
            isSelecting: false
        });
    }, [startDate, endDate, isOpen]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const getDaysInMonth = (year, month) => {
        return new Date(year, month + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (year, month) => {
        return new Date(year, month, 1).getDay();
    };

    const generateCalendarDays = () => {
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth();
        const daysInMonth = getDaysInMonth(year, month);
        const firstDay = getFirstDayOfMonth(year, month);
        const days = [];

        // Previous month padding
        for (let i = 0; i < firstDay; i++) {
            days.push({ type: 'empty', key: `empty-${i}` });
        }

        // Current month days
        for (let i = 1; i <= daysInMonth; i++) {
            const date = new Date(year, month, i);
            days.push({ type: 'day', date, key: `day-${i}` });
        }

        return days;
    };

    const handleDateClick = (date) => {
        if (!selection.isSelecting) {
            // First click: set start, clear end, start selecting
            setSelection({
                start: date,
                end: null,
                isSelecting: true
            });
        } else {
            // Second click: determine range and confirm
            let newStart = selection.start;
            let newEnd = date;

            if (date < newStart) {
                newEnd = newStart;
                newStart = date;
            }

            setSelection({
                start: newStart,
                end: newEnd,
                isSelecting: false
            });

            onChange(formatDate(newStart), formatDate(newEnd));
            setIsOpen(false);
        }
    };

    const handleMonthChange = (increment) => {
        setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + increment, 1));
    };

    const isDateInRange = (date) => {
        if (!selection.start) return false;

        const start = selection.start;
        const end = selection.end || (selection.isSelecting ? hoverDate : null);

        if (!end) return date.getTime() === start.getTime();

        const d = date.getTime();
        const s = start.getTime();
        const e = end.getTime();

        return d >= Math.min(s, e) && d <= Math.max(s, e);
    };

    const isDateSelected = (date) => {
        return (selection.start && date.getTime() === selection.start.getTime()) ||
            (selection.end && date.getTime() === selection.end.getTime());
    };

    const displayValue = () => {
        if (startDate && endDate) {
            return `${startDate} - ${endDate}`;
        } else if (startDate) {
            return `${startDate} - ...`;
        }
        return 'Select Date Range';
    };

    const clearSelection = (e) => {
        e.stopPropagation();
        onChange('', '');
        setSelection({ start: null, end: null, isSelecting: false });
    };

    return (
        <div className="relative" ref={containerRef}>
            <div
                onClick={() => setIsOpen(!isOpen)}
                className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-200 cursor-pointer hover:border-orange-500/50 transition-all flex items-center justify-between group"
            >
                <div className="flex items-center gap-2">
                    <CalendarIcon className="w-4 h-4 text-slate-400" />
                    <span className={!startDate ? 'text-slate-500' : ''}>
                        {displayValue()}
                    </span>
                </div>
                {(startDate || endDate) && (
                    <div
                        onClick={clearSelection}
                        className="p-1 hover:bg-slate-800 rounded-full text-slate-500 hover:text-white transition-colors"
                    >
                        <X className="w-3 h-3" />
                    </div>
                )}
            </div>

            {isOpen && (
                <div className="absolute z-50 mt-2 p-4 bg-slate-900 border border-slate-800 rounded-xl shadow-xl w-[320px]">
                    <div className="flex items-center justify-between mb-4">
                        <button
                            onClick={() => handleMonthChange(-1)}
                            className="p-1 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <span className="font-medium text-slate-200">
                            {currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
                        </span>
                        <button
                            onClick={() => handleMonthChange(1)}
                            className="p-1 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="grid grid-cols-7 gap-1 mb-2">
                        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                            <div key={day} className="text-center text-xs font-medium text-slate-500 py-1">
                                {day}
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-7 gap-1">
                        {generateCalendarDays().map((item) => {
                            if (item.type === 'empty') {
                                return <div key={item.key} className="aspect-square" />;
                            }

                            const isSelected = isDateSelected(item.date);
                            const inRange = isDateInRange(item.date);
                            const isToday = item.date.toDateString() === new Date().toDateString();

                            return (
                                <button
                                    key={item.key}
                                    onClick={() => handleDateClick(item.date)}
                                    onMouseEnter={() => setHoverDate(item.date)}
                                    className={`
                                        aspect-square rounded-lg text-sm transition-all relative
                                        ${isSelected ? 'bg-orange-600 text-white z-10' : ''}
                                        ${!isSelected && inRange ? 'bg-orange-900/30 text-orange-200' : ''}
                                        ${!isSelected && !inRange ? 'text-slate-300 hover:bg-slate-800' : ''}
                                        ${isToday && !isSelected ? 'border border-orange-500/50' : ''}
                                    `}
                                >
                                    {item.date.getDate()}
                                </button>
                            );
                        })}
                    </div>

                    <div className="mt-4 text-xs text-center text-slate-500">
                        {!selection.isSelecting ? 'Select start date' : 'Select end date'}
                    </div>
                </div>
            )}
        </div>
    );
};

export default DateRangePicker;
