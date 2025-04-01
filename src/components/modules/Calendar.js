import React, { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './Calendar.css';

function Calendar({ observations, onDateRangeChange }) {
    const [showFromModal, setShowFromModal] = useState(false); // Controls visibility of 'FROM' modal dialogs.
    const [showToModal, setShowToModal] = useState(false); // Controls visibility of 'TO' modal dialogs.

    const [fromDate, setFromDate] = useState(null);
    const [toDate, setToDate] = useState(null);

    const [allDates, setAllDates] = useState([]);

    const [minDate, setMinDate] = useState(null);
    const [maxDate, setMaxDate] = useState(null);

    useEffect(() => {
        var allDates = new Set(Array.from(observations).map(observation => Date.parse(observation.startDateTime)))
        setAllDates(Array.from(allDates));
        setMinDate(Math.min(Array.from(allDates)));
        setMaxDate(Math.max(Array.from(allDates)));
    }, [observations]);


    const handleSetFrom = () => {
        // Once the "FROM" date is set, prepare the highlighted dates
        //setHighlightedDates([new Date(fromDate), new Date(toDate)]);
        //console.log("FROM Date:", fromDate);  // Log the selected FROM date
        setShowFromModal(false);  // Close the FROM modal
        setShowToModal(true);  // Open the TO modal
    };
    
    // Function to set the TO date, finalize the date range, and notify parent component
    const handleSetTo = () => {
        // Once the "TO" date is set, finalize the range
        //setHighlightedDates(generateHighlightedDates(fromDate, toDate));  // Highlight the full date range
        setShowToModal(false);  // Close the TO modal
        if (onDateRangeChange) {// If the parent component provided onDateRangeChange function, call it as it is passed Graph.js
            onDateRangeChange(fromDate, toDate);
        }
    };

    // Function to reset the FROM and TO dates and remove highlighted dates
    const handleCancel = () => {
        setFromDate(null);
        setToDate(null);
        //setHighlightedDates([]);  // Clear the highlighted dates
    };

    // Function to reset the FROM and TO dates to the minimum and maximum values and highlight the full range
    const handleReset = () => {
        setFromDate(new Date(minDate));
        setToDate(new Date(maxDate));
        //setHighlightedDates([new Date(minDate), new Date(maxDate)]);  // Highlight the full range
    };

    const changeFromDate = (newDate) => {
        setFromDate(new Date(Date.parse(newDate) + 7200000));
    };

    const changeToDate = (newDate) => {
        setToDate(new Date(Date.parse(newDate) + 7200000));
    };

    return (
        <div className="calendar-container">
            {/* Button to open the FROM date modal */}
            <button
                className={`calendar-button ${(typeof observations !== 'undefined' && observations.length > 0) ? 'disabled' : ''}`}
                disabled={typeof observations == 'undefined' || observations.length <= 0}   // Button is disabled if no Data available
                onClick={() => setShowFromModal(true)}   // Opens FROM modal when clicked
            >
                FROM
            </button>
            {/* Button to open the TO date modal, only if FROM date is set */}
            <button
                className={`calendar-button ${(typeof observations !== 'undefined' && observations.length > 0) ? 'disabled' : ''}`}
                disabled={typeof observations == 'undefined' || observations.length <= 0}   // Disable until FROM date is selected
                onClick={() => setShowToModal(true)} // Only open TO modal after FROM date is set
            >
                TO
            </button>



            {/* FROM Calendar Modal */}
            {showFromModal && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close-modal" onClick={() => setShowFromModal(false)}>✖</span>
                        <h3>Select FROM Date</h3>
                        <DatePicker
                            selected={fromDate}   // Show the currently selected FROM date
                            onChange={changeFromDate}   // Update FROM date when user selects a date
                            includeDates={allDates}   // Show only available FROM dates
                            showTimeSelectSeconds
                            minDate={minDate}   // Set minimum date for calendar
                            maxDate={maxDate}   // Set maximum date for calendar
                            showTimeSelect  // Allow selecting time along with date
                            timeIntervals={1} // Time selection intervals of 60 minutes
                            dateFormat="yyyy-MM-dd HH:mm"   // Date format with time
                            className="date-picker"   // Apply custom CSS
                            //highlightDates={highlightedDates} // Highlight the date range in FROM calendar when the user again clicks on the FROM
                            // Added condition for enabling/disabling time slots based on available hours
                            //filterTime={filterAvailableTime}
                        />
                        <div className="button-group">
                            {/* Buttons for setting, canceling, or resetting the FROM date */}
                            <button onClick={handleSetFrom} className="action-button set">SET</button>
                            <button onClick={handleCancel} className="action-button cancel">CANCEL</button>
                            <button onClick={handleReset} className="action-button reset">RESET</button>
                        </div>
                    </div>
                </div>
            )}
            
            {/* TO Calendar Modal */}
            {showToModal && (
                <div className="modal">
                    <div className="modal-content">
                    <span className="close-modal" onClick={() => setShowToModal(false)}>✖</span>
                    <h3>Select TO Date</h3>
                    <DatePicker
                        selected={toDate}   // Show the currently selected TO date
                        onChange={changeToDate}   // Update TO date when user selects a date
                        includeDates={allDates}   // Show only available TO dates
                        minDate={minDate}   // Ensure TO date is after FROM date
                        maxDate={maxDate}   // Set maximum date for calendar
                        showTimeSelect   // Allow selecting time along with date
                        timeIntervals={1}   // Time selection intervals of 60 minutes
                        dateFormat="yyyy-MM-dd HH:mm"  // Date format with time
                        className="date-picker"   // Apply custom CSS
                    //   highlightDates={highlightedDates}   // Clear highlighted range when calendar is closed
                        //onMouseOver={(date) => handleMouseOver(date)} // Add onMouseOver for live highlighting
                        //highlightDates={highlightedDates} // Highlight the date range in TO calendar as well
                        // Added condition for enabling/disabling time slots based on available hours
                        //filterTime={filterAvailableTime}
                    />
                    <div className="button-group">
                        {/* Buttons for setting or canceling the TO date */}
                        <button onClick={handleSetTo} className="action-button set">SET</button>
                        <button onClick={handleCancel} className="action-button cancel">CANCEL</button>
                        <button onClick={handleReset} className="action-button reset">RESET</button>
                    </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Calendar