import {
    Chart as ChartJS,
    Filler,
    Legend,
    LinearScale,
    LineElement,
    PointElement,
    TimeScale,
    Title,
    Tooltip
} from "chart.js";
import "chartjs-adapter-date-fns";
import { Line } from "react-chartjs-2";

import { ProjectHistoryItem } from "../../../models";

ChartJS.register(TimeScale, LinearScale, PointElement, LineElement, Title, Tooltip, Filler, Legend);

interface Props {
    projectHistory: ProjectHistoryItem[];
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
            return "MMM";
        case "year":
            return "yyyy";
        default:
            return "dd/MM/yyyy";
    }
};

export const ProjectTimeChart = (props: Props) => {
    const { projectHistory, type } = props;

    const data: ProjectHistoryItem[] = projectHistory.sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    );
    //unité de temps (jour, mois, année...)
    const unit = getDateUnit(new Date(data[0].date), new Date(data[data.length - 1].date));
    //format de date (dd/mm/yyyy, MM, yyyy)
    const format = getDateFormat(unit);
    //axe des abscisses: toutes les dates
    const labels = data.map((history: ProjectHistoryItem) => history.date);
    const chartData = {
        //axe des ordonnées: pourcentage météo
        meteo: {
            labels,
            datasets: [
                {
                    fill: true,
                    data: data.map((project) => project.meteo_precise * 100),
                    borderColor: "rgb(255, 99, 132)",
                    backgroundColor: "rgba(255, 99, 132, 0.5)",
                },
            ],
        },
        //axe des ordonnées: pourcentage étape
        etape: {
            labels,
            datasets: [
                {
                    fill: true,
                    data: data.map((project) => project.etape_precise * 100),
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
                text: type == "meteo" ? "MÉTÉO" : "ÉTAPE",
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

            },
            y: {
                display: true,
                title: {
                    display: true,
                    text: type == "meteo" ? "Pourcentage météo" : "Pourcentage d'avancement",
                },
                ticks: {
                    callback: function (value: any) {
                        return value + "%";
                    },
                },
                min: 0,
                max: 100,
            },
        },
    };

    return <Line options={options} data={chartData[type]} />;
};
