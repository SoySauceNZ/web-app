import React from 'react';
import { Container, Typography, Divider } from '@material-ui/core';
import BackButton from '../components/BackButton';
import CSP from '../assets/CSP.png';

const About = () => (
    <Container>
        <br />
        <Typography variant="h3">About Us</Typography>
        <center>
            <img src={CSP} alt="CSP" width="200" />
            <Typography variant="h4">Crash Severity Prediction</Typography>
            <Typography variant="h5">By team SoySauceNZ</Typography>
            <Typography>
                Neville, Cheng-Zhen, Feras, Young, Dylan and Sunny
            </Typography>
        </center>
        <br />
        <Divider />
        <br />
        <Typography>
            When new road infrastructure is built, it is important to measure
            the level of safety of the users on the road. In the case of our
            app, we have chosen to predict the severity of a crash at a
            particular location. To aid us in prediction we have chosen to use a
            machine learning model that is fed in weather, visibility and speed
            limit data from the Crash Analysis System managed by the NZTA. Using
            this model we will be able to predict whether a road in a new area
            will be safe in the event of a crash.
        </Typography>
        <BackButton />
    </Container>
);

export default About;
