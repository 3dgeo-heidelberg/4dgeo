import React from 'react';
import './Legend.css';

const Legend = ({ isConnected, colors }) => {
    // Render a message if not connected
    if (!isConnected) {
        return <div>Data is not available.</div>; 
    }

    return (
        <ul style={{ listStyle: 'none', padding: 0 }}>
            {Object.keys(colors).map((type) => (
                <li key={type} className="legend-item">
                    <span 
                        className="legend-color" 
                        style={{ backgroundColor: colors[type] }} 
                    ></span>
                    {type}
                </li>
            ))}
        </ul>
    );
};

export default Legend;
