import { AppBar, Avatar, Box, Divider, Drawer, List, ListItem, ListItemText, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppProvider } from "@toolpad/core/AppProvider";

import './LandingPage.css';
import DashboardCreation from "../components/dashboard-creation/DashboardCreation";
import LandingPageHeader from "../components/LandingPageHeader";
import { Toolbar } from "react-aria-components";

export default function LandingPage() {
  const navigate = useNavigate();

  const [exampleDashboards, setExampleDashboards] = useState([]);


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


  const handleCardSelection = (example) => {
    navigate({
      pathname: "/dashboard",
      search: new URLSearchParams({
        layout: JSON.stringify(example.layout),
        url: example.url,
        interval: example.interval,
      }).toString()
    });
  };

  const handleDashboardCreationSelection = () => {
    navigate("");
  }

  return (
    <AppProvider>

    </AppProvider>
  )
}