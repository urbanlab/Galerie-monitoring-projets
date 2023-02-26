import {
    Chart as ChartJS,
    Filler,
    Legend,
    LinearScale,
    LineElement,
    PointElement,
    TimeScale,
    Title,
    Tooltip,
} from "chart.js";
import "chartjs-adapter-date-fns";
import { Line } from "react-chartjs-2";

import { ProjectHistory } from "../../../models";

ChartJS.register(TimeScale, LinearScale, PointElement, LineElement, Title, Tooltip, Filler, Legend);

interface Props {
    projectHistory: ProjectHistory[];
    type: "meteo" | "etape";
}

export const getDiffDays = (date1: Date, date2: Date) => {
    const diffTime = Math.abs(date2.getTime() - date1.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
};

//function to get the date unit for the chart according to the max and min date of the dataset
export const getDateUnit = (minDate: Date, maxDate: Date) => {
    const diffDays = getDiffDays(minDate, maxDate);
    if (diffDays < 7) {
        return "day";
    } else if (diffDays < 30) {
        return "week";
    } else if (diffDays < 365) {
        return "month";
    } else {
        return "year";
    }
};

//function to get date fotrmat according to the date unit
export const getDateFormat = (dateUnit: string) => {
    switch (dateUnit) {
        case "day":
            return "dd/MM";
        case "week":
            return "dd/MM";
        case "month":
            return "MMM yyyy";
        case "year":
            return "yyyy";
        default:
            return "dd/MM/yyyy";
    }
};

export const ProjectTimeChart = (props: Props) => {
    const { projectHistory, type } = props;
    const mockData: ProjectHistory[] = [
        {
            date: "2023-02-16",
            etape_precise: 0.2,
            meteo_precise: 0.5,
            project_id: "ae40b2a6-752a-419f-98be-a0c95437fac2",
        },
        {
            date: "2023-02-21",
            etape_precise: 0.26,
            meteo_precise: 0.65,
            project_id: "ae40b2a6-752a-419f-98be-a0c95437fac2",
        },
        {
            date: "2023-02-23",
            etape_precise: 0.27,
            meteo_precise: 0.68,
            project_id: "ae40b2a6-752a-419f-98be-a0c95437fac2",
        },
        {
            date: "2023-02-23",
            etape_precise: 0.35,
            meteo_precise: 0.42,
            project_id: "ae40b2a6-752a-419f-98be-a0c95437fac2",
        },
        {
            date: "2023-02-25",
            etape_precise: 0.41,
            meteo_precise: 0.38,
            project_id: "ae40b2a6-752a-419f-98be-a0c95437fac2",
        },
        {
            date: "2023-02-28",
            etape_precise: 0.43,
            meteo_precise: 0.12,
            project_id: "ae40b2a6-752a-419f-98be-a0c95437fac2",
        },
        {
            date: "2023-03-05",
            etape_precise: 0.47,
            meteo_precise: 0.5,
            project_id: "ae40b2a6-752a-419f-98be-a0c95437fac2",
        },
        {
            date: "2023-03-12",
            etape_precise: 0.5,
            meteo_precise: 0.56,
            project_id: "ae40b2a6-752a-419f-98be-a0c95437fac2",
        },
        {
            date: "2023-03-21",
            etape_precise: 0.52,
            meteo_precise: 0.58,
            project_id: "ae40b2a6-752a-419f-98be-a0c95437fac2",
        },
        {
            date: "2023-03-24",
            etape_precise: 0.55,
            meteo_precise: 0.6,
            project_id: "ae40b2a6-752a-419f-98be-a0c95437fac2",
        },
        {
            date: "2023-03-29",
            etape_precise: 0.58,
            meteo_precise: 0.62,
            project_id: "ae40b2a6-752a-419f-98be-a0c95437fac2",
        },
        {
            date: "2023-04-02",
            etape_precise: 0.6,
            meteo_precise: 0.64,
            project_id: "ae40b2a6-752a-419f-98be-a0c95437fac2",
        },
        {
            date: "2023-04-11",
            etape_precise: 0.63,
            meteo_precise: 0.66,
            project_id: "ae40b2a6-752a-419f-98be-a0c95437fac2",
        },
        {
            date: "2023-04-16",
            etape_precise: 0.65,
            meteo_precise: 0.68,
            project_id: "ae40b2a6-752a-419f-98be-a0c95437fac2",
        },
        {
            date: "2023-04-28",
            etape_precise: 0.68,
            meteo_precise: 0.7,
            project_id: "ae40b2a6-752a-419f-98be-a0c95437fac2",
        },
        {
            date: "2023-05-02",
            etape_precise: 0.7,
            meteo_precise: 0.72,
            project_id: "ae40b2a6-752a-419f-98be-a0c95437fac2",
        },
        {
            date: "2023-05-07",
            etape_precise: 0.73,
            meteo_precise: 0.74,
            project_id: "ae40b2a6-752a-419f-98be-a0c95437fac2",
        },
        {
            date: "2023-05-12",
            etape_precise: 0.75,
            meteo_precise: 0.76,
            project_id: "ae40b2a6-752a-419f-98be-a0c95437fac2",
        },
        {
            date: "2023-05-17",
            etape_precise: 0.78,
            meteo_precise: 0.78,
            project_id: "ae40b2a6-752a-419f-98be-a0c95437fac2",
        },
        {
            date: "2023-05-22",
            etape_precise: 0.8,
            meteo_precise: 0.8,
            project_id: "ae40b2a6-752a-419f-98be-a0c95437fac2",
        },
        {
            date: "2023-05-27",
            etape_precise: 0.83,
            meteo_precise: 0.82,
            project_id: "ae40b2a6-752a-419f-98be-a0c95437fac2",
        },
        {
            date: "2023-06-01",
            etape_precise: 0.85,
            meteo_precise: 0.84,
            project_id: "ae40b2a6-752a-419f-98be-a0c95437fac2",
        },
        {
            date: "2023-06-06",
            etape_precise: 0.88,
            meteo_precise: 0.86,
            project_id: "ae40b2a6-752a-419f-98be-a0c95437fac2",
        },
        {
            date: "2023-06-11",
            etape_precise: 0.9,
            meteo_precise: 0.88,
            project_id: "ae40b2a6-752a-419f-98be-a0c95437fac2",
        },
        {
            date: "2023-06-16",
            etape_precise: 0.93,
            meteo_precise: 0.9,
            project_id: "ae40b2a6-752a-419f-98be-a0c95437fac2",
        },
        {
            date: "2023-06-21",
            etape_precise: 0.95,
            meteo_precise: 0.92,
            project_id: "ae40b2a6-752a-419f-98be-a0c95437fac2",
        },
        {
            date: "2023-06-26",
            etape_precise: 0.98,
            meteo_precise: 0.94,
            project_id: "ae40b2a6-752a-419f-98be-a0c95437fac2",
        },
        {
            date: "2023-07-01",
            etape_precise: 1.0,
            meteo_precise: 0.96,
            project_id: "ae40b2a6-752a-419f-98be-a0c95437fac2",
        },
        {
            date: "2023-07-06",
            etape_precise: 1,
            meteo_precise: 0.98,
            project_id: "ae40b2a6-752a-419f-98be-a0c95437fac2",
        },
        {
            date: "2023-07-11",
            etape_precise: 1,
            meteo_precise: 0.89,
            project_id: "ae40b2a6-752a-419f-98be-a0c95437fac2",
        },
        {
            date: "2023-07-16",
            etape_precise: 1,
            meteo_precise: 0.7,
            project_id: "ae40b2a6-752a-419f-98be-a0c95437fac2",
        },
        {
            date: "2023-07-21",
            etape_precise: 1,
            meteo_precise: 0.65,
            project_id: "ae40b2a6-752a-419f-98be-a0c95437fac2",
        },
    ];
    const data: ProjectHistory[] = projectHistory.sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    );
    const unit = getDateUnit(new Date(data[0].date), new Date(data[data.length - 1].date));
    const format = getDateFormat(unit);
    const labels = data.map((history: ProjectHistory) => history.date);
    const chartData = {
        meteo: {
            labels,
            datasets: [
                {
                    fill: true,
                    data: data.map((project) => project.meteo_precise),
                    borderColor: "rgb(255, 99, 132)",
                    backgroundColor: "rgba(255, 99, 132, 0.5)",
                },
            ],
        },
        etape: {
            labels,
            datasets: [
                {
                    fill: true,
                    data: data.map((project) => project.etape_precise),
                    borderColor: "rgb(53, 162, 235)",
                    backgroundColor: "rgba(53, 162, 235, 0.5)",
                },
            ],
        },
    };

    const options: any = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
            },
            title: {
                display: true,
                text: type == "meteo" ? "MÉTÉO" : "AVANCEMENT",
            },
        },
        scales: {
            x: {
                display: true,
                type: "time",
                time: {
                    unit: unit,
                    displayFormats: {
                        [unit]: format,
                    },
                },
                ticks: {
                    display: true,
                },
                gridLines: {
                    display: false,
                },
            },
            y: {
                display: true,
                min: 0,
                max: 1,
            },
        },
    };

    return <Line options={options} data={chartData[type]} />;
};
