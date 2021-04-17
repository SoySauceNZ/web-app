import React, { useState } from 'react';
import { Grid, Typography, withStyles } from '@material-ui/core';
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
    'Hail or Sleet': 'HS',
    'Light rain': 'LR',
    'Heavy rain': 'HR',
    'Mist or Fog': 'MF',
    Snow: 'S',
};

const lightingConditions = {
    'Bright sun': 'B',
    Dark: 'D',
    Overcast: 'O',
    Twilight: 'T',
};

const weatherArray = Object.keys(weatherOptions);
const lightingArray = Object.keys(lightingConditions);

const Upload = ({ classes }) => {
    const [weather, setWeather] = useState(weatherArray[0]);
    const [lighting, setLighting] = useState(lightingArray[0]);
    const [speedLimit, setSpeedLimit] = useState(50);

    const handleWeatherChange = (e) => {
        setWeather(e.target.value);
    };
    const handleLightingChange = (e) => {
        setLighting(e.target.value);
    };

    const handleSpeedLimitChange = (e, value) => {
        setSpeedLimit(value);
    };

    const handleIlluminationChangeCommited = (e, value) => {
        // TODO: Update the heatmap
    };

    return (
        <Grid container>
            <Grid item sm={6}>
                <img
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
                <InputSelector
                    label="Lighting"
                    id="lighting-selector"
                    value={lighting}
                    onChange={handleLightingChange}
                    array={lightingArray}
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
            </Grid>
        </Grid>
    );
};

export default withStyles(styles)(Upload);
