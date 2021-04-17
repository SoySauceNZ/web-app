import React from 'react';
import { Grid, TextField, MenuItem } from '@material-ui/core';

const InputSelector = ({ label, id, value, onChange, array }) => (
    <Grid item xs>
        <TextField
            id={id}
            select
            label={label}
            value={value}
            onChange={onChange}
            fullWidth
        >
            {array.map((condition) => (
                <MenuItem value={condition} key={condition}>
                    {condition}
                </MenuItem>
            ))}
        </TextField>
    </Grid>
);

export default InputSelector;
