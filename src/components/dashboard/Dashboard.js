import React, { useState } from "react";
import MapView from "../modules/View2D";
import "./Dashboard.css"

import { Responsive, WidthProvider } from "react-grid-layout";
import DateRangePicker from "../modules/date-time-selection/DateRangePicker";
import ObservationSlider from "../modules/date-time-selection/ObservationSlider";

const ResponsiveGridLayout = WidthProvider(Responsive);

function Dashboard({ layout, observations }) {
    
    //State Management
    const [dateRange, setDateRange] = useState({ startDate: 0, endDate: Date.now()});
    const [sliderRange, setSliderRange] = useState([0, 100]);

    const [dateTimeRange, setDateTimeRange] = useState({ startDate: 0, endDate: Date.now()})

    const [firstObservationLoading, setFirstObservationLoading] = useState(true);
    

    const filterObservations = (startDate, endDate) => {
        return Array.from(observations).filter((observation) => {
            return Date.parse(observation.startDateTime) >= startDate && Date.parse(observation.startDateTime) <= endDate;
        }).sort((a, b) => a.startDateTime > b.startDateTime ? 1 : -1);
    }

    const resetSliderRange = (includedDateTimes) => {
        if(includedDateTimes.length >= 2) {
            setSliderRange([includedDateTimes[0], includedDateTimes[includedDateTimes.length - 1]])
        } else {
            setSliderRange([0, 100])
        }
    }

    const handleDateRangeSelected = (newDateRange) => {      
        let newFilteredObservations = filterObservations(newDateRange);

        resetSliderRange(Array.from(new Set(newFilteredObservations.map(observation => Date.parse(observation.startDateTime)))));

        setDateTimeRange({
            startDate: newDateRange.startDate,
            endDate: newDateRange.startDate
        });
    }


    const handleSliderRangeSelected = (newSliderRange) => {
        setSliderRange(newSliderRange);

        setDateTimeRange({
            startDate: newSliderRange[0],
            endDate: newSliderRange[1]
        });
    }


    if (firstObservationLoading && observations.length > 0) {
        let tempStartEnd = {
            startDate: Math.min(...observations.map(observation => Date.parse(observation.startDateTime))), 
            endDate: Math.max(...observations.map(observation => Date.parse(observation.startDateTime)))
        }
        setDateRange(tempStartEnd)
        setDateTimeRange(tempStartEnd)
        resetSliderRange(Array.from(new Set(observations.map(observation => Date.parse(observation.startDateTime)))));

        setFirstObservationLoading(false)
    }

    const generateDOM = () => {
        return Array.from(layout).map((layoutItem, i) => {
            const moduleName = layoutItem["i"].split("_")[0]
            switch(moduleName) {
                case 'Slider':
                    return(
                        <div
                            className="reactGridItem"
                            key={layoutItem["i"]}
                            data-grid={{    
                                x: layoutItem["x"],
                                y: layoutItem["y"],
                                w: layoutItem["w"],
                                h: layoutItem["h"],
                                i: layoutItem["i"],
                                minW: 2,
                                minH: 1,
                                static: true
                            }}
                        >
                            <ObservationSlider
                                includedDateTimes={Array.from(new Set(Array.from(observations).map(observation => new Date(Date.parse(observation.startDateTime)))))}
                                sliderRange={sliderRange}
                                handleSliderRangeChange={handleSliderRangeSelected}
                            />
                        </div>
                    )
                case 'DateRangePicker':
                    return (
                        <div
                            className="reactGridItem"
                            key={layoutItem["i"]}
                            data-grid={{    
                                x: layoutItem["x"],
                                y: layoutItem["y"],
                                w: layoutItem["w"],
                                h: layoutItem["h"],
                                i: layoutItem["i"],
                                minW: 2,
                                minH: 1,
                                static: true
                            }}
                        >
                            <DateRangePicker
                                dateRange={dateRange}
                                onDateRangeChange={handleDateRangeSelected}
                                includedDates={Array.from(new Set(Array.from(observations).map(observation => {
                                    const date = new Date(Date.parse(observation.startDateTime));
                                    return date.setHours(0, 0, 0, 0)
                                })))}
                            />
                        </div>
                    )
                // case 'Graph':
                //     return (
                //         <div
                //             className="reactGridItem"
                //             key={layoutItem["i"]}
                //             data-grid={{   
                //                 w: layoutItem["x"],
                //                 x: layoutItem["y"],
                //                 y: layoutItem["w"],
                //                 h: layoutItem["h"],
                //                 i: layoutItem["i"],
                //                 minW: 2,

                //                 minH: 2,           
                //                 static: true
                //             }}
                //         >
                //            <Graph 
                //                 observations={filteredObservations}
                //                 dateRange={dateRange}
                //             />
                //         </div>
                //     );
                case 'View2D':
                    // return (
                    //     <div className="reactGridItem"
                    //     key={layoutItem["i"]}
                    //     data-grid={{
                    //         x: layoutItem["x"],
                    //         y: layoutItem["y"],
                    //         w: layoutItem["w"],
                    //         h: layoutItem["h"],
                    //         i: layoutItem["i"],
                    //         minW: 6,

                    //         minH: 3,  
                    //         static: true
                    //     }}>
                    //         <Testmap/>
                    //     </div>
                    // )
                    return (
                        <div
                            className="reactGridItem"
                            key={layoutItem["i"]}
                            data-grid={{
                                x: layoutItem["x"],
                                y: layoutItem["y"],
                                w: layoutItem["w"],
                                h: layoutItem["h"],
                                i: layoutItem["i"],
                                minW: 6,

                                minH: 3,  
                                static: true
                            }}
                        >
                           <MapView
                                className="mapview"
                                observations={filterObservations(dateTimeRange.startDate, dateTimeRange.endDate)}
                                typeColors={new Map()}
                            />
                        </div>
                    );
                default:
                    return (<div>Not a supported module name</div>);
            }
        })
    }


    return (
        <ResponsiveGridLayout
            layout={layout}
            onLayoutChange={() => {}}
            className= "layout"
        >
            {generateDOM()}
        </ResponsiveGridLayout>
    );
};

export default Dashboard;