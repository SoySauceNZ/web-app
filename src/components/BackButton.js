import React from 'react';
import { Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';
import CSP from '../assets/CSP.png';

const useStyles = makeStyles((theme) => ({
    backButton: {
        position: 'fixed',
        width: 100,
        height: 100,
        bottom: theme.spacing(4),
        right: theme.spacing(2),
        borderRadius: 50,
        background: 'white',
    },
}));

const BackButton = () => {
    const classes = useStyles();
    return (
        <Button
            component={Link}
            to="/"
            variant="contained"
            className={classes.backButton}
        >
            <img alt="CSP" src={CSP} style={{ height: 60, width: 60 }} />
        </Button>
    );
};

export default BackButton;
