import { Grid, Typography, withStyles, Box } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router';
import example from '../assets/191.png';
import BackButton from '../components/BackButton';
import InputSelector from '../components/InputSelector';
import SliderSelector from '../components/SliderSelector';
import { weatherOptions } from './Home';

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

const severityBreakpoints = {
    'Non-Injury Crash': '0.0',
    'Minor Crash': '0.33',
    'Serious Crash': '0.66',
    'Fatal Crash': '1.0',
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
            <Grid item xs={12} sm={6}>
                <img
                    alt="uploaded"
                    src={example}
                    style={{
                        background: 'black',
                        width: '100%',
                        height: 'auto',
                        borderRadius: 10,
                        margin: 10,
                    }}
                />
            </Grid>
            <Grid className={classes.options} item xs={12} sm={6}>
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
                <Typography
                    className={classes.cardTitle}
                    variant="h6"
                    align="center"
                >
                    Severity: {severity}
                </Typography>
                <Box pt={2}>
                    <TableContainer component={Paper}>
                        <Table
                            className={classes.table}
                            aria-label="simple table"
                        >
                            <TableHead>
                                <TableRow>
                                    <TableCell>Severity</TableCell>
                                    <TableCell>Prediction</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {Object.keys(severityBreakpoints).map((key) => (
                                    <TableRow key={key}>
                                        <TableCell>{key}</TableCell>
                                        <TableCell>
                                            {severityBreakpoints[key]}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
            </Grid>
            <BackButton />
        </Grid>
    );
};

export default withStyles(styles)(Upload);
