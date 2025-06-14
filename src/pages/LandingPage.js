import { Avatar, Box, Divider, Drawer, List, ListItem, ListItemButton, ListItemText, ListSubheader, Stack } from "@mui/material";
import { useEffect, useState } from "react";

import './LandingPage.css';
import DashboardCreation from "../components/dashboard-creation/DashboardCreation";
import LandingPageHeader from "../components/LandingPageHeader";

export default function LandingPage() {
  const [exampleDashboards, setExampleDashboards] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(1);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [drawerIsClosing, setDrawerIsClosing] = useState(false);
  const drawerWidth = 250;

  const [layout, setLayout] = useState([]);
  const [url, setUrl] = useState("");
  const [interval, setInterval] = useState(0);


  const handleDrawerClose = () => {
    setDrawerIsClosing(true);
    setMobileDrawerOpen(false);
  };

  const handleDrawerTransitionEnd = () => {
    setDrawerIsClosing(false);
  };

  const handleDrawerToggle = () => {
    if (!drawerIsClosing) {
      setMobileDrawerOpen(!mobileDrawerOpen);
    }
  };


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


  const drawer = (
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
          <ListItemButton
            key={index}
            selected={selectedTemplate === index}
            onClick={() => {
              handleTemplateSelection(example);
              setSelectedTemplate(index)
            }}
          >
            <Avatar variant="square" className="avatar" src={example.image}/>
            <ListItemText primary={example.title} />
          </ListItemButton>
        ))}
        <ListItemButton
          selected={selectedTemplate === exampleDashboards.length}
          onClick={() => {
            handleDashboardCreationSelection();
            setSelectedTemplate(exampleDashboards.length);
          }}
        >
          <Avatar variant="square" className="avatar" src="https://cdn-icons-png.flaticon.com/512/1250/1250615.png"/>
          <ListItemText primary="Start from scratch" />
        </ListItemButton>
      </List>
    </Stack>
  )


  return (
    <Box className="landing-page-container">
      {/* <Drawer
        variant="permanent"
        className="side-bar"
        sx={{ width: '15%', minWidth: 250 }}
      >
        
      </Drawer> */}
      <Box>
        <Drawer
          variant="temporary"
          open={mobileDrawerOpen}
          onTransitionEnd={handleDrawerTransitionEnd}
          onClose={handleDrawerClose}
          sx={{
            display: { xs: 'block', sm: 'none' },
            width: drawerWidth,
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth }
          }}
          className="side-bar"
          slotProps={{
            root: {
              keepMounted: true, // Better open performance on mobile.
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            width: drawerWidth,
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          className="side-bar"
          open
        >
          {drawer}
        </Drawer>
      </Box>
      
      <Box
        component={'main'}
        className="main-content"
      >
        <Stack
          spacing={2}
          className="content-stack"
        >
          <Box className="content-header">
            <LandingPageHeader handleDrawerToggle={handleDrawerToggle} />
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