import React, { useEffect, useState } from "react";
import Graph from "../modules/Graph";
import Calendar from "../modules/Calendar";
import MapView from "../modules/View2D";
import "./Dashboard.css";

import { Responsive, WidthProvider } from "react-grid-layout";

const ResponsiveGridLayout = WidthProvider(Responsive);

function Dashboard({ layout, observations }) {
    
    //State Management
    const [dateRange, setDateRange] = useState({ startDate: new Date("2024-09-16T14:54:00Z"), endDate: new Date("2024-09-16T15:37:26Z")});
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
        if (typeof dateRange == undefined || typeof dateRange == null) {
            setFilteredObservations(observations)
        } else {
            setFilteredObservations(Array.from(observations).filter((observation) => {
                return (Date.parse(observation.startDateTime) >= dateRange.startDate.getTime() && Date.parse(observation.startDateTime) <= dateRange.endDate.getTime())
            }));
        }
    }, [observations, dateRange])

    const handleDateRangeChange = (fromDate, toDate) => {
        setDateRange({ startDate: fromDate, endDate: toDate });
    };

    const generateDOM = () => {
        return Array.from(layout).map((layoutItem, i) => {
            const moduleName = layoutItem["i"].split("_")[0]
            switch(moduleName) {
                case 'Calendar':
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
                            <Calendar
                                className="bg-white h-full border border-amber-700 shadow-md w-full"
                                observations={filteredObservations}
                                onDateRangeChange={handleDateRangeChange}
                            />
                        </div>
                    );
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