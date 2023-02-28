import { Box, createTheme, ThemeProvider } from "@mui/material";
import Slider from "@mui/material/Slider";

import { AllProjectsHistory } from "../weatherModels";

interface Props {
    allProjectsHistory: AllProjectsHistory;
    onChange(date: string): void;
}

export function TimeSlider(props: Props) {
    const { allProjectsHistory, onChange } = props;

    const formatLabel = (value: number) => {
        let date = new Date(allProjectsHistory.listOfDates[value]);

        return date.toLocaleDateString("fr");
    };

    const muiTheme: any = createTheme({
        components: {
            MuiSlider: {
                styleOverrides: {
                    root: {
                        color: "#aaa",
                    },
                    thumb: {
                        height: 24,
                        width: 48,
                        backgroundColor: "#fff",
                        border: "2px solid currentColor",
                        marginTop: 0,
                        borderRadius: 0,
                        boxShadow: "0px 1px 3px 0px rgba(0,0,0,0.3)",
                        marginLeft: 0,
                        "&:focus, &:hover, &$active": {
                            boxShadow: "inherit",
                        },
                    },
                    track: {
                        height: 16,
                        borderRadius: 0,
                    },
                    valueLabel: {
                        color: "#404040",
                        backgroundColor: "white",
                        boxShadow: "-1px 1px 3px 0px rgba(0,0,0,0.3)",
                        fontSize: 14,
                        fontWeight: 600,
                    },
                    rail: {
                        height: 16,
                        borderRadius: 0,
                    },
                    markLabel: {
                        color: "#404040",
                        fontSize: 14,
                        fontWeight: 600,
                    },
                    mark: {
                        height: 0,
                    },
                },
            },
        },
    });

    const marks = [
        {
            value: 0,
            label: formatLabel(0),
        },
        {
            value: allProjectsHistory.listOfDates.length - 1,
            label: formatLabel(allProjectsHistory.listOfDates.length - 1),
        },
    ];

    return (
        <Box
            sx={{
                width: "100%",
                display: "flex",
                alignItems: "flex-end",
                padding: "50px 50px 10px 50px",
            }}
        >
            <ThemeProvider theme={muiTheme}>
                <Slider
                    onChange={(event, value: any) => {
                        onChange(allProjectsHistory.listOfDates[value]);
                    }}
                    defaultValue={allProjectsHistory.listOfDates.length - 1}
                    color="primary"
                    valueLabelDisplay="on"
                    valueLabelFormat={formatLabel}
                    min={0}
                    max={allProjectsHistory.listOfDates.length - 1}
                    marks={marks}
                />
            </ThemeProvider>
        </Box>
    );
}
