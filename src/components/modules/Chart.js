import { Bar, BarChart, CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export default function Chart({ observations, valueKey }) {
    const observationsToBarData = (observations) => {
        return observations.map((observation, index) => {
            console.log("Observation: ", observation);
            if (!observation.customEntityData || !observation.customEntityData.has(valueKey)) {
                return {
                    name: index,
                    value: 0,
                }; 
            }
            return {
                name: index,
                value: observation.customEntityData.get(valueKey),
            };
        })
    }

    const data = observationsToBarData(observations);

    return (
        <ResponsiveContainer width="100%" height="100%">
            <LineChart width="90%" height="80%" data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="value" stroke="#8884d8" activeDot={{ r: 8 }} />
            </LineChart>
        </ResponsiveContainer>
    );
}