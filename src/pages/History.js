import React, { useEffect, useState } from 'react';
import {
    Container,
    Grid,
    Button,
    Typography,
    Divider,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import axios from 'axios';
import { Link } from 'react-router-dom';
import BackButton from '../components/BackButton';

const useStyles = makeStyles((theme) => ({
    cardButton: {
        borderRadius: 10,
        padding: 0,
        overflow: 'hidden',
    },
    cardImage: {
        maxWidth: '100%',
        maxHeight: '100%',
    },
}));

const History = () => {
    const [list, setList] = useState([]);
    const classes = useStyles();
    useEffect(() => {
        axios.get(`${process.env.REACT_APP_API}/list`).then((res) => {
            setList(res.data);
        });
    }, []);

    return (
        <Container>
            <br />
            <Typography variant="h3">Upload History</Typography>
            <br />
            <Divider />
            <br />
            <Grid container spacing={3}>
                {list.map((image) => (
                    <Grid button key={image} item xs={6} sm={3}>
                        <Button
                            component={Link}
                            to={`/upload?file=${image}`}
                            className={classes.cardButton}
                        >
                            <img
                                alt={image}
                                src={`${process.env.REACT_APP_API}/images/${image}`}
                                className={classes.cardImage}
                            />
                        </Button>
                    </Grid>
                ))}
            </Grid>
            <BackButton />
        </Container>
    );
};

export default History;
