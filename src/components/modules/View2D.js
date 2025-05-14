import { MapContainer, useMapEvents, ImageOverlay, LayersControl, Polygon, Popup, Rectangle, Circle, LayerGroup, Tooltip, Marker, useMapEvent } from "react-leaflet"; // Import Leaflet components for rendering the map and layers
import L from "leaflet"; // Import Leaflet library to access its utility methods

import "leaflet/dist/leaflet.css";
import 'react-leaflet-markercluster/styles'
import * as turf from "@turf/turf";
import MarkerClusterGroup from "react-leaflet-markercluster";

export default function View2D({ 
    observations,
    typeColors
 }) {
    let backgroundImageData = null;
    if(observations.find(observation => observation.backgroundImageData)) {
        backgroundImageData = observations.find(observation => observation.backgroundImageData).backgroundImageData
    }

    

    const getEventGeometries = () => {
        return Array.from(observations).map((observation, i) => Array.from(observation.geoObjects).map((geoObject, j) => {
            switch(geoObject.geometry.type) {
                case 'Polygon':
                    let polygon = turf.polygon([geoObject.geometry.coordinates]);
                    let centroid = turf.centroid(polygon);

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
                            center={centroid.geometry.coordinates}
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
                            color={"purple"}
                            weight={1} // Line thickness
                            opacity={1} // Line opacity
                            fillOpacity={0.65} // Fill opacity
                            center={geoObject.geometry.coordinates[0]}
                            radius={4}                            
                            crs={L.CRS.Simple}
                        >
                            <Tooltip>
                                <b>Type:</b> {geoObject.type}
                                {geoObject.customEntityData ? Object.entries(geoObject.customEntityData).map((item, i) => {
                                    return (
                                        <div key={i}><b>{item[0]}:</b> {item[1]}</div>
                                    )
                                }) : ""}
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
                default:
                    return "";
            }
        })).flat();
    };

    let geoObjectGeometries = getEventGeometries();

    return backgroundImageData ? (
        <MapContainer
            center={[-(backgroundImageData.height/2), backgroundImageData.width/2]}
            crs={L.CRS.Simple}
            style={{ height: "100%", width: "100%" }}
            minZoom={-2}
            maxZoom={5}
            zoom={-2}
            scrollWheelZoom={true}
        >
            {/* <MapEventHandlers onMoveEnd={updateMap}/> */}
            <ImageOverlay
                url={backgroundImageData.url}
                bounds={
                    [[(-backgroundImageData.height), 0],
                    [0, backgroundImageData.width]]
                }
                opacity={0.9}
            />
            <LayersControl position="topright">
                <LayersControl.Overlay checked name="Clustered geoobjects">
                    <LayerGroup>
                        <MarkerClusterGroup>
                            {geoObjectGeometries}
                        </MarkerClusterGroup>
                    </LayerGroup>
                </LayersControl.Overlay>    
                <LayersControl.Overlay name="Nonclustered geoobjects">
                    <LayerGroup>
                        {geoObjectGeometries}
                    </LayerGroup>
                </LayersControl.Overlay>
            </LayersControl>
        </MapContainer>
    ) : (
        <div>Map is not available.
        </div>
    )
};