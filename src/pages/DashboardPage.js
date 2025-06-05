import { useSearchParams } from "react-router-dom";
import Dashboard from "../components/dashboard/Dashboard";
import { useState, useEffect } from "react";
import Box from '@mui/material/Box';
import { fetchJsonData } from "../utils/http_fetcher";
import { Button, Divider, styled } from "@mui/material";
import { addDays } from "date-fns";

function DashboardPage() {
    const urlParams = useSearchParams()[0]
    const [observations, setObservations] = useState([])
    const [wasFileUploaded, setWasFileUploaded] = useState(false);

    const [htmlHeaderString, setHtmlHeaderString] = useState();

    const [typeColors, setTypeColors] = useState(new Map());

    const [dateRange, setDateRange] = useState({ startDate: 0, endDate: Date.now()});
    const [sliderRange, setSliderRange] = useState([0, 100]);
    const [dateTimeRange, setDateTimeRange] = useState({ startDate: 0, endDate: Date.now()})

    async function fetchCustomHeader() {
        setHtmlHeaderString(await (await fetch(`custom/custom_html/dashboard_page_header.html`)).text());
    }

    const getAllTypesWithColors = (observations) => {
        const allTypes = new Set();
        observations.forEach(observation => {
            observation.geoObjects.forEach(geoObject => {
                allTypes.add(geoObject.type);
            });
        });

        const typeColors = new Map();
        Array.from(allTypes).map((type) => {
            const color = `#${Math.floor(Math.random()*16777215).toString(16)}`; // Generate a random color
            typeColors.set(type, color);
            return 0;
        });
        return typeColors;
    }

    useEffect(() => {
        async function loadData(isInitialLoad = false) {
            const data = await fetchJsonData(urlParams.get('url'));
            if (data == null) {
                setObservations([]);
            } else {
                setObservations(data.observations);
                if(isInitialLoad) {
                    resetDashboardState(data.observations);
                    setTypeColors(getAllTypesWithColors(data.observations));
                }
            }
        }
        loadData(true);
        fetchCustomHeader();

        const intervalResolution = urlParams.get('interval') == null ? 60 : urlParams.get('interval');
        const interval = setInterval(() => {
            if(!wasFileUploaded) {
                loadData();
                console.log("Reloading data!");
            }
        }, Number.parseInt(intervalResolution)*1000);

        return () => clearInterval(interval); // Cleanup
    }, [urlParams]);

    const getDateFromDateTime = (dateTime) => {
        let date = new Date(dateTime);
        return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
    }

    const resetDashboardState = (observations) => {
        let tempStartEnd = {
            startDate: Math.min(...observations.map(observation => Date.parse(observation.startDateTime))), 
            endDate: Math.max(...observations.map(observation => Date.parse(observation.startDateTime)))
        }
        setDateRange({startDate: getDateFromDateTime(tempStartEnd.startDate), endDate: addDays(getDateFromDateTime(tempStartEnd.endDate), 1) - 1});
        setDateTimeRange(tempStartEnd)

        const uniqueDateTimes = Array.from(new Set(observations.map(observation => Date.parse(observation.startDateTime))))

        if(uniqueDateTimes.length >= 2) {
            setSliderRange([uniqueDateTimes[0], uniqueDateTimes[uniqueDateTimes.length - 1]])
        } else {
            setSliderRange([0, 100])
        }
    }

    const onFileUpload = async (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();

        reader.onload = async (e) => {
            const content = e.target.result;
            try {
                const jsonData = JSON.parse(content);
                if (jsonData.observations) {
                    // setFirstObservationLoading(true);
                    setObservations(jsonData.observations);
                    setWasFileUploaded(true);

                    resetDashboardState(jsonData.observations);
                    console.log("Data loaded from file:", jsonData.observations);
                } else {
                    console.error("Invalid data format");
                }
            } catch (error) {
                console.error("Error parsing JSON file:", error);
            }
        }
        reader.readAsText(file)
    }


    const VisuallyHiddenInput = styled('input')({
        clip: 'rect(0 0 0 0)',
        clipPath: 'inset(50%)',
        height: 1,
        overflow: 'hidden',
        position: 'absolute',
        bottom: 0,
        left: 0,
        whiteSpace: 'nowrap',
        width: 1,
    });

    return (
        <Box className="dashboard-container" sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '2rem 4rem'}}>
                <div className="custom-header" dangerouslySetInnerHTML={{__html: htmlHeaderString}} />
                <Button
                    component="label"
                    variant="contained"
                    tabIndex={-1}
                    sx={{  }}
                    >
                    Upload data
                    <VisuallyHiddenInput
                        type="file"
                        onChange={(e) => onFileUpload(e)}
                    />
                </Button>
            </Box>

            <Divider />

            <Box sx={{ flexGrow: 1, overflowY: 'auto', padding: '2rem' }}>
                <Dashboard
                    layout={JSON.parse(urlParams.get('layout'))}
                    observations={observations}
                    typeColors={typeColors}
                    dateRange={dateRange}
                    setDateRange={setDateRange}
                    sliderRange={sliderRange}
                    setSliderRange={setSliderRange}
                    dateTimeRange={dateTimeRange}
                    setDateTimeRange={setDateTimeRange}
                />
            </Box>
        </Box>
    )
}

export default DashboardPage;