import { ResponsiveCirclePacking, CirclePackingSvgProps } from "@nivo/circle-packing";
import { augmentSaturation } from "../../circlePackingPage/circlePackingDataFormat";
import { Projet } from "../../../models";
import { Modal } from "react-bootstrap";
import { useState } from "react";
import ProjectsTable from "../../projectsTablePage/ProjectsTable";

interface Props {
    meteo: any;
    projects: Projet[];
}

export interface ColorMap {
    [key: string]: string;
}

const MeteoCircleChart = ({ meteo, projects /* see data tab */ }: Props) => {
    /* This component is a wrapper around the nivo circle packing component. It takes a list of projects and formats it to be displayed in a circle packing chart. */
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
    /* =================== Color map =================== */

    const colorMap: ColorMap = {
        sunny: augmentSaturation("#DDEDEA", 0.2, -0.15),
        cloudy: augmentSaturation("#FBF3DB", 0.4, -0.15),
        rainy: augmentSaturation("#FBE4E4", 0.4, -0.15),
        undefined: "#ebebeb",
    };

    const getWeatherType = (weather: string): string => {
        switch (weather) {
            case "sunny":
                return "☀️";
            case "cloudy":
                return "⛅️";
            case "rainy":
                return "🌧";
            default:
                return "unknown";
        }
    };


    const handleCircleClick: CirclePackingSvgProps<any>['onClick'] = (circle, event) => {
        let projectsDemande: Projet[] = [];
        projectsDemande = projects.filter((project) => project.meteo == getWeatherType(circle.id))
        setSelectedProjects(projectsDemande);
    }

    /* =================== Render =================== */
    return (
        <div className="d-flex flex-column ">
            <div className="d-block m-auto" style={{ width: 0.2 * window.innerWidth, height: "30vh" }}>
                <ResponsiveCirclePacking
                    data={meteo}
                    margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
                    onClick={handleCircleClick}
                    id="name"
                    value="loc"
                    leavesOnly={true}
                    colors={function (e) {
                        return colorMap[e.data.name];
                    }}
                    colorBy="id"
                    label={function (e) {
                        return e.id + " (" + e.value + ")";
                    }}
                    inheritColorFromParent={true}
                    childColor={{
                        from: "color",
                        modifiers: [["darker", 0.5]],
                    }}
                    padding={4}
                    enableLabels={true}
                    labelsFilter={function (n) {
                        return 1 === n.node.depth;
                    }}
                    labelsSkipRadius={0}
                    labelTextColor={{
                        from: "color",
                        modifiers: [["darker", 2]],
                    }}
                    borderWidth={4}
                    borderColor={{
                        from: "color",
                        modifiers: [["darker", 0.5]],
                    }}
                    defs={
                        [
                            // {
                            //     id: 'lines',
                            //     type: 'patternLines',
                            //     background: 'none',
                            //     color: 'inherit',
                            //     rotation: -45,
                            //     lineWidth: 5,
                            //     spacing: 8
                            // }
                        ]
                    }
                    fill={
                        [
                            // {
                            //     match: {
                            //         depth: 1
                            //     },
                            //     id: 'lines'
                            // }
                        ]
                    }
                    isInteractive={true}
                />
                {
                    selectedProjects.length > 0 && (
                        <div>
                            <Modal show={!!selectedProjects} onHide={() => { setSelectedProjects([]) }} size="lg">
                                <Modal.Header closeButton>
                                    <Modal.Title>
                                        {selectedProjects[0].meteo} projects
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
        </div>
    );
};

export default MeteoCircleChart;
