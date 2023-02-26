import {
    faArrowRight,
    faBuilding,
    faCalendarDays,
    faCircleQuestion,
    faClockRotateLeft,
    faFilePen,
    faFlask,
    faHandshake,
    faLink,
    faMapPin,
    faPersonDrowning,
    faSpinner,
    faTemperature0,
    faUserTie,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { useEffect, useState } from "react";
import { Badge, Button, Col, Container, Modal, ProgressBar, Row, Stack } from "react-bootstrap";

import { ProjectHistory, Projet } from "../../models";
import { privateQuery } from "../../services";

import CustomBadge from "../../components/CustomBadge";
import IconDisplay from "../../components/IconDisplay";
import PeopleDisplay from "../../components/PeopleDisplay";
import { ProjectTimeChart } from "./components/ProjectTimeChart";

interface Props {
    project: Projet;
    onClose: () => void;
}

/*
    This component is used to display the details of a project.
    It takes a Projet object as a prop.
*/
const ProjectDetailsModal: React.FC<Props> = ({ project, onClose }) => {
    const [projectHistory, setProjectHistory] = useState<ProjectHistory[]>([]);

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

    async function getProjectHistory() {
        privateQuery("GET", `/project_history/${project.id}`, null)
            .then((events: ProjectHistory[]) => {
                setProjectHistory(events);
            })
            .catch((err: any) => {
                console.log(err);
            });
    }
    useEffect(() => {
        getProjectHistory();
    }, []);

    return (
        <Modal show={!!project} onHide={onClose} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>
                    <IconDisplay icon={project.icon} /> {project.projet}{" "}
                    <Badge
                        bg={transformStatus(project.etat?.text)}
                        text={project.etat?.text === "Abandonné" ? "dark" : undefined}
                    >
                        {project.etat?.text}
                    </Badge>{" "}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {/* =============== Description du projet =============== */}
                {project.objet && (
                    <div className="mb-3">
                        <strong>
                            <FontAwesomeIcon icon={faCircleQuestion} key="description" /> Description :
                        </strong>{" "}
                        {project.objet}
                    </div>
                )}

                {project.etape.length > 0 && project.meteo && (
                    <Container className="my-4 py-2">
                        <Row key="main">
                            {project.etape.length > 0 && (
                                // =============== Etapes du projet ===============
                                <Col key="Avancement">
                                    <Stack className="col-md-12 mx-auto text-center">
                                        <p className="mb-1">
                                            <strong>
                                                <FontAwesomeIcon icon={faSpinner} /> AVANCEMENT
                                            </strong>
                                        </p>
                                        {project.etape.map((etape, index) => (
                                            <p key={index} className="mb-1">
                                                <CustomBadge coloredText={etape} />
                                            </p>
                                        ))}

                                        {project.etape_precise && (
                                            <div className="d-flex justify-content-center">
                                                <ProgressBar
                                                    striped
                                                    animated
                                                    className="mt-3 col-md-10"
                                                    variant="primary"
                                                    now={project.etape_precise * 100}
                                                    label={`${(project.etape_precise * 100).toFixed(0)}%`}
                                                />
                                            </div>
                                        )}
                                    </Stack>
                                </Col>
                            )}
                            {project.etape.length > 0 && project.meteo && (
                                <Col className="col-md-1 text-center" key="vertical_bar">
                                    <div style={{ height: "100%" }} className="vr" />
                                </Col>
                            )}
                            {project.meteo && (
                                // =============== Météo du projet ===============
                                <Col key="Meteo">
                                    <Stack className="col-md-12 mx-auto text-center">
                                        <p className="mb-1">
                                            <strong>
                                                <FontAwesomeIcon icon={faTemperature0} /> MÉTÉO
                                            </strong>
                                        </p>
                                        <p className="display-5 mb-1">{project.meteo}</p>
                                        {project.meteo_precise && (
                                            <div className="d-flex justify-content-center">
                                                <ProgressBar
                                                    className="mt-2 col-md-6"
                                                    variant={
                                                        project.meteo_precise * 100 < 33
                                                            ? "danger"
                                                            : project.meteo_precise * 100 < 66
                                                            ? "warning"
                                                            : "success"
                                                    }
                                                    now={project.meteo_precise * 100}
                                                    label={`${(project.meteo_precise * 100).toFixed(0)}%`}
                                                />
                                            </div>
                                        )}
                                    </Stack>
                                </Col>
                            )}
                        </Row>
                    </Container>
                )}

                {/* =============== Charge ERASME =============== */}
                {project.charge_erasme && (
                    <div className="mb-3 d-flex align-items-center">
                        <strong>
                            <FontAwesomeIcon icon={faPersonDrowning} /> Charge ERASME :
                        </strong>{" "}
                        <ProgressBar
                            className="w-25 mx-2"
                            max={50}
                            variant={
                                project.charge_erasme < 30
                                    ? "success"
                                    : project.charge_erasme < 50
                                    ? "warning"
                                    : "danger"
                            }
                            now={project.charge_erasme}
                            label={`${project.charge_erasme} JH`}
                            key="charge_erasme"
                        />
                    </div>
                )}

                {/* =============== Types d'activités =============== */}
                {project.type_activite && (
                    <div className="mb-3">
                        <strong>
                            <FontAwesomeIcon icon={faFilePen} /> Type d'activité :
                        </strong>{" "}
                        <CustomBadge coloredText={project.type_activite} key="type_activite" />
                    </div>
                )}

                {/* =============== Politiques publiques =============== */}
                {project.politiques_publiques.length > 0 && (
                    <div className="mb-3">
                        <strong>
                            <FontAwesomeIcon icon={faHandshake} key="politiques_publiques" /> Politiques publiques :
                        </strong>{" "}
                        {project.politiques_publiques.map((politique) => (
                            <span key={politique.text}>
                                <CustomBadge coloredText={politique} />{" "}
                            </span>
                        ))}
                    </div>
                )}

                {/* =============== Directions métiers =============== */}
                {project.direction_metier.length > 0 && (
                    <div className="mb-3">
                        <strong>
                            <FontAwesomeIcon icon={faBuilding} key="diretions_metiers" /> Directions métiers :
                        </strong>{" "}
                        {project.direction_metier.map((direction) => (
                            <span key={direction.text}>
                                <CustomBadge coloredText={direction} />{" "}
                            </span>
                        ))}
                    </div>
                )}

                {/* =============== Besoins lab =============== */}
                {project.besoins_lab.length > 0 && (
                    <div className="mb-3">
                        <strong>
                            <FontAwesomeIcon icon={faFlask} key="besoins_lab" /> Besoins lab :
                        </strong>{" "}
                        {project.besoins_lab.map((besoin) => (
                            <span key={besoin.text}>
                                <CustomBadge coloredText={besoin} />{" "}
                            </span>
                        ))}
                    </div>
                )}

                {/* =============== Periode principale du projet =============== */}

                {project.periode_principale && (
                    <div className="mb-3" key="periode_principale">
                        <strong>
                            <FontAwesomeIcon icon={faCalendarDays} /> Période principale :{" "}
                        </strong>
                        <FontAwesomeIcon icon={faMapPin} />{" "}
                        {project.periode_principale?.start &&
                            new Date(project.periode_principale?.start).toLocaleDateString("fr", {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                            })}{" "}
                        {project.periode_principale?.end && <FontAwesomeIcon icon={faArrowRight} />}{" "}
                        {project.periode_principale?.end &&
                            new Date(project.periode_principale?.end).toLocaleDateString("fr", {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                            })}
                    </div>
                )}

                {/* =============== Periode preparatoire du projet =============== */}
                {project.periode_preparatoire && (
                    <div className="mb-3" key="periode_preparatoire">
                        <strong>
                            <FontAwesomeIcon icon={faCalendarDays} /> Période préparatoire :{" "}
                        </strong>
                        <FontAwesomeIcon icon={faMapPin} />{" "}
                        {project.periode_preparatoire?.start &&
                            new Date(project.periode_preparatoire?.start).toLocaleDateString("fr", {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                            })}{" "}
                        {project.periode_preparatoire?.end && <FontAwesomeIcon icon={faArrowRight} />}{" "}
                        {project.periode_preparatoire?.end &&
                            new Date(project.periode_preparatoire?.end).toLocaleDateString("fr", {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                            })}
                    </div>
                )}

                {/* =============== Directeurs de projets =============== */}
                {project.directeur_projet.length > 0 && (
                    <div className="mb-3 d-flex flex-wrap align-items-center" key="directeurs_projets">
                        <strong>
                            <FontAwesomeIcon icon={faUserTie} /> Directeurs de projet :
                        </strong>{" "}
                        {project.directeur_projet.map((directeur) => (
                            <span key={directeur.id}>
                                <PeopleDisplay person={directeur} />{" "}
                            </span>
                        ))}
                    </div>
                )}

                {/* =============== Chefs de projet ou référents =============== */}
                {project.chef_de_projet_ou_referent.length > 0 && (
                    <div className="mb-3 d-flex flex-wrap align-items-center" key="chefs_projets">
                        <strong>
                            <FontAwesomeIcon icon={faUserTie} /> Chefs de projet ou référents :
                        </strong>{" "}
                        {project.chef_de_projet_ou_referent.map((chef) => (
                            <span key={chef.id}>
                                <PeopleDisplay person={chef} />{" "}
                            </span>
                        ))}
                    </div>
                )}

                {/* =============== Historique du projet =============== */}
                {projectHistory.length > 0 && (
                    <div className="mb-3 d-flex flex-wrap align-items-center" key="history">
                        <strong>
                            <FontAwesomeIcon icon={faClockRotateLeft} /> Historique du projet :
                        </strong>{" "}
                    </div>
                )}
                {projectHistory.length > 0 && (
                    <div className="d-flex">
                        <div className="px-3" style={{ width: "100%", height: 250 }}>
                            <ProjectTimeChart projectHistory={projectHistory} type={"etape"} />
                        </div>

                        <div className="px-3" style={{ width: "100%", height: 250 }}>
                            <ProjectTimeChart projectHistory={projectHistory} type={"meteo"} />
                        </div>
                    </div>
                )}
            </Modal.Body>

            {/* ================== Footer ================== */}
            <Modal.Footer>
                <Button
                    variant="primary"
                    onClick={() => {
                        window.open(project.notion_url);
                    }}
                >
                    <FontAwesomeIcon className="align-middle" icon={faLink} /> Open in Notion
                </Button>
                <Button variant="secondary" onClick={onClose}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ProjectDetailsModal;
