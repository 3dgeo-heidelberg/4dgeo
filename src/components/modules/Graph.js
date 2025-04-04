// // Import necessary React functions and components from Recharts library
// import React, { useEffect, useState } from "react";
// import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

// // Import CSS for the component's styling
// import './Graph.css';

// // Custom component for custom tick formatting on the X and Y axes
// const CustomTick = ({ x, y, payload }) => {
//     return (
//         <text x={x} y={y} dy={10} textAnchor="middle" fontSize={10} fill="black">
//           {/* Display the value of the tick */}
//             {payload.value}
//         </text>
//     );
// };

// // Main Graph component that receives `isConnected`, `eventData`, and `dateRange`, `setFilteredEvents` as props
// export default function Graph({ isConnected, eventData, dateRange, setFilteredEvents }) {
//   // State to store processed data for the bar chart  
//   const [dateRanges, setDateRanges] = useState([]);

//     // Define colors for each event_type
//     const eventColors = {
//         Rockfall: '#ffb400',
//         Debrisflow: '#6F4E37',
//         Vegetation: '#3b8045',
//         undefined: '#7e3b80', 
//     };

//     // Effect to process `eventData` whenever it changes
//     useEffect(() => {
//         if (!eventData || eventData.length === 0) {
//           // If event data is empty, log a message and stop execution
//             console.log("No event data available");
//             return;
//         }

//         const tMinArray = []; // Array to collect minimum dates from events
//         const tMaxArray = []; // Array to collect maximum dates from events


//         // Extract and store start and end dates of each event
//         eventData.forEach(event => {
//             const tMinDate = event.t_min[0].split('_')[0]; // Get t_min date in YYMMDD format
//             const tMaxDate = event.t_max[0].split('_')[0]; // Get t_max date in YYMMDD format

//             tMinArray.push(tMinDate); // Add t_min date to tMinArray
//             tMaxArray.push(tMaxDate); // Add t_max date to tMaxArray
//         });

//         // Sort unique start and end dates
//         const sortedTMinArray = Array.from(new Set(tMinArray)).sort();
//         const sortedTMaxArray = Array.from(new Set(tMaxArray)).sort();
        
//         const ranges = []; // Array to store date ranges
//         const rangeCount = Math.min(sortedTMinArray.length, sortedTMaxArray.length); // Set rangeCount to the smaller of unique start (`t_min`) and end (`t_max`) date counts to ensure each range has both a start and end date.

//         // Loop to define each range with start and end dates
//         for (let i = 0; i < rangeCount; i++) {
//             ranges.push({
//                 start: sortedTMinArray[i], // Starting date of the range
//                 end: sortedTMaxArray[i], // Ending date of the range
//                 volumes: {}, // Initialize volume object to store event volumes
//             });
//         }

//         // Aggregate volumes for each range based on event data
//         eventData.forEach(event => {
//             const tMinDate = event.t_min[0].split('_')[0];
//             const tMaxDate = event.t_max[0].split('_')[0];
//             const eventType = event.event_type[0];
//             const volume = event.volumes_from_convex_hulls[0];

//             ranges.forEach(range => {
//                 if (tMinDate >= range.start && tMaxDate <= range.end) {
//                     if (!range.volumes[eventType]) {
//                         range.volumes[eventType] = 0; // Initialize volume if not present
//                     }
//                     range.volumes[eventType] += volume; // Add volume to the event type
//                 }
//             });
//         });

//         // Convert ranges data into chartData format for rendering in BarChart
//         const chartData = ranges.map(range => {
//             const dataPoint = { 
//                 name: `${range.start.substring(4, 6)}-${range.end.substring(4, 6)}`,// Format for X-axis
//                 start: range.start // Keep start date as a number for sorting
//             };

//             Object.entries(range.volumes).forEach(([type, volume]) => {
//                 dataPoint[type] = volume; // Add event type volume to dataPoint
//             });

//             // Add zero volume for missing event types
//             Object.keys(eventColors).forEach(type => {
//                 if (!(type in dataPoint)) {
//                     dataPoint[type] = 0;
//                 }
//             });

//             return dataPoint; // Return each dataPoint for the chart
//         }).sort((a, b) => a.start - b.start); // Sort chartData by start date

