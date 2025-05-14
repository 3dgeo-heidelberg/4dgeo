import { useEffect, useState } from 'react';
import Slider from '@mui/material/Slider';

import './ObservationSlider.css'

export default function ObservationSlider({ includedDateTimes, sliderRange, handleSliderRangeChange }) {
    return includedDateTimes.length > 1 ? (
        <div className='slider-container'>
            <Slider
                getAriaValueText={(dateTime) => {
                    let dateObj = new Date(dateTime)
                    return dateObj.toDateString();
                }}
                step={null}
                valueLabelDisplay="auto"
                marks={Array.from(includedDateTimes).map((dateTime, index, thisArray) => {
                    if (index === 0 || index === thisArray.length - 1) {
                        return {
                            value: dateTime.getTime(),
                            label: dateTime.toLocaleDateString() + "\n" + dateTime.toLocaleTimeString()
                        };   
                    } else {
                        return {
                            value: dateTime.getTime()
                        };
                    }
                })}
                min={Math.min(...includedDateTimes)}
                max={Math.max(...includedDateTimes)}
                value={sliderRange}
                onChangeCommitted={(_, newValue) => handleSliderRangeChange(newValue)}
                disableSwap
            />
        </div>
    ) : (
        <Slider disabled/>
    )
}