import React from 'react';
import { Grid, InputLabel, Slider } from '@material-ui/core';

const SliderSelector = ({
    className,
    label,
    max,
    min,
    defaultValue,
    step,
    value,
    onChange,
    onChangeCommitted,
}) => (
    <Grid item xs>
        <InputLabel className={className}>{label}</InputLabel>
        <Slider
            defaultValue={defaultValue}
            step={step}
            min={min}
            max={max}
            marks={[
                {
                    value: min,
                    label: min,
                },
                {
                    value: max,
                    label: max,
                },
            ]}
            valueLabelDisplay="auto"
            value={value}
            onChange={onChange}
            onChangeCommitted={onChangeCommitted}
        />
    </Grid>
);

export default SliderSelector;
