import { ResponsivePie, PieSvgProps } from "@nivo/pie";
import { Columns, Projet } from "../../../models";
import { augmentSaturation } from "../../circlePackingPage/circlePackingDataFormat";
import { ColorMap } from "./MeteoCircleChart";
import { Modal } from "react-bootstrap";
import { useState } from "react";
import ProjectsTable from "../../projectsTablePage/ProjectsTable";
import { styles } from "../HomeStyle";

interface Props {
    projects: Projet[];
    columns?: Columns;
}

export const PieChart = (props: Props) => {
    const { projects, columns } = props;
    let [selectedProjects, setSelectedProjects] = useState<Projet[]>([]);
    const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
    const [sortColumn, setSortColumn] = useState<keyof Projet>("id");
    const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
    const handleSort = (column: keyof Projet) => {
        if (sortColumn === column) {
            setSortDirection(sortDirection === "asc" ? "desc" : "asc");
        } else {
            setSortColumn(column);
            setSortDirection("asc");
        }
    };
    function showProjectDetails(projectId: string) {
        setSelectedProjectId(projectId);
    }
    const handlePieClick: PieSvgProps<any>['onClick'] = (pie, event) => {
        let projectsDemande: Projet[] = [];
        projectsDemande = projects.filter((project) => project.etat?.text == pie.id)
        setSelectedProjects(projectsDemande);
    }

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
            {
                selectedProjects.length > 0 && (
                    <div>
                        <Modal show={!!selectedProjects} onHide={() => { setSelectedProjects([]) }} size="lg">
                            <Modal.Header closeButton>
                                <Modal.Title>
                                    {selectedProjects[0].etat?.text} projects
                                </Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <ProjectsTable
                                    projets={selectedProjects}
                                    onShowDetails={showProjectDetails}
                                    handleSort={handleSort}
                                    sortDirection={sortDirection}
                                    sortColumn={sortColumn}
                                />
                            </Modal.Body>
                        </Modal>

                    </div>
                )
            }
        </div>

    );
};
