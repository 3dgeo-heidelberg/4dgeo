import React, { useState } from "react";
import MapView from "../modules/View2D";
import "./Dashboard.css"

import { Responsive, WidthProvider } from "react-grid-layout";
import DateRangePicker from "../modules/date-time-selection/DateRangePicker";
import ObservationSlider from "../modules/date-time-selection/ObservationSlider";
import { addDays } from "date-fns";
import Chart from "../modules/Chart";

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
        
        setDateRange(newDateRange);    
        let newFilteredObservations = filterObservations(newDateRange.startDate, newDateRange.endDate);

        resetSliderRange(Array.from(new Set(newFilteredObservations.map(observation => Date.parse(observation.startDateTime)))));

        setDateTimeRange({
            startDate: newDateRange.startDate,
            endDate: newDateRange.endDate
        });
    }


    const handleSliderRangeSelected = (newSliderRange) => {
        setSliderRange(newSliderRange);

        setDateTimeRange({
            startDate: newSliderRange[0],
            endDate: newSliderRange[1]
        });
    }

    const getDateFromDateTime = (dateTime) => {
        let date = new Date(dateTime);
        return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
    }

    if (firstObservationLoading && observations.length > 0) {
        let tempStartEnd = {
            startDate: Math.min(...observations.map(observation => Date.parse(observation.startDateTime))), 
            endDate: Math.max(...observations.map(observation => Date.parse(observation.startDateTime)))
        }
        setDateRange({startDate: getDateFromDateTime(tempStartEnd.startDate), endDate: addDays(getDateFromDateTime(tempStartEnd.endDate), 1) - 1});
        setDateTimeRange(tempStartEnd)
        resetSliderRange(Array.from(new Set(observations.map(observation => Date.parse(observation.startDateTime)))));

        setFirstObservationLoading(false)
    }

    const getAllTypesWithColors = () => {
        const allTypes = new Set();
        observations.forEach(observation => {
            observation.geoObjects.forEach(geoObject => {
                allTypes.add(geoObject.type);
            });
        });

        const typeColors = new Map();
        Array.from(allTypes).map((type) => {
            const color = `#${Math.floor(Math.random()*16777215).toString(16)}`; // Generate a random color
            typeColors.set(type, color);
            return 0;
        });
        return typeColors;
    }

    const typeColors = getAllTypesWithColors();



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
                                includedDateTimes={Array.from(new Set(Array.from(filterObservations(dateRange.startDate, dateRange.endDate)).map(observation => new Date(Date.parse(observation.startDateTime)))))}
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
                                handleDateRangeChange={handleDateRangeSelected}
                                includedDates={Array.from(new Set(Array.from(observations).map(observation => {
                                    const date = new Date(Date.parse(observation.startDateTime));
                                    return date.setHours(0, 0, 0, 0)
                                })))}
                            />
                        </div>
                    )
                case 'Chart':
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
                                minW: 3,
                                minH: 1,           
                                static: true
                            }}
                        >
                           <Chart 
                                observations={filterObservations(dateTimeRange.startDate, dateTimeRange.endDate)}
                                typeColors={typeColors}
                            />
                        </div>
                    );
                case 'View2D':
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