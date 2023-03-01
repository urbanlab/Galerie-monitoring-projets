import { faCircleInfo } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Badge, Container, Table } from "react-bootstrap";

import IconDisplay from "../../components/IconDisplay";
import { Projet } from "../../models";

interface ProjectsTableProps {
    projets: Projet[];
    onShowDetails: (projectId: string) => void;
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
                            <td>
                                <FontAwesomeIcon
                                    className="align-middle mx-2"
                                    style={{ cursor: "pointer" }}
                                    icon={faCircleInfo}
                                    onClick={() => props.onShowDetails(projet.id)}
                                    color="royalblue"
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </Container>
    );
}
