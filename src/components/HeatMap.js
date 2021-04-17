import React, { useEffect, useRef, memo } from 'react';
import { Box, withStyles } from '@material-ui/core';
import mapboxgl from 'mapbox-gl/dist/mapbox-gl-csp';
// eslint-disable-next-line
import MapboxWorker from 'worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker';

mapboxgl.workerClass = MapboxWorker;
mapboxgl.accessToken =
    'pk.eyJ1IjoibmVlZHNzb3lzYXVjZSIsImEiOiJja2RyYzBrNjUxZW01MnJta3V1YXN0eXAyIn0.opUlsiw-E89nF-NHh54QkA';

const styles = {
    mapContainer: {
        height: '100%',
        width: '100%',
    },
};

const HeatMap = ({ classes, data, type, center, zoom }) => {
    const mapContainer = useRef();

    useEffect(() => {
        const map = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/mapbox/streets-v11',
            center,
            zoom,
        });

        map.addControl(new mapboxgl.NavigationControl());
        map.addControl(new mapboxgl.ScaleControl());
        map.addControl(
            new mapboxgl.GeolocateControl({
                positionOptions: {
                    enableHighAccuracy: true,
                },
            }),
        );

        map.on('load', () => {
            map.addSource('heatmap-data', {
                type,
                data,
            });

            map.addLayer(
                {
                    id: 'trees-heat',
                    type: 'heatmap',
                    source: 'heatmap-data',
                    maxzoom: 15,
                    paint: {
                        'heatmap-weight': {
                            property: 'severity',
                            type: 'exponential',
                            stops: [
                                [0, 0],
                                [0.1, 0.2],
                                [0.2, 0.4],
                                [0.4, 0.8],
                                [0.8, 1.6],
                                [1, 3.2],
                            ],
                        },
                        'heatmap-intensity': {
                            stops: [
                                [11, 1],
                                [15, 1],
                            ],
                        },
                        'heatmap-radius': {
                            stops: [
                                [11, 40],
                                [15, 100],
                                [30, 250],
                            ],
                        },
                        'heatmap-opacity': {
                            default: 1,
                            stops: [
                                [14, 0.8],
                                [20, 0],
                            ],
                        },
                    },
                },
                'waterway-label',
            );

            map.addLayer(
                {
                    id: 'trees-point',
                    type: 'circle',
                    source: 'heatmap-data',
                    minzoom: 14,
                    paint: {
                        'circle-radius': {
                            property: 'severity',
                            type: 'exponential',
                            stops: [
                                [{ zoom: 15, value: 1 }, 5],
                                [{ zoom: 15, value: 62 }, 10],
                                [{ zoom: 22, value: 1 }, 20],
                                [{ zoom: 22, value: 62 }, 50],
                            ],
                        },
                        'circle-color': {
                            property: 'severity',
                            type: 'exponential',
                            stops: [
                                [0, 'rgba(236,222,239,0)'],
                                [10, 'rgb(236,222,239)'],
                                [20, 'rgb(208,209,230)'],
                                [30, 'rgb(166,189,219)'],
                                [40, 'rgb(103,169,207)'],
                                [50, 'rgb(28,144,153)'],
                                [60, 'rgb(1,108,89)'],
                            ],
                        },
                        'circle-stroke-color': 'white',
                        'circle-stroke-width': 1,
                        'circle-opacity': {
                            stops: [
                                [14, 0],
                                [15, 1],
                            ],
                        },
                    },
                },
                'waterway-label',
            );
        });

        return () => map.remove();
    }, [center, data, type, zoom]);

    return <Box className={classes.mapContainer} ref={mapContainer} />;
};

HeatMap.defaultProps = {
    type: 'geojson',
    center: [174.80559255221153, -36.9288161777414], // [longitude, latitude],
    zoom: 10,
};

export default memo(withStyles(styles)(HeatMap));
