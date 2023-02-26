import { ResponsiveBar } from "@nivo/bar";

import { Columns, Projet } from "../../../models";
import { augmentSaturation } from "../../circlePackingPage/circlePackingDataFormat";

interface Props {
    projects: Projet[];
    columns: Columns | undefined;
}

interface ColorMap {
    [key: string]: string;
}

const getProjectsByEtape = (projets: Projet[]) => {
    const data: { etape: string; count: number; sunny: number; cloudy: number; rainy: number; undefined: number }[] =
        [];
    projets.forEach((projet) => {
        projet.etape.forEach((ct) => {
            const index = data.findIndex((a) => a.etape === ct.text);
            const etape = ct.text;
            if (index === -1) {
                data.push({
                    etape,
                    count: 1,
                    sunny: projet.meteo === "☀️" ? 1 : 0,
                    cloudy: projet.meteo === "⛅️" ? 1 : 0,
                    rainy: projet.meteo === "🌧" ? 1 : 0,
                    undefined: projet.meteo === null ? 1 : 0,
                });
            } else {
                data[index].count++;
                if (projet.meteo === "☀️") {
                    data[index].sunny++;
                } else if (projet.meteo === "⛅️") {
                    data[index].cloudy++;
                } else if (projet.meteo === "🌧") {
                    data[index].rainy++;
                } else if (projet.meteo === null) {
                    data[index].undefined++;
                }
            }
        });
    });
    return data;
};

const colorMap: ColorMap = {
    sunny: augmentSaturation("#DDEDEA", 0.2, -0.15),
    cloudy: augmentSaturation("#FBF3DB", 0.4, -0.15),
    rainy: augmentSaturation("#FBE4E4", 0.4, -0.15),
    undefined: "#ebebeb",
};

const BarChart = (props: Props) => {
    const { projects, columns } = props;
    const etapes = columns?.etapes?.map((etape) => etape.text) ?? [];
    const data = getProjectsByEtape(projects).sort((a, b) => etapes.indexOf(a.etape) - etapes.indexOf(b.etape));
    return (
        <ResponsiveBar
            data={data}
            keys={["sunny", "cloudy", "rainy", "undefined"]}
            indexBy="etape"
            margin={{ top: 20, right: 130, bottom: 70, left: 60 }}
            padding={0.3}
            valueScale={{ type: "linear" }}
            indexScale={{ type: "band", round: true }}
            colors={(d) => colorMap[d.id]}
            borderWidth={0}
            borderColor={{
                from: "color",
                modifiers: [["darker", 1.6]],
            }}
            axisTop={null}
            axisRight={null}
            axisBottom={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: -20,
                legend: "",
                legendPosition: "middle",
                legendOffset: 32,
            }}
            axisLeft={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: "Nombre de projets",
                legendPosition: "middle",
                legendOffset: -40,
            }}
            labelSkipWidth={12}
            labelSkipHeight={12}
            labelTextColor={{
                from: "color",
                modifiers: [["darker", 1.6]],
            }}
            legends={[
                {
                    dataFrom: "keys",
                    anchor: "bottom-right",
                    direction: "column",
                    justify: false,
                    translateX: 120,
                    translateY: 0,
                    itemsSpacing: 2,
                    itemWidth: 100,
                    itemHeight: 20,
                    itemDirection: "left-to-right",
                    itemOpacity: 0.85,
                    symbolSize: 20,
                    effects: [
                        {
                            on: "hover",
                            style: {
                                itemOpacity: 1,
                            },
                        },
                    ],
                },
            ]}
            role="application"
            ariaLabel="Nivo bar chart demo"
            barAriaLabel={function (e) {
                return e.id + ": " + e.formattedValue + " in country: " + e.indexValue;
            }}
        />
    );
};
export default BarChart;