//         setDateRanges(chartData); // Update state with final chart data 
//         console.log("Final Sorted Chart Data for Graph:", chartData);
//     }, [eventData]);

//     // Effect to filter data by date range whenever dateRange or eventData changes
//     useEffect(() => {
//         if (dateRange.fromDate && dateRange.toDate && eventData.length > 0) {
//             // Convert fromDate and toDate to the same format as t_min and t_max (YYMMDD)
//             const fromDateStr = `${String(dateRange.fromDate.getFullYear()).slice(2)}${String(dateRange.fromDate.getMonth() + 1).padStart(2, '0')}${String(dateRange.fromDate.getDate()).padStart(2, '0')}`;
//             const toDateStr = `${String(dateRange.toDate.getFullYear()).slice(2)}${String(dateRange.toDate.getMonth() + 1).padStart(2, '0')}${String(dateRange.toDate.getDate()).padStart(2, '0')}`;

//             // Filter eventData based on the selected date range
//             const filteredEvents = eventData.filter(event => {
//                 const eventStartDate = event.t_min[0].split('_')[0];
//                 const eventEndDate = event.t_max[0].split('_')[0];

//                 return eventStartDate >= fromDateStr && eventEndDate <= toDateStr;
//             });

//             console.log("Filtered Events for Date Range:", filteredEvents);

//             // Pass filteredEvents to the parent component
//             setFilteredEvents(filteredEvents);

//             // After filtering, aggregate and transform filtered events into chartData format
//             const filteredRanges = [];
//             filteredEvents.forEach(event => {
//                 const tMinDate = event.t_min[0].split('_')[0];
//                 const tMaxDate = event.t_max[0].split('_')[0];
//                 const eventType = event.event_type[0];
//                 const volume = event.volumes_from_convex_hulls[0];

//                 const range = filteredRanges.find(r => r.start === tMinDate && r.end === tMaxDate);
//                 if (!range) {
//                     filteredRanges.push({
//                         start: tMinDate,
//                         end: tMaxDate,
//                         volumes: { [eventType]: volume },
//                     });
//                 } else {
//                     range.volumes[eventType] = (range.volumes[eventType] || 0) + volume;
//                 }
//             });

//             // Convert filteredRanges into chartData format and sort by start date
//             const filteredChartData = filteredRanges.map(range => {
//                 const dataPoint = { 
//                     name: `${range.start.substring(4, 6)}-${range.end.substring(4, 6)}`,
//                     start: range.start // Keep start date as a number for sorting
//                 };

//                 Object.entries(range.volumes).forEach(([type, volume]) => {
//                     dataPoint[type] = volume;
//                 });

//                 Object.keys(eventColors).forEach(type => {
//                     if (!(type in dataPoint)) {
//                         dataPoint[type] = 0;
//                     }
//                 });

//                 return dataPoint;
//             }).sort((a, b) => a.start - b.start); // Sort filteredChartData by start date

//             setDateRanges(filteredChartData); // Update the chart with sorted filtered data
//             console.log("Filtered Sorted Chart Data for Graph:", filteredChartData);
//         }
//     }, [dateRange, eventData]);

//     // Only render the chart if connected
//     if (!isConnected) {
//         return <div className="graph-container">Data is not available.</div>;
//     }

//     return (
//         <div className="graph-container">
//             <BarChart width={500} height={400} data={dateRanges} stackOffset="sign">
//                 <XAxis 
//                     dataKey="name" 
//                     interval={0} 
//                     angle={-10} 
//                     textAnchor="middle" 
//                     label={{ value: 'Day-Ranges', position: 'bottom', offset: -6 }} 
//                     tick={<CustomTick />} 
//                 />
//                 <YAxis 
//                     tick={<CustomTick />} 
//                     angle={0} 
//                     label={{ value: 'Volume (cubic meter)', angle: -90, position: 'insideLeft', dy: 10 }} 
//                 />
//                 <Tooltip />
//                 <CartesianGrid strokeDasharray="3 4" />
//                 {Object.keys(eventColors).map(eventType => (
//                     <Bar key={eventType} dataKey={eventType} fill={eventColors[eventType]} stackId="a" />
//                 ))}
//             </BarChart>
//         </div>
//     );
// }
