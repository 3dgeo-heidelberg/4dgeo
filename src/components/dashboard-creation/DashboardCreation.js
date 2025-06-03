import { Paper, TextField, Button, Menu, MenuItem, Box } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import DashboardPreview from "./DashboardPreview";
import { useState } from "react";

import './DashboardCreation.css';
import { useNavigate, createSearchParams } from "react-router-dom";

const minimumModuleSizes = new Map([
    ["Chart", {w: 2, h: 2}],
    ["Legend", {w: 2, h: 2}],
    ["View2D", {w: 6, h: 3}],
    ["DateRangePicker", {w: 3, h: 1}],
    ["Slider", {w: 3, h: 1}]
  ])

function DashboardCreation({ layout, setLayout, url, setUrl, interval, setInterval }) {
    const navigate = useNavigate();
    // const [layout, setLayout] = useState([])
    const [counterForKey, setCounterForKey] = useState(0)
    // const [url, setUrl] = useState("")

    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = (event) => {
        addModuleToLayout(event.currentTarget.firstChild.textContent)
        setAnchorEl(null);
    };

    const addModuleToLayout = (moduleName) => {
        if (moduleName === "2D View") {
            moduleName = "View2D";
        }
        setLayout(layout.concat({
            i: "" + moduleName + "_" + counterForKey,
            x: Infinity,
            y: Infinity,
            w: minimumModuleSizes.get(moduleName).w,
            h: minimumModuleSizes.get(moduleName).h
        }));
        setCounterForKey(counterForKey + 1);
    }
    
    const onLayoutChange = (newLayout) => {
        setLayout(newLayout);
    }

    const handlePermalink = () => {
        const permaLink = new URL(window.location.origin + '/dashboard', window.location.origin);
        permaLink.searchParams.append("layout", JSON.stringify(layout));
        permaLink.searchParams.append("url", url);
        permaLink.searchParams.append("interval", interval);

        console.log("permalink", permaLink.href);
    }

    const handleGo = () => {
        navigate({
            pathname: "/dashboard",
            search: createSearchParams({
                layout: JSON.stringify(layout),
                url: url,
                interval: interval,
            }).toString()
        })
    }


    return (
        <Paper elevation={3} className="container">
            <div className="header">
                <h2 className="headline">Customize your Dashboard</h2>
                <Box className="input-area">
                    <TextField id="url-input" label="Link to your data source" variant="outlined" onChange={(event) => {
                            setUrl(event.target.value);
                        }} 
                        value={url}
                    />

                    <TextField id="interval-input" label="Refresh Interval - seconds" variant="outlined" type="number" onChange={(event) => {
                            setInterval(event.target.value);
                        }}
                        value={interval}
                    />
                    
                    <Button 
                        id="moduleSelectButton"
                        color="primary"
                        aria-label="add" 
                        variant="contained" 
                        onClick={handleClick}
                        aria-controls={open ? 'demo-positioned-menu' : undefined}
                        aria-haspopup="true"
                        aria-expanded={open ? 'true' : undefined} 
                    >
                        <AddIcon/>
                        Add Module
                    </Button>

                    <Menu
                        id="moduleSelect"
                        aria-labelledby="moduleSelectButton"
                        anchorEl={anchorEl}
                        open={open}
                        onClose={() => setAnchorEl(null)}
                        anchorOrigin={{
                            vertical: 'top',
                            horizontal: 'left',
                        }}
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'left',
                        }}
                    >
                        <MenuItem onClick={handleClose}>2D View</MenuItem>
                        <MenuItem onClick={handleClose}>Chart</MenuItem>
                        <MenuItem onClick={handleClose}>DateRangePicker</MenuItem>
                        <MenuItem onClick={handleClose}>Slider</MenuItem>
                    </Menu>
                </Box>
            </div>

            <div className="dashboard-preview">
                <DashboardPreview
                    layout={layout}
                    onLayoutChange={onLayoutChange}
                />
            </div>

            <div className="footer">
                <Button 
                    id=""
                    color="primary" 
                    variant="contained" 
                    onClick={handlePermalink}
                >
                    Permalink   
                </Button>

                <Button 
                    id=""
                    color="primary" 
                    variant="contained" 
                    onClick={handleGo}
                >
                    Go  
                </Button>
            </div>
        </Paper>
    );
};

export default DashboardCreation