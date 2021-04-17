import React, { useState, memo, useEffect } from 'react';
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
import PermMediaIcon from '@material-ui/icons/PermMedia';
import InfoIcon from '@material-ui/icons/Info';

import CSP from '../assets/CSP.png';
import HeatMap from '../components/HeatMap';
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
    'Light rain': 'LR',
    'Heavy rain': 'HR',
};

const lightingConditions = {
    'Bright sun': '1.0',
    Dark: '0.0',
    'In-between': '0.5',
};

const weatherArray = Object.keys(weatherOptions);
const lightingArray = Object.keys(lightingConditions);

const Home = () => {
    const classes = useStyles();
    const [state, setState] = useState({
        weather: weatherArray[0],
        lighting: lightingArray[0],
        speedLimit: 50,
        // eslint-disable-next-line
        data:
            'https://raw.githubusercontent.com/SoySauceNZ/geojson/main/F_0.0_100.geojson',
    });

    const generateDataUrl = () => {
        const baseUrl = process.env.REACT_APP_GEOJSON_BASE_URL;
        const weather = weatherOptions[state.weather];
        const lighting = lightingConditions[state.lighting];
        const filename = `${weather}_${lighting}_${state.speedLimit}`;
        return `${baseUrl}/${filename}.geojson`;
    };

    const handleWeatherChange = (e) => {
        setState((prevState) => ({
            ...prevState,
            weather: e.target.value,
            data: generateDataUrl(),
        }));
    };

    const handleLightingChange = (e) => {
        setState((prevState) => ({
            ...prevState,
            lighting: e.target.value,
            data: generateDataUrl(),
        }));
    };

    const handleSpeedLimitChange = (e, value) => {
        setState((prevState) => ({
            ...prevState,
            speedLimit: value,
        }));
    };

    const handleIlluminationChangeCommited = (e, value) => {
        setState((prevState) => ({
            ...prevState,
            speedLimit: value,
            data: generateDataUrl(),
        }));
    };

    return (
        <>
            <Box className={classes.map}>
                <HeatMap data={state.data} />
            </Box>
            <Container maxWidth="sm">
                <Paper elevation={12} className={classes.controls}>
                    <AccordionMenu
                        classes={classes}
                        weather={state.weather}
                        handleWeatherChange={handleWeatherChange}
                        lighting={state.lighting}
                        handleLightingChange={handleLightingChange}
                        speedLimit={state.speedLimit}
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
        const [image, setImage] = useState(null);
        const history = useHistory();

        useEffect(() => {
            axios.get(`${process.env.REACT_APP_API}/list`).then(({ data }) => {
                setImage(data[data.length - 1]);
            });
        }, []);

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
                                max={100}
                                min={50}
                                defaultValue={50}
                                step={50}
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

                                {image !== null ? (
                                    <center>
                                        <Typography>
                                            Last Uploaded Image to Server
                                        </Typography>

                                        <Button
                                            component={Link}
                                            to={`/upload?file=${image}`}
                                            style={{
                                                borderRadius: 10,
                                                padding: 0,
                                                overflow: 'hidden',
                                                width: '60%',
                                            }}
                                        >
                                            <img
                                                alt={image}
                                                src={`${process.env.REACT_APP_API}/images/${image}`}
                                                style={{
                                                    width: '100%',
                                                }}
                                            />
                                        </Button>

                                        <Typography>
                                            More tab below for more History
                                        </Typography>
                                    </center>
                                ) : null}
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
                <img alt="CSP" src={CSP} style={{ height: 60, width: 60 }} />
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
