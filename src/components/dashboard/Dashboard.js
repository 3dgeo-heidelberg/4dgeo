import React, { useEffect, useState } from "react";
import Graph from "../modules/Graph";
import MapView from "../modules/View2D";
import "./Dashboard.css";
import { addDays } from 'date-fns';

import { Responsive, WidthProvider } from "react-grid-layout";
import DateRangePicker from "../modules/date-time-selection/DateRangePicker";

const ResponsiveGridLayout = WidthProvider(Responsive);

function Dashboard({ layout, observations }) {
    
    //State Management
    const [dateRange, setDateRange] = useState({ startDate: 0, endDate: Date.now()});
    const [filteredObservations, setFilteredObservations] = useState(observations)
    const [typeColors, setTypeColors] = useState(new Map())

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
        setFilteredObservations(Array.from(observations).filter((observation) => {
            let result = (Date.parse(observation.startDateTime) >= dateRange.startDate && Date.parse(observation.startDateTime) <= (addDays(dateRange.endDate, 1) - 1));
            console.log("filtered", dateRange, Date.parse(observation.startDateTime))
            return result;
        }));
    }, [dateRange])

    useEffect(() => {
        setFilteredObservations(observations)

        const allDates = new Set(Array.from(observations).map(observation => new Date(observation.startDateTime)))
        if(allDates.size == 0) {
            setDateRange({
                startDate: 0,
                endDate: Date.now()
            })
        } else {
            setDateRange({
                startDate: Math.min(...(Array.from(allDates))),
                endDate: Math.max(...(Array.from(allDates)))
            })
        }
        
    }, [observations])

    const generateDOM = () => {
        return Array.from(layout).map((layoutItem, i) => {
            const moduleName = layoutItem["i"].split("_")[0]
            switch(moduleName) {
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
                                onDateRangeChange={((newDateRange) => {
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