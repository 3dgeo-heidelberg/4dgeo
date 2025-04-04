import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, createSearchParams } from 'react-router-dom';
import { Typography, Snackbar } from '@mui/material';
import './LandingPage.css';
import DashboardCreation from '../components/dashboard-creation/DashboardCreation';


function LandingPage() {
  const navigate = useNavigate();

  const [htmlHeaderString, setHtmlHeaderString] = useState();
  const [exampleDashboards, setExampleDashboards] = useState([]);

  const [showCustom, setShowCustom] = useState(false);
  const [copyStatus, setCopyStatus] = useState('');
  const modulesRef = useRef(null);

  const modules = [
    { id: 'Calendar', label: 'Calendar', minLayoutSize: {w: 3, h: 1} },
    { id: 'Graph', label: 'Graph', minLayoutSize: {w: 2, h: 2} },
    { id: 'Legend', label: 'Legend', minLayoutSize: {w: 2, h: 2} },
    { id: 'MapView', label: 'Map View', minLayoutSize: {w: 6, h: 3} },
  ];

  const handleCardSelection = (example) => {
    navigate({
      pathname: "/dashboard",
      search: createSearchParams({
        layout: JSON.stringify(example.layout),
        url: example.url,
        interval: example.interval,
      }).toString()
    });
  };

  const handleDashboardCreationSelection = () => {
    setShowCustom(true);
    setTimeout(() => {
      modulesRef.current.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }, 10);
  }

  async function fetchExampleDashboards() {
    const json = await (await fetch(`${window.location.href}/custom/example_dashboards/example_dashboards.json`, {
      headers : { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
       }
    })).json();
    setExampleDashboards(json.example_dashboards);
  }

  async function fetchHtml() {
    setHtmlHeaderString(await (await fetch(`${window.location.href}/custom/custom_html/landing_page_header.html`)).text());
  }
  useEffect(() => {
    fetchHtml();
    fetchExampleDashboards();
  }, []);

  return (
    <div className="dashboard-container">
      <div className='header'>
        <div dangerouslySetInnerHTML={{__html: htmlHeaderString}}/>
      </div>
      <div className="template-section">
        <div className="template-header">
          <Typography variant="h5" component="h2" className="subtitle">
            Select a template
          </Typography>
        </div>

        <div className="template-container">
          {Array.from(exampleDashboards).map((example) => {
            return (
            <div
              key={example.title}
              className="card-wrap"
              onClick={() => handleCardSelection(example)}
            >
              <div className="card" style={{ backgroundImage: `url(${example.image})` }}>
                <div className="card-info">
                  <h1>{example.title}</h1>
                  <p>{example.description}</p>
                </div>
              </div>
            </div>
          )})
          }
          <div
              key="custom"
              className="card-wrap"
              onClick={() => (handleDashboardCreationSelection())}
            >
              <div className="card" style={{ backgroundImage: `url(https://cdn-icons-png.flaticon.com/512/1250/1250615.png)` }}>
                <div className="card-info">
                  <h1>Custom Dashboard</h1>
                  <p>Create a new custom Dashboard</p>
                </div>
              </div>
            </div>
        </div>
      </div>

      {showCustom && (
        <div className='dashboard-creation' ref={modulesRef}>
          <DashboardCreation />
        </div>
      )}

      <Snackbar
        open={!!copyStatus}
        autoHideDuration={3000}
        onClose={() => setCopyStatus('')}
        message={copyStatus}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </div>
  );
}

export default LandingPage;