import { ResponsiveBar, BarSvgProps } from "@nivo/bar";
import { Columns, Projet } from "../../../models";
import { augmentSaturation } from "../../circlePackingPage/circlePackingDataFormat";
import ProjectsTable from "../../projectsTablePage/ProjectsTable";
import { useState } from "react";
import 'reactjs-popup/dist/index.css';
import { Modal } from "react-bootstrap";
import { styles } from "../HomeStyle";

interface Props {
    projects: Projet[];
    columns: Columns | undefined;
}

interface ColorMap {
    [key: string]: string;
}



interface StepResult {
    step: string;
    sunnyProjects: Projet[];
    cloudyProjects: Projet[];
    rainyProjects: Projet[];
    undefinedProjects: Projet[];
}

const getProjectsByEtape = (projets: Projet[]) => {
    const result: StepResult[] = [];
    projets.forEach((projet) => {
        projet.etape.forEach((ct) => {
            const index = result.findIndex((a) => a.step === ct.text);
            const etape = ct.text;
            if (index === -1) {
                result.push({
                    step: etape,
                    sunnyProjects: projet.meteo === "☀️" ? [projet] : [],
                    cloudyProjects: projet.meteo === "⛅️" ? [projet] : [],
                    rainyProjects: projet.meteo === "🌧" ? [projet] : [],
                    undefinedProjects: projet.meteo === null ? [projet] : [],
                });
            } else {
                if (projet.meteo === "☀️") {
                    result[index].sunnyProjects.push(projet);
                } else if (projet.meteo === "⛅️") {
                    result[index].cloudyProjects.push(projet);
                } else if (projet.meteo === "🌧") {
                    result[index].rainyProjects.push(projet);
                } else if (projet.meteo === null) {
                    result[index].undefinedProjects.push(projet);
                }
            }
        });
    });
    return result;
}



const CountProjectsByEtape = (projets: Projet[]) => {
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
    undefined: "#DEDEDE",
};


const BarChart = (props: Props) => {
    const { projects, columns } = props;
    const etapes = columns?.etapes?.map((etape) => etape.text) ?? [];
    const data = CountProjectsByEtape(projects).sort((a, b) => etapes.indexOf(a.etape) - etapes.indexOf(b.etape));
    console.log(data)
    const projectList = getProjectsByEtape(projects).sort((a, b) => etapes.indexOf(a.step) - etapes.indexOf(b.step));
    const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
    let [selectedProjects, setSelectedProjects] = useState<Projet[]>([]);
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

    const handleBarClick: BarSvgProps<any>['onClick'] = (bar, event) => {
        const index = data.findIndex((a) => a.etape === bar.data.etape);
        let projects: Projet[] = [];
        if (bar.id === "sunny") {
            projects = projectList[index].sunnyProjects;
        }
        if (bar.id === "cloudy") {
            projects = projectList[index].cloudyProjects;
        }
        if (bar.id === "rainy") {
            projects = projectList[index].rainyProjects;
        }
        if (bar.id === "undefined") {
            projects = projectList[index].undefinedProjects;
        }
        setSelectedProjects(projects);
    };

    return (
        <div style={styles.chart}>
            <ResponsiveBar
                data={data}
                keys={["sunny", "cloudy", "rainy", "undefined"]}
                indexBy="etape"
                onClick={handleBarClick}
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
            {selectedProjects.length > 0 && (
                <div>
                    <Modal show={!!selectedProjects} onHide={() => { setSelectedProjects([])}} size="lg">
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
            )}
        </div>

    );
};
export default BarChart;