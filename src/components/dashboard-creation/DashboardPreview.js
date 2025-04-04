import React from "react";
import "./DashboardPreview.css";

import { Responsive, WidthProvider } from "react-grid-layout";

const ResponsiveGridLayout = WidthProvider(Responsive);

function DashboardPreview({ layout, onLayoutChange }) {
    const generateDOM = () => {
        return Array.from(layout).map((layoutItem) => {
            return (
                <div
                    className={`reactGridItem ${layoutItem["i"].toString()}`}
                    key={layoutItem["i"]}
                    data-grid={{
                        x: layoutItem["x"],
                        y: layoutItem["y"],
                        w: layoutItem["w"],
                        h: layoutItem["h"],
                        i: layoutItem["i"],
                        minW: 2,
                        minH: 1
                    }}
                >
                    <div className="content">{layoutItem["i"].split("_")[0]}</div>
                </div>
            )
        })
    }


    return (
        <div className="layout-container">
            <ResponsiveGridLayout
                layout={layout}
                onLayoutChange={onLayoutChange}
                className= "layout"
            >
                {generateDOM()}
            </ResponsiveGridLayout>
        </div>
    );
};

export default DashboardPreview