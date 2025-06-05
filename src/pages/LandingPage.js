import { Avatar, Box, Divider, Drawer, List, ListItem, ListItemText, ListSubheader, Stack } from "@mui/material";
import { useEffect, useState } from "react";

import './LandingPage.css';
import DashboardCreation from "../components/dashboard-creation/DashboardCreation";
import LandingPageHeader from "../components/LandingPageHeader";

export default function LandingPage() {
  const [exampleDashboards, setExampleDashboards] = useState([]);

  const [layout, setLayout] = useState([]);
  const [url, setUrl] = useState("");
  const [interval, setInterval] = useState(0);


  async function fetchExampleDashboards() {
    console.log("Fetching example dashboards", window.location.href);
    const json = await (await fetch(`custom/example_dashboards/example_dashboards.json`, {
      headers : { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
       }
    })).json();
    setExampleDashboards(json.example_dashboards);
  }

  useEffect(() => {
    fetchExampleDashboards();
  }, []);


  const handleTemplateSelection = (example) => {
    setLayout(example.layout);
    setUrl(example.url);
    setInterval(example.interval);


    // navigate({
    //   pathname: "/dashboard",
    //   search: new URLSearchParams({
    //     layout: JSON.stringify(example.layout),
    //     url: example.url,
    //     interval: example.interval,
    //   }).toString()
    // });
  };

  const handleDashboardCreationSelection = () => {
    setLayout([]);
    setUrl("");
    setInterval(0);
  }

  const sideBarContent = [
    {
      kind: 'header',
      title: 'Example Dashboards'
    }
  ]

  exampleDashboards.forEach((example) => {
    sideBarContent.push({
      segment: example.title,
      title: example.title,
    });
  });


  return (
    <Box className="landing-page-container">
      {/* <AppBar className="header" position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <Typography variant="h6" noWrap component="div">
            4DGeo Dashboard
          </Typography>
        </Toolbar>
      </AppBar> */}
      <Drawer
        variant="permanent"
        className="side-bar"
        sx={{ width: '15%', minWidth: 250 }}
      >
        <Stack className="example-dashboard-list">
          <List dense>
            <ListItem>
              <Avatar className="avatar" src="/4dgeo/3dgeo.ico" alt="4DGeo Logo" />
              <ListItemText primary="4DGeo Dashboard" />
            </ListItem>
          </List>
          <Divider />
          <List dense subheader={
              <ListSubheader component="div" id="subheader-templates">
                Select a template
              </ListSubheader>
            }
          >
            {exampleDashboards.map((example, index) => (
              <ListItem
                key={index}
                button
                onClick={() => handleTemplateSelection(example)}
                selected={index === 0}
              >
                <Avatar variant="square" className="avatar" src={example.image}/>
                <ListItemText primary={example.title} />
              </ListItem>
            ))}
            <ListItem
              button
              onClick={handleDashboardCreationSelection}
            >
              <Avatar variant="square" className="avatar" src="https://cdn-icons-png.flaticon.com/512/1250/1250615.png"/>
              <ListItemText primary="Start from scratch" />
            </ListItem>
          </List>
        </Stack>
      </Drawer>
      
      <Box
        component={'main'}
        className="main-content"
      >
        <Stack
          spacing={2}
          className="content-stack"
        >
          <Box className="content-header">
            <LandingPageHeader />
          </Box>
          
          <Divider />
          <DashboardCreation
            className="dashboard-creation"
            layout={layout}
            setLayout={setLayout}
            url={url}
            setUrl={setUrl}
            interval={interval}
            setInterval={setInterval}
          />
        </Stack>
      </Box>
    </Box>
  )
}