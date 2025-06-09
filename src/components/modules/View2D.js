import { MapContainer, ImageOverlay, LayersControl, Polygon, Rectangle, Circle, LayerGroup, Tooltip } from "react-leaflet"; // Import Leaflet components for rendering the map and layers
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

    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp', '.tiff', '.svg'];

    // Helper: Check if string ends with known image extensions
    const isImageUrlOrPath = (str) => {
        try {
        const url = new URL(str);
        return imageExtensions.some(ext => url.pathname.toLowerCase().endsWith(ext));
        } catch {
        // Not a valid URL, maybe just a local path
        return imageExtensions.some(ext => str.toLowerCase().endsWith(ext));
        }
    };

    // Helper: Check for data:image/...;base64,... format
    const isBase64DataUri = (str) => {
        return /^data:image\/[a-zA-Z]+;base64,/.test(str);
    };

    // Helper: Check if it's a raw base64 string (not prefixed)
    const isRawBase64Image = (str) => {
        try {
        const decoded = atob(str);
        // crude check: should be reasonably long and contain binary-like characters
        return decoded.length > 100 && /[\x00-\x08\x0E-\x1F]/.test(decoded.slice(0, 100));
        } catch {
        return false;
        }
    };

    const getImageSrc = (imageData) => {
        if (isImageUrlOrPath(imageData) || isBase64DataUri(imageData)) {
            return imageData;
        } else if (isRawBase64Image(imageData)) {
            return `data:image/ong;base64,${imageData}`;
        } else {
            console.error("Invalid image data format. Expected a valid URL, base64 data URI, or raw base64 string.");
        }
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
                url={getImageSrc(backgroundImageData.url)}
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