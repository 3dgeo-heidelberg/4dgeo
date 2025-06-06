import { MapContainer, ImageOverlay, LayersControl, Polygon, Rectangle, Circle, LayerGroup, Tooltip } from "react-leaflet"; // Import Leaflet components for rendering the map and layers
import L, { layerGroup } from "leaflet"; // Import Leaflet library to access its utility methods

import "leaflet/dist/leaflet.css";
import 'react-leaflet-markercluster/styles'
import { useRef } from "react";
import 'leaflet.markercluster';
import 'Leaflet.Deflate'
import { clusterEach } from "@turf/turf";


export default function View2D({ 
    observations,
    typeColors
 }) {
    const clusteredLayer = useRef(null);
    const normalLayer = useRef(null);
    const deflatedLayer = useRef(null);

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

    L.polygonClusterable = L.Polygon.extend({
        _originalInitialize: L.Polygon.prototype.initialize,

        initialize: function (bounds, options) {
            this._originalInitialize(bounds, options);
            this._latlng = this.getBounds().getCenter(); // Define the polygon "center".
        },

        getLatLng: function () {
            return this._latlng;
        },

        // dummy method.
        setLatLng: function () {}
    })

    const getEventGeometries = () => {
        if (clusteredLayer.current && normalLayer.current) {
            clusteredLayer.current.clearLayers();
            normalLayer.current.clearLayers();
            
            console.log("rendering: ", observations)
            var objectsToCluster = L.markerClusterGroup();


            var deflateFeatures = L.deflate({minSize: 20, markerLayer: objectsToCluster});
            deflateFeatures.addTo(clusteredLayer.current);
            // objectsToCluster.addTo(clusteredLayer.current);
            Array.from(observations).map((observation, i) => Array.from(observation.geoObjects).map((geoObject, j) => {
                switch(geoObject.geometry.type) {
                    case 'Polygon':
                        console.log("Polygon")
                        const leafletPolygon = new L.polygonClusterable(
                            geoObject.geometry.coordinates, {
                                color: typeColors.get(geoObject.type) || "black",
                                weight: 2,
                                opacity: 1,
                                fillOpacity: 0.65,
                                crs: L.CRS.Simple
                            }
                        ).bindTooltip(
                            `<b>Type:</b> ${geoObject.type}<br>` +
                            (geoObject.customEntityData ? Object.entries(geoObject.customEntityData).map((item, i) => {
                                return "<div key={" + i + "}><b>" + item[0] + ":</b> " + item[1] + "</div>";
                            }) : ""));
                        // leafletPolygon.addTo(normalLayer.current);
                        // objectsToCluster.addLayer(leafletPolygon);
                        leafletPolygon.addTo(deflateFeatures);
                        // leafletPolygon.addTo(layerToDeflate);
                        return;
                    case 'Point':
                        console.log("point")
                        const leafletCircle = L.circle(
                            geoObject.geometry.coordinates[0], {
                                color: typeColors.get(geoObject.type) || "black",
                                weight: 1,
                                opacity: 1,
                                fillOpacity: 0.65,
                                radius: 4,
                                crs: L.CRS.Simple
                            }
                        ).bindTooltip(
                            `<b>Type:</b> ${geoObject.type}<br>` +
                            (geoObject.customEntityData ? Object.entries(geoObject.customEntityData).map((item, i) => {
                                return "<div key={" + i + "}><b>" + item[0] + ":</b> " + item[1] + "</div>";
                            }) : "")
                        ).addTo(normalLayer.current);
                        leafletCircle.addTo(objectsToCluster);
                        // objectsToCluster.addLayer(leafletCircle);
                        return;
                }
            }));

            // objectsToCluster.addTo(clusteredLayer.current);
            // layerToDeflate.addTo(deflatedLayer.current);
            
        }
    };

    if(clusteredLayer.current && normalLayer.current) {
        getEventGeometries();
    }
    

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
                    <LayerGroup ref={clusteredLayer} />
                </LayersControl.Overlay>
                <LayersControl.Overlay name="Nonclustered geoobjects">
                    <LayerGroup ref={normalLayer} />
                </LayersControl.Overlay>
                {/* <LayersControl.Overlay name="Deflated geoobjects">
                    <LayerGroup ref={deflatedLayer} />
                </LayersControl.Overlay> */}
            </LayersControl>
        </MapContainer>
    ) : (
        <div>Map is not available.
        </div>
    )
};