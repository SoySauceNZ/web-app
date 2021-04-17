import React, { useState, memo } from 'react';
import {
    Box,
    Button,
    Container,
    Divider,
    Grid,
    Paper,
    Typography,
    Accordion,
    AccordionSummary,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Popover,
} from '@material-ui/core';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import { Link, useHistory } from 'react-router-dom';
import axios from 'axios';

import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import TrafficIcon from '@material-ui/icons/Traffic';
import PermMediaIcon from '@material-ui/icons/PermMedia';
import InfoIcon from '@material-ui/icons/Info';

import HeatMap from '../components/HeatMap';
import trees from '../assets/trees.geojson';
import InputSelector from '../components/InputSelector';
import SliderSelector from '../components/SliderSelector';

const useStyles = makeStyles((theme) => ({
    map: {
        height: '100vh',
        width: '100vw',
    },
    controls: {
        position: 'fixed',
        top: theme.spacing(2),
        left: theme.spacing(2),
        minWidth: '200px',
    },
    cardTitle: {
        margin: theme.spacing(1),
    },
    sliderLabel: {
        fontSize: 13,
        marginTop: theme.spacing(1),
    },
    logoButton: {
        position: 'absolute',
        width: 100,
        height: 100,
        bottom: theme.spacing(4),
        right: theme.spacing(2),
        borderRadius: 50,
        background: 'white',
    },
}));

const CustomAccordion = withStyles({
    root: {
        border: '1px solid rgba(0, 0, 0, .125)',
        boxShadow: 'none',
        '&:not(:last-child)': {
            borderBottom: 0,
        },
        '&:before': {
            display: 'none',
        },
        '&$expanded': {
            margin: 'auto',
        },
    },
    content: {
        '&$expanded': {
            margin: '12px 0',
        },
    },
    expanded: {},
})(Accordion);

const severity = {
    'Non-Injury Crash': '0.0',
    'Minor Crash': '0.33',
    'Serious Crash': '0.66',
    'Fatal Crash': '1.0',
};

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

const Home = () => {
    const classes = useStyles();
    const [weather, setWeather] = useState(weatherArray[0]);
    const [lighting, setLighting] = useState(lightingArray[0]);
    const [speedLimit, setSpeedLimit] = useState(60);

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
        <>
            <Box className={classes.map}>
                <HeatMap center={[-79.999732, 40.4374]} data={trees} />
            </Box>
            <Container maxWidth="sm">
                <Paper elevation={12} className={classes.controls}>
                    <AccordionMenu
                        classes={classes}
                        weather={weather}
                        handleWeatherChange={handleWeatherChange}
                        lighting={lighting}
                        handleLightingChange={handleLightingChange}
                        speedLimit={speedLimit}
                        handleSpeedLimitChange={handleSpeedLimitChange}
                        handleIlluminationChangeCommited={
                            handleIlluminationChangeCommited
                        }
                    />
                </Paper>
                <LogoButton className={classes.logoButton} />
            </Container>
        </>
    );
};

