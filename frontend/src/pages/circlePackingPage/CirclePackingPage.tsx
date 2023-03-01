// install (please make sure versions match peerDependencies)
// yarn add @nivo/core @nivo/circle-packing

import { ResponsiveCirclePacking, CirclePackingSvgProps } from "@nivo/circle-packing";
import { useState } from "react";
import Form from "react-bootstrap/Form";
import { ColoredText, Projet } from "../../models";
import getBgColorByName from "../../utils/colors";
import { Modal } from "react-bootstrap";
import ProjectsTable from "../projectsTablePage/ProjectsTable";
import { augmentSaturation, formatData } from "./circlePackingDataFormat";

interface Props {
    projets: Projet[];
}

interface ColorMap {
    [key: string]: string;
}

// hardcoded possible values for the displayed_property
export type DisplayedProperty = "politiques_publiques" | "direction_metier" | "etape" | "besoins_lab";

const MyResponsiveCirclePacking = ({ projets /* see data tab */ }: Props) => {
    /* This component is a wrapper around the nivo circle packing component. It takes a list of projects and formats it to be displayed in a circle packing chart. */
    const [displayed_property, setDisplayedProperty] = useState<DisplayedProperty>("politiques_publiques");
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
    const allPropertyValues = projets.reduce(
        (acc: ColoredText[], projet: Projet) => [...acc, ...projet[displayed_property]],
        [],
    );
    const ColorMap: ColorMap = allPropertyValues.reduce((acc: ColorMap, pp) => {
        acc[pp.text] = augmentSaturation(getBgColorByName(pp.color), 0.4, -0.15);
        return acc;
    }, {});

    const handleCircleClick: CirclePackingSvgProps<any>['onClick'] = (circle, event) => {
        let projectsDemande: Projet[] = [];
        if (displayed_property ==="politiques_publiques"){
            projectsDemande = projets.filter((project) => project.politiques_publiques.map((e)=>e.text).includes(circle.id))
            setSelectedProjects(projectsDemande)
        }
        if (displayed_property == "direction_metier"){
            projectsDemande = projets.filter((project)=> project.direction_metier.map((e)=>e.text).includes(circle.id))
            setSelectedProjects(projectsDemande);
        }
        if (displayed_property == "etape"){
            projectsDemande = projets.filter((project)=> project.etape.map((e)=>e.text).includes(circle.id))
            setSelectedProjects(projectsDemande);
        }
        if (displayed_property == "besoins_lab"){
            projectsDemande = projets.filter((project)=> project.besoins_lab.map((e)=>e.text).includes(circle.id))
            setSelectedProjects(projectsDemande);
        }
        
    }

    /* =================== Render =================== */
    return (
        <div className="d-flex flex-column">
            <div className="d-flex justify-content-center col-4 m-auto mb-3">
                <Form.Select
                    value={displayed_property}
                    // Hard codé mais j'arrive pa a faire différemment avec typescript :
                    onChange={(e) =>
                        (e.target.value === "politiques_publiques" ||
                            e.target.value === "direction_metier" ||
                            e.target.value === "etape" ||
                            e.target.value === "besoins_lab") &&
                        setDisplayedProperty(e.target.value)
                    }
                >
                    <option value="politiques_publiques">Politiques publiques</option>
                    <option value="direction_metier">Directions métiers</option>
                    <option value="etape">Étapes</option>
                    <option value="besoins_lab">Besoins lab</option>
                </Form.Select>
            </div>
            <div
                className="d-flex justify-content-center"
                style={{ width: 0.8 * window.innerWidth, height: 0.8 * window.innerHeight }}
            >
                <ResponsiveCirclePacking
                    data={formatData(projets, displayed_property)}
                    margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                    id="name"
                    onClick={handleCircleClick}
                    value="loc"
                    leavesOnly={true}
                    colors={function (e) {
                        return ColorMap[e.data.name];
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
                                        Projects
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

export default MyResponsiveCirclePacking;
