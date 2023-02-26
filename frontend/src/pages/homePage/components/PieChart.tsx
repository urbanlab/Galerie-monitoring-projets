import { ResponsivePie } from "@nivo/pie";

import { Columns, Projet } from "../../../models";

import { augmentSaturation } from "../../circlePackingPage/circlePackingDataFormat";
import { ColorMap } from "./meteoCircleChart";

interface Props {
    projects: Projet[];
    columns?: Columns;
}

export const PieChart = (props: Props) => {
    const { projects, columns } = props;

    const data =
        columns?.etats
            .filter(
                //filtrage des projets terminés et abandonnés
                (etat) =>
                    !etat.text.toLocaleLowerCase().includes("abandonné") &&
                    !etat.text.toLocaleLowerCase().includes("terminé"),
            )
            .map((etat) => {
                var nbProjects = projects.filter((project) => {
                    return project.etat?.text == etat.text;
                }).length;
                return {
                    id: etat.text,
                    color: etat.color,
                    label: etat.text,
                    value: nbProjects,
                };
            }) ?? [];

    const colorMap: ColorMap = {
        "En cours ": augmentSaturation("#DDEDEA", 0.2, -0.15),
        "En attente": augmentSaturation("#FBF3DB", 0.4, -0.15),
        Entrant: augmentSaturation("#FBE4E4", 0.4, -0.15),
        undefined: "#ebebeb",
    };

    return (
        <ResponsivePie
            data={data}
            margin={{ top: 40, right: 80, bottom: 80, left: 120 }}
            innerRadius={0.5}
            padAngle={0.7}
            colors={function (e) {
                return colorMap[e.data.label];
            }}
            cornerRadius={3}
            activeOuterRadiusOffset={8}
            borderWidth={1}
            borderColor={{
                from: "color",
                modifiers: [["darker", 0.2]],
            }}
            arcLinkLabelsSkipAngle={10}
            arcLinkLabelsTextColor="#333333"
            arcLinkLabelsThickness={2}
            arcLinkLabelsColor={{ from: "color" }}
            arcLabelsSkipAngle={10}
            arcLabelsTextColor={{
                from: "color",
                modifiers: [["darker", 2]],
            }}
            // defs={[
            //     {
            //         id: 'dots',
            //         type: 'patternDots',
            //         background: 'inherit',
            //         color: 'rgba(255, 255, 255, 0.3)',
            //         size: 4,
            //         padding: 1,
            //         stagger: true
            //     },
            //     {
            //         id: 'lines',
            //         type: 'patternLines',
            //         background: 'inherit',
            //         color: 'rgba(255, 255, 255, 0.3)',
            //         rotation: -45,
            //         lineWidth: 6,
            //         spacing: 10
            //     }
            // ]}
            // fill={[
            //     {
            //         match: {
            //             id: 'ruby'
            //         },
            //         id: 'dots'
            //     },
            //     {
            //         match: {
            //             id: 'c'
            //         },
            //         id: 'dots'
            //     },
            //     {
            //         match: {
            //             id: 'go'
            //         },
            //         id: 'dots'
            //     },
            //     {
            //         match: {
            //             id: 'python'
            //         },
            //         id: 'dots'
            //     },
            //     {
            //         match: {
            //             id: 'scala'
            //         },
            //         id: 'lines'
            //     },
            //     {
            //         match: {
            //             id: 'lisp'
            //         },
            //         id: 'lines'
            //     },
            //     {
            //         match: {
            //             id: 'elixir'
            //         },
            //         id: 'lines'
            //     },
            //     {
            //         match: {
            //             id: 'javascript'
            //         },
            //         id: 'lines'
            //     }
            // ]}
            // legends={[
            //     {
            //         anchor: 'left',
            //         direction: 'column',
            //         justify: false,
            //         translateX: -50,
            //         translateY: 0,
            //         itemsSpacing: 32,
            //         itemWidth: 100,
            //         itemHeight: 18,
            //         itemTextColor: '#666',
            //         itemDirection: 'left-to-right',
            //         itemOpacity: 1,
            //         symbolSize: 18,
            //         symbolShape: 'circle',
            //         effects: [
            //             {
            //                 on: 'hover',
            //                 style: {
            //                     itemTextColor: '#000'
            //                 }
            //             }
            //         ]
            //     }
            // ]}
        />
    );
};
