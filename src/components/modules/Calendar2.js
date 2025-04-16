import React, { useState } from 'react';
import dayjs from 'dayjs';
import './Calendar2.css';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import 'dayjs/locale/de';

export default function Calendar2({ dateTimes, onDateRangeChange }) {
    const [fromDate, setFromDate] = useState(null);
    const [toDate, setToDate] = useState(null);

    
    return (
        <div className='calendar-container'>
            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={"de"}>
                <div className='FromDatePicker'>
                    <DateTimePicker 
                        className={`calendar-button ${(typeof dateTimes !== 'undefined' && dateTimes.length > 0) ? '' : 'disabled'}`}
                        disabled={typeof dateTimes == 'undefined' || dateTimes.length <= 0}
                        views={['year', 'month', 'day', 'hours', 'minutes', 'seconds']} 
                        label="From Date" 
                        value={fromDate}
                        onChange={(newDate) => setFromDate(newDate)}
                    />
                </div>
                <div className='ToDatePicker'>
                    <DateTimePicker
                        className={`calendar-button ${(typeof dateTimes !== 'undefined' && dateTimes.length > 0) ? '' : 'disabled'}`}
                        disabled={typeof dateTimes == 'undefined' || dateTimes.length <= 0}
                        views={['year', 'month', 'day', 'hours', 'minutes', 'seconds']}
                        label="To Date" 
                        value={toDate}
                        onChange={(newDate) => setToDate(newDate)}
                    />
                </div>
            </LocalizationProvider>
        </div>
    )
}


