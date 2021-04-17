import React, { useState, useEffect } from 'react';
import { Grid, Typography, withStyles } from '@material-ui/core';
import axios from 'axios';
import { useLocation } from 'react-router';

import example from '../assets/191.png';
import InputSelector from '../components/InputSelector';
import SliderSelector from '../components/SliderSelector';

const styles = (theme) => ({
    cardTitle: {
        marginTop: theme.spacing(1),
    },
    sliderLabel: {
        fontSize: 12,
        marginTop: theme.spacing(2),
    },
    options: {
        padding: theme.spacing(4),
    },
});

const weatherOptions = {
    Fine: 'F',
    'Light rain': 'LR',
    'Heavy rain': 'HR',
};

const weatherArray = Object.keys(weatherOptions);

const useQuery = () => new URLSearchParams(useLocation().search);

const Upload = ({ classes }) => {
    const [weather, setWeather] = useState(weatherArray[0]);
    const [lighting, setLighting] = useState(0.5);
    const [speedLimit, setSpeedLimit] = useState(50);
    const [severity, setSeverity] = useState(null);

    const query = useQuery();

    const handleWeatherChange = (e) => {
        setWeather(e.target.value);
    };

    const handleLightingChange = (e, value) => {
        setLighting(value);
    };

    const handleSpeedLimitChange = (e, value) => {
        setSpeedLimit(value);
    };

    useEffect(() => {
        axios
            .post(`${process.env.REACT_APP_API}/predict`, {
                filename: query.get('file'),
                weather: weatherOptions[weather],
                brightness: lighting,
                speed: speedLimit,
            })
            .then((res) => {
                setSeverity(res.data.severity);
            })
            .catch((err) => {
                alert(`Prediction: ${err}`);
                console.log(err);
            });
    }, [weather, lighting, speedLimit, query]);

    const handleIlluminationChangeCommited = (e, value) => {
        // TODO: Update the heatmap
    };

    return (
        <Grid container>
            <Grid item sm={6}>
                <img
                    alt="uploaded"
                    src={example}
                    style={{
                        background: 'black',
                        width: '100%',
                        height: 'auto',
                    }}
                />
            </Grid>
            <Grid className={classes.options} item sm={6}>
                <Typography className={classes.cardTitle} variant="h5">
                    Crash Severity
                </Typography>
                <br />
                <InputSelector
                    label="Weather"
                    id="weather-selector"
                    value={weather}
                    onChange={handleWeatherChange}
                    array={weatherArray}
                />
                <br />
                <SliderSelector
                    className={classes.sliderLabel}
                    label="Lighting"
                    id="lighting-selector"
                    max={1.0}
                    min={0.0}
                    defaultValue={0.5}
                    step={0.1}
                    value={lighting}
                    onChange={handleLightingChange}
                    onChangeCommitted={handleIlluminationChangeCommited}
                />
                <br />
                <SliderSelector
                    className={classes.sliderLabel}
                    label="Speed (km/h)"
                    id="speed-selector"
                    max={100}
                    min={0}
                    defaultValue={50}
                    step={10}
                    value={speedLimit}
                    onChange={handleSpeedLimitChange}
                    onChangeCommitted={handleIlluminationChangeCommited}
                />
                <Typography className={classes.cardTitle} variant="h6">
                    Severity: {severity}
                </Typography>
            </Grid>
        </Grid>
    );
};

export default withStyles(styles)(Upload);
