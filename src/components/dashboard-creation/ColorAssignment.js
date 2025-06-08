import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, List } from "@mui/material";
import PaletteIcon from '@mui/icons-material/Palette';
import { useState } from "react";


export default function ColorAssignment({typeColors, setTypeColors, preloadTypes}) {
    const [colorAssignmentOpen, setColorAssignmentOpen] = useState(false);

    const handleColorClickOpen = () => {
        setColorAssignmentOpen(true);
    }

    const handleColorClickClose = () => {
        setColorAssignmentOpen(false);
    }

    return (
        <Box>
            <Button
                variant="contained" 
                onClick={handleColorClickOpen}
                startIcon={<PaletteIcon />}
            >
                Assign colors
            </Button>
            <Dialog
                open={colorAssignmentOpen}
                onClose={handleColorClickClose}
            >
                <DialogTitle>Assign colors to types</DialogTitle>
                <DialogContent>
                    <List>
                        {Array.from(typeColors).map(((typeColor) => {
                            const [type, color] = typeColor;
                            return (
                                <Box sx={{display: "flex", flexDirection: "row", alignItems: "center", justifyContent: ""}}>
                                    {type}:
                                    <input type="color" value={color} onChange={e => {
                                        console.log("new color", new Map([...typeColors, [type, e.target.value]]))
                                        setTypeColors(new Map([...typeColors, [type, e.target.value]]))
                                    }}/>
                                </Box>
                            )
                        }))}
                    </List>
                </DialogContent>

                <DialogActions>
                    {preloadTypes ? (<Button onClick={preloadTypes}>Load types</Button>) : ""}
                    <Button onClick={handleColorClickClose}>Done</Button>
                </DialogActions>
            </Dialog>
        </Box>
    )
}