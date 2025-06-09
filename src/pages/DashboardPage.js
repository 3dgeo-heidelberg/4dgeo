import { useSearchParams } from "react-router-dom";
import Dashboard from "../components/dashboard/Dashboard";
import { useState, useEffect } from "react";
import Box from '@mui/material/Box';
import { fetchJsonData } from "../utils/http_fetcher";
import { Button, Divider, styled } from "@mui/material";
import { addDays } from "date-fns";
import ColorAssignment from "../components/dashboard-creation/ColorAssignment";
import AddIcon from '@mui/icons-material/Add'
import { CopticCalendar } from "@internationalized/date";

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

    const getAllTypes = (observations) => {
        const allTypes = new Set();
        observations.forEach(observation => {
            observation.geoObjects.forEach(geoObject => {
                allTypes.add(geoObject.type);
            });
        });

        return allTypes;
    }

    const completeTypeColors = (typeColors, observations) => {
        const allTypes = getAllTypes(observations);
        const test = new Map();
        allTypes.forEach(type => {
            if(!typeColors.has(type)) {
                typeColors.set(type, `#${Math.floor(Math.random()*16777215).toString(16)}`);
            }
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
                    const typeColors = urlParams.get('typeColors');
                    if(!typeColors) {
                        setTypeColors(completeTypeColors(new Map(), data.observations));
                    } else {
                        const urlTypeColors = new Map(Array.from(JSON.parse(typeColors)));
                        setTypeColors(completeTypeColors(urlTypeColors, data.observations));
                    }
                } else {
                    setTypeColors(completeTypeColors(typeColors, data.observations))
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

        return () => clearInterval(interval);
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
                <Box sx={{display: "flex", flexDirection: "row", alignItems: "center", gap: "1.2rem"}}>
                    <ColorAssignment typeColors={typeColors} setTypeColors={setTypeColors} />
                    <Button
                        component="label"
                        variant="contained"
                        startIcon={<AddIcon />}
                        >
                        Upload data
                        <VisuallyHiddenInput
                            type="file"
                            onChange={(e) => onFileUpload(e)}
                        />
                    </Button>
                </Box>
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