const AccordionMenu = memo(
    ({
        classes,
        weather,
        handleWeatherChange,
        lighting,
        handleLightingChange,
        speedLimit,
        handleSpeedLimitChange,
        handleIlluminationChangeCommited,
    }) => {
        const [expanded, setExpanded] = useState('panel1');
        const history = useHistory();

        const handlePanelChange = (panel) => (event, isExpanded) => {
            setExpanded(isExpanded ? panel : false);
        };

        const onFileChange = (event) => {
            const file = event.target.files[0];
            const formData = new FormData();
            formData.append('file', file);
            const config = {
                headers: { 'Content-Type': 'multipart/form-data' },
            };

            axios
                .post(`${process.env.REACT_APP_API}/upload`, formData, config)
                .then((res) => {
                    history.push(`/upload?file=${res.data.filename}`);
                })
                .catch((err) => {
                    alert(`Upload Error: ${err}`);
                    console.log(err);
                });
        };

        return (
            <>
                <CustomAccordion
                    expanded={expanded === 'panel1'}
                    onChange={handlePanelChange('panel1')}
                >
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                    >
                        <Typography className={classes.cardTitle} variant="h6">
                            Crash Severity
                        </Typography>
                    </AccordionSummary>

                    <Box px={4}>
                        <Grid container spacing={2} direction="column">
                            <InputSelector
                                label="Weather"
                                id="weather-selector"
                                value={weather}
                                onChange={handleWeatherChange}
                                array={weatherArray}
                            />
                            <InputSelector
                                label="Lighting"
                                id="lighting-selector"
                                value={lighting}
                                onChange={handleLightingChange}
                                array={lightingArray}
                            />
                            <SliderSelector
                                className={classes.sliderLabel}
                                label="Speed (km/h)"
                                id="speed-selector"
                                max={120}
                                min={0}
                                defaultValue={60}
                                step={10}
                                value={speedLimit}
                                onChange={handleSpeedLimitChange}
                                onChangeCommitted={
                                    handleIlluminationChangeCommited
                                }
                            />
                            <Divider style={{ margin: 10 }} />
                            <Grid style={{ maxWidth: 300 }}>
                                <Typography>
                                    Upload your own 500x500 image to predict
                                    crash severity
                                </Typography>
                                <br />
                                <form>
                                    <input
                                        accept="image/*"
                                        className={classes.input}
                                        style={{ display: 'none' }}
                                        id="raised-button-file"
                                        multiple
                                        type="file"
                                        onChange={onFileChange}
                                    />
                                    <label htmlFor="raised-button-file">
                                        <center>
                                            <Button
                                                variant="contained"
                                                component="span"
                                                color="primary"
                                            >
                                                Upload
                                            </Button>
                                        </center>
                                    </label>
                                </form>
                                <br />
                            </Grid>
                            <br />
                        </Grid>
                    </Box>
                </CustomAccordion>
                <CustomAccordion
                    expanded={expanded === 'panel2'}
                    onChange={handlePanelChange('panel2')}
                >
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel2a-content"
                        id="panel2a-header"
                    >
                        <Typography className={classes.cardTitle} variant="h6">
                            More
                        </Typography>
                    </AccordionSummary>
                    <List>
                        <ListItem
                            button
                            component={Link}
                            to="/history"
                            key="Upload History"
                        >
                            <ListItemIcon>
                                <PermMediaIcon />
                            </ListItemIcon>
                            <ListItemText primary="Upload History" />
                        </ListItem>
                        <ListItem
                            button
                            component={Link}
                            to="/about"
                            key="About us"
                        >
                            <ListItemIcon>
                                <InfoIcon />
                            </ListItemIcon>
                            <ListItemText primary="About SoySauceNZ" />
                        </ListItem>
                    </List>
                </CustomAccordion>
            </>
        );
    },
);

const LogoButton = memo(({ className }) => {
    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };
    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

    return (
        <>
            <Button
                aria-describedby={id}
                variant="contained"
                className={className}
                onClick={handleClick}
            >
                <TrafficIcon style={{ height: 60, width: 60 }} />
            </Button>
            <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
                transformOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
            >
                <Container style={{ margin: 10 }}>
                    <Typography>
                        v0.0.1 alpha.{' '}
                        <Link target="_blank" to="//github.com/SoySauceNZ">
                            SoySauseNZ
                        </Link>{' '}
                        2021
                    </Typography>
                    <Divider />
                    <Typography>
                        Based on Maxar satelite images and{' '}
                        <Link>CAS Open Data</Link>
                    </Typography>
                    <Typography>
                        <Link
                            target="_blank"
                            to="//www.mbie.govt.nz/science-and-technology/science-and-innovation/international-opportunities/new-zealand-r-d/innovative-partnerships/takiwaehere-the-geospatial-hackathon/"
                        >
                            TakiWaehere – NZ Geospatial Hackathon
                        </Link>
                    </Typography>
                </Container>
            </Popover>
        </>
    );
});

export default Home;
