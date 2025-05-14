import React, { useEffect, useState } from "react";
import Graph from "../modules/Graph";
import MapView from "../modules/View2D";
import "./Dashboard.css";
import { addDays } from 'date-fns';

import { Responsive, WidthProvider } from "react-grid-layout";
import DateRangePicker from "../modules/date-time-selection/DateRangePicker";
import ObservationSlider from "../modules/date-time-selection/ObservationSlider";

const ResponsiveGridLayout = WidthProvider(Responsive);

function Dashboard({ layout, observations }) {
    
    //State Management
    const [dateRange, setDateRange] = useState({ startDate: 0, endDate: Date.now()});
    const [sliderRange, setSliderRange] = useState([0, 100]);

    const [dateTimeRange, setDateTimeRange] = useState({ startDate: 0, endDate: Date.now()})

    const [filteredObservations, setFilteredObservations] = useState(observations)
    const [typeColors, setTypeColors] = useState(new Map())

    const [firstObservationLoading, setFirstObservationLoading] = useState(true);

    const filterObservations = () => {
        setFilteredObservations(Array.from(observations).filter((observation) => {
            return Date.parse(observation.startDateTime) >= dateTimeRange.startDate && Date.parse(observation.startDateTime) <= dateRange.endDate;
        }));
    }

    useEffect(() => {
        const newTypeColors = new Map();
        const allTypes = new Set();
        
        Array.from(filteredObservations).forEach(observation => {
            Array.from(observation["geoObjects"]).forEach(geoObjects => {
                allTypes.add(geoObjects["type"]);
            });
        });

        allTypes.forEach(type => {
            newTypeColors.set(type, `#${Math.floor(Math.random()*16777215).toString(16)}`)
        })
        setTypeColors(newTypeColors);
    }, [filteredObservations])

    useEffect(() => {
        setDateTimeRange({startDate: sliderRange[0], endDate: sliderRange[1]})
        // setFilteredObservations(Array.from(observations).filter((observation) => {
        //     return Date.parse(observation.startDateTime) >= sliderRange[0] && Date.parse(observation.startDateTime) <= sliderRange[1];
        // }));
    }, [sliderRange])

    useEffect(() => {

        setDateTimeRange({
            startDate: dateRange.startDate,
            endDate: addDays(dateRange.endDate, 1) - 1
        })
        let filtered = Array.from(observations).map(observation => Date.parse(observation.startDateTime)).filter((startDateTime) => {
            return startDateTime >= sliderRange[0] && startDateTime <= sliderRange[1];
        });
        filtered.sort((a, b) => a - b)

        setSliderRange([filtered[0], filtered[filtered.length - 1]])
    }, [dateRange])

    useEffect(() => {
        if (firstObservationLoading && observations.length > 0) {
            console.log("setting minmax dates")
            setDateRange({
                startDate: Math.min(...observations.map(observation => Date.parse(observation.startDateTime))), 
                endDate: Math.max(...observations.map(observation => Date.parse(observation.startDateTime)))
            })
            setFirstObservationLoading(false)
        }
        filterObservations();
    }, [observations])

    useEffect(() => {
        filterObservations()
    }, [dateTimeRange])

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
                                handleSliderRangeChange={setSliderRange}
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
                                handleDateRangeChange={((newDateRange) => {
                                    console.log("date range changed", newDateRange)
                                    setDateRange(newDateRange)
                                })}
                                includedDates={Array.from(new Set(Array.from(observations).map(observation => {
                                    const date = new Date(Date.parse(observation.startDateTime));
                                    return date.setHours(0, 0, 0, 0)
                                })))}
                            />
                        </div>
                    )
                case 'Graph':
                    return (
                        <div
                            className="reactGridItem"
                            key={layoutItem["i"]}
                            data-grid={{   
                                w: layoutItem["x"],
                                x: layoutItem["y"],
                                y: layoutItem["w"],
                                h: layoutItem["h"],
                                i: layoutItem["i"],
                                minW: 2,

                                minH: 2,           
                                static: true
                            }}
                        >
                           <Graph 
                                observations={filteredObservations}
                                dateRange={dateRange}
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
                                observations={filteredObservations}
                                typeColors={typeColors}
                                dateRange={dateRange}
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