import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { useState } from "react";
import { Bar, BarChart, Brush, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import './Chart.css';

export default function Chart({ observations, typeColors }) {
    const [valueKey, setValueKey] = useState("");

    const getCustomDataFields = () => {
        const customDataFields = new Set();
        observations.forEach((observation) => {
            observation.geoObjects.forEach((geoObject) => {
                if (geoObject.customEntityData) {
                    Object.keys(geoObject.customEntityData).forEach((key) => {
                        customDataFields.add(key);
                    });
                }
            });
        });
        return Array.from(customDataFields);
    }

    const handleFieldSelected = (event) => { 
        setValueKey(event.target.value);
    }


    const observationsToBarData = (observations) => {
        if (valueKey === "") {
            return {};
        }
        return observations.map((observation, index) => {
            const typeSums = {
                name: index
            };

            typeColors.keys().forEach((type) => {
                typeSums[type] = 0;
            })

            observation.geoObjects.forEach((geoObject) => {
                const { type, customEntityData } = geoObject;
                const value = customEntityData[valueKey];

                typeSums[type] += value;
            })
            
            return typeSums
        })
    }

    const data = observationsToBarData(observations);

    return (
        <div className='chart-module-container'>
            <div className="field-selector">
                <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                    <InputLabel id="field-select-label">Field</InputLabel>
                    <Select
                        labelId="field-select-label"
                        id="field-select"
                        value={valueKey}
                        label="Field"
                        onChange={handleFieldSelected}
                    >
                        <MenuItem value="">
                        <em>None</em>
                        </MenuItem>
                        {getCustomDataFields().map((field) => (
                            <MenuItem key={field} value={field}>{field}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </div>

            <div className='chart-container'>
                <ResponsiveContainer width="95%" height="95%" className={"chart-responsive-container"}>
                    { valueKey === "" ? ("") : (
                        <BarChart width="85%" height="70%" data={data} className='chart'>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            {Array.from(typeColors).map(([type, color]) => {
                                console.log("type", type, "color", color);
                                return <Bar key={type.toString()} dataKey={type.toString()} stackId={"a"} fill={color} />
                            })}
                            <Brush dataKey="name" height={30} stroke="#8884d8" />
                        </BarChart>
                    )}
                </ResponsiveContainer>
            </div>
        </div>        
    );
}