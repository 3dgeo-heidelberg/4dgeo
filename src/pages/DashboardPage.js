import { useSearchParams } from "react-router-dom";
import Dashboard from "../components/dashboard/Dashboard";
import { useState, useEffect } from "react";
import Box from '@mui/material/Box';
import { fetchJsonData } from "../utils/http_fetcher";

function DashboardPage() {
    const urlParams = useSearchParams()[0]
    const [observations, setObservations] = useState([])

    const [htmlHeaderString, setHtmlHeaderString] = useState();

    async function fetchCustomHeader() {
        setHtmlHeaderString(await (await fetch(`custom/custom_html/dashboard_page_header.html`)).text());
    }

    useEffect(() => {
        async function loadData() {
            const data = await fetchJsonData(urlParams.get('url'));
            if (data == null) {
                setObservations([]);
            } else {
                setObservations(data.observations);
            }
        }
        loadData();
        fetchCustomHeader();

        const intervalResolution = urlParams.get('interval') == null ? 6 : urlParams.get('interval');
        const interval = setInterval(() => {
            loadData();
        }, Number.parseInt(intervalResolution)*1000);

        return () => clearInterval(interval); // Cleanup
    }, [urlParams]);

    return (
        <Box sx={{ height: '100vh', padding: 2, display: 'flex', flexDirection: 'column' }}>
            <div className='header'>
                <div dangerouslySetInnerHTML={{__html: htmlHeaderString}}/>
            </div>

            <Dashboard
                layout={JSON.parse(urlParams.get('layout'))}
                observations={observations}
            />
        </Box>
    )
}

export default DashboardPage;