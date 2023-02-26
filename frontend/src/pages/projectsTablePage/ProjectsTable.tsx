import { faCircleInfo, faSortDown, faSortUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Badge, Container, Table } from "react-bootstrap";

import IconDisplay from "../../components/IconDisplay";
import { Projet } from "../../models";

interface ProjectsTableProps {
    projets: Projet[];
    onShowDetails: (projectId: string) => void;
    handleSort: (column: keyof Projet) => void;
    sortDirection: "asc" | "desc";
    sortColumn: keyof Projet;
}

/*
    This component is the table that displays the projects.
    It is used in the projects page.
*/
export default function ProjectsTable(props: ProjectsTableProps): JSX.Element {
    function transformStatus(input: string | undefined) {
        switch (input) {
            case "Entrant":
                return "danger";
            case "En attente":
                return "warning";
            case "En cours ":
                return "success";
            case "Terminé":
                return "secondary";
            case "Abandonné":
                return "light";
            default:
                return "light";
        }
    }

    return (
        <Container fluid="md">
            <Table striped hover size="sm" className="mt-2">
                <thead>
                    <tr>
                        {/* <th>Projet</th> */}
                        <th onClick={() => props.handleSort("projet")} style={{ cursor: "pointer" }}>
                            Projets{" "}
                            {props.sortColumn === "projet" && (
                                <FontAwesomeIcon
                                    className="align-middle"
                                    icon={props.sortDirection === "asc" ? faSortUp : faSortDown}
                                />
                            )}
                        </th>
                        {/* <th>Category</th>
                    <th onClick={() => props.handleSort('status')} style={{ cursor: 'pointer' }}>
                        Status{" "}
                        {props.sortColumn === 'status' && (
                            <FontAwesomeIcon icon={props.sortDirection === 'asc' ? faSortUp : faSortDown} />
                        )}
                    </th>
                    <th>Meteo</th>
                    <th>Description</th> */}
                    </tr>
                </thead>
                <tbody>
                    {props.projets.map((projet) => (
                        <tr key={projet.id} className="align-middle">
                            <td style={{ cursor: "pointer" }} onClick={() => props.onShowDetails(projet.id)}>
                                <IconDisplay icon={projet.icon} /> {projet.projet}{" "}
                                <Badge
                                    pill
                                    bg={transformStatus(projet.etat?.text)}
                                    text={projet.etat?.text === "Abandonné" ? "dark" : undefined}
                                >
                                    {projet.etat?.text}
                                </Badge>
                            </td>
                            {/* <td>{project.objet}</td> */}
                            {/* <td>
                            <ProgressBar
                                now={project.advancement}
                                label={`${project.advancement}%`} />
                        </td>
                        <td>{project.category}</td>
                        <td>{project.status}</td>
                        <td>{project.meteo}</td>
                        <td>{project.description}</td> */}
                            <td>
                                <FontAwesomeIcon
                                    className="align-middle mx-2"
                                    style={{ cursor: "pointer" }}
                                    icon={faCircleInfo}
                                    onClick={() => props.onShowDetails(projet.id)}
                                    color="royalblue"
                                />
                                {/* <Button variant="primary" size="sm" onClick={() => props.onShowDetails(project.id)}>
                                Show Details
                            </Button> */}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </Container>
    );
}
