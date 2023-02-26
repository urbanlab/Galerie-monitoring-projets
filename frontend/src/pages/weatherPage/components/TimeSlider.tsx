import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";
import { AllProjectsHistory } from "../weatherModels";

interface Props {
    allProjectsHistory: AllProjectsHistory;
    onChange(date: string): void;
}

export function TimeSlider(props: Props) {
    const { allProjectsHistory, onChange } = props;
    const marks = [
        {
            value: 0,
            label: allProjectsHistory.getMinDate(),
        },
        {
            value: allProjectsHistory.listOfDates.length - 1,
            label: allProjectsHistory.getMaxDate(),
        },
    ];

    return (
        <Box sx={{ width: window.innerWidth * 0.5 }}>
            <Slider
                onChange={(event, value: any) => {
                    console.log(event);
                    onChange(allProjectsHistory.listOfDates[value]);
                }}
                defaultValue={30}
                valueLabelDisplay="on"
                valueLabelFormat={(value) => allProjectsHistory.listOfDates[value]}
                min={0}
                max={allProjectsHistory.listOfDates.length - 1}
                marks={marks}
            />
        </Box>
    );
}
