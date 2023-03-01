import { PieSvgProps, ResponsivePie } from "@nivo/pie";
import { Columns, Projet } from "../../../models";
import { augmentSaturation } from "../../circlePackingPage/circlePackingDataFormat";
import { styles } from "../HomeStyle";
import { ColorMap } from "./MeteoCircleChart";

interface Props {
    projects: Projet[];
    columns?: Columns;
    showProjectsTableModal: (title: string, filter: (projet: Projet) => boolean) => void;
}

export const PieChart = (props: Props) => {
    const { projects, columns, showProjectsTableModal } = props;

    const handlePieClick: PieSvgProps<any>["onClick"] = (pie, event) => {
        showProjectsTableModal(pie.data.id, (projet) => projet.etat?.text === pie.data.id);
    };

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
        <div style={styles.chart}>
            <ResponsivePie
                data={data}
                margin={{ top: 50, right: 50, bottom: 50, left: 50 }}
                innerRadius={0.5}
                padAngle={0.7}
                onClick={handlePieClick}
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
            />
        </div>
    );
};
