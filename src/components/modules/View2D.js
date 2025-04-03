import { useEffect, useState } from "react";
import { MapContainer, ImageOverlay, GeoJSON, LayersControl, Polygon, Rectangle, Circle, CircleMarker, LayerGroup, Tooltip } from "react-leaflet"; // Import Leaflet components for rendering the map and layers
import L from "leaflet"; // Import Leaflet library to access its utility methods
import "leaflet/dist/leaflet.css"; // Import Leaflet's CSS for map styling
import { red } from "@mui/material/colors";

export default function View2D({ 
    observations,
    typeColors // Object mapping event types to colors for styling
 }) {
    const [backgroundImageData, setBackgroundImageData] = useState("")

    useEffect(() => {
        const imgData = observations.find(observation => observation.backgroundImageData)
        if(imgData) {
            setBackgroundImageData(imgData.backgroundImageData);
        }
    }, [observations]);

    const getEventGeometries = () => {
        return Array.from(observations).map((observation, i) => Array.from(observation.geoObjects).map((geoObject, j) => {
            switch(geoObject.geometry.type) {
                case 'Polygon':
                    return (
                        <Polygon
                            key={`${i}-${j}`} 
                            pathOptions={{ 
                                color: 'purple',
                                weight: 2,
                                opacity: 1,
                                fillOpacity: 0.65
                            }}
                            positions={geoObject.geometry.coordinates}
                        >
                            <Tooltip>
                                <b>Type:</b> {geoObject.type}
                                {Object.entries(geoObject.customEntityData).map((item, i) => {
                                    return (
                                        <div key={i}><b>{item[0]}:</b> {item[1]}</div>
                                    )
                                })}
                            </Tooltip>
                        </Polygon>              
                    );
                case 'Point':
                    return (
                        <Circle 
                            key={`${i}-${j}`}
                            color={typeColors.get(geoObject.type)}
                            weight={1} // Line thickness
                            opacity={1} // Line opacity
                            fillOpacity={0.65} // Fill opacity
                            center={geoObject.geometry.coordinates[0]}
                            radius={5}                            
                            crs={L.CRS.Simple}
                        >
                            <Tooltip>
                                <b>Type:</b> {geoObject.type}
                            </Tooltip>
                        </Circle>
                        
                    );
                case 'Rectangle':
                    return (
                        <Rectangle
                            key={`${i}-${j}`}
                            pathOptions={{ 
                                color: typeColors.get(geoObject.type),
                                weight: 2, // Line thickness
                                opacity: 1, // Line opacity
                                fillOpacity: 0.5, // Fill opacity
                            }}
                            positions={geoObject.geometry.coordinates}
                        />
                    );
            }
        }));
    };

    return backgroundImageData ? (
        <MapContainer
            center={[0, 0]} // Center the map on the image
            crs={L.CRS.Simple}
            style={{ height: "100%", width: "100%" }} // Make the map take up full space
            minZoom={-2} // Set initial zoom level
            zoom={-2}
            scrollWheelZoom={true} // Disable zooming with the mouse wheel
        >
            <LayersControl position="topright">
                <LayersControl.BaseLayer checked name="Image Layer">
                    <ImageOverlay
                        url={backgroundImageData.url}
                        bounds={
                            [[(-backgroundImageData.height), 0],
                            [0, backgroundImageData.width]]
                        }
                        opacity={0.9}
                    />
                </LayersControl.BaseLayer>
                <LayersControl.Overlay checked name="Geoobjects">
                    <LayerGroup>
                        {getEventGeometries()}
                    </LayerGroup>
                </LayersControl.Overlay>
            </LayersControl>
        </MapContainer>
    ) : (
        <div>Map is not available.
        </div>
    )
};