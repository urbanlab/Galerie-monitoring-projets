import { faLink, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { useEffect, useState } from "react";
import { Button, Col, Container, Modal, ProgressBar, Row, Stack } from "react-bootstrap";

import { ProjectHistory, Projet } from "../../models";
import { privateQuery } from "../../services";

import CustomBadge from "../../components/CustomBadge";
import IconDisplay from "../../components/IconDisplay";
import PeopleDisplay from "../../components/PeopleDisplay";
import DisplayPeriode from "./components/DisplayPeriode";
import DisplaySimpleProperty from "./components/DisplaySimpleProperty";
import MeteoCommentaire from "./components/MeteoCommentaire";
import { ProjectTimeChart } from "./components/ProjectTimeChart";
interface Props {
    project: Projet;
    onClose: () => void;
    setAllProjects: (projects: Projet[]) => void;
    allProjects: Projet[];
}

/*
    This component is used to display the details of a project.
    It takes a Projet object as a prop.
*/
const ProjectDetailsModal: React.FC<Props> = ({ project, onClose, setAllProjects, allProjects }) => {
    const [projectHistory, setProjectHistory] = useState<ProjectHistory[]>([]);

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

    async function updateProject(projectId: string) {
        privateQuery("GET", `/project/${projectId}`, null)
            .then((updatedProject: Projet) => {
                var newProjects = allProjects.map((project) =>
                    project.id === updatedProject.id ? updatedProject : project,
                );
                setAllProjects(newProjects);
                console.log("set all projects");
            })
            .catch((err: any) => {
                console.log(err);
            });
    }

    return (
        <Modal show={!!project} onHide={onClose} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>
                    <IconDisplay icon={project.icon} /> {project.projet}{" "}
                    {/* <Badge
                        bg={transformStatus(project.etat?.text)}
                        text={project.etat?.text === "Abandonné" ? "dark" : undefined}
                    >
                        {project.etat?.text}
                    </Badge>{" "} */}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {/* Two bootstrap colums of 7 and 5 of size */}
                <Container>
                    <Row>
                        {/* ================== LEFT COLUMN ================== */}
                        <Col lg={7} sm={12} style={{ borderRight: "1px solid #ccc" }}>
                            {/* =============== ETAPE PROJET =============== */}
                            {project.etape.length > 0 && (
                                <Stack className="col-md-12 mx-auto text-center">
                                    <p className="my-1 fs-2">
                                        <FontAwesomeIcon icon={faSpinner} /> ÉTAPE PROJET
                                    </p>
                                    {project.etape.map((etape, index) => (
                                        <p key={index} className="mb-1 fs-5">
                                            <CustomBadge coloredText={etape} />
                                        </p>
                                    ))}
                                    {project.etape_precise && (
                                        <div className="d-flex justify-content-center align-items-center mt-2 mb-5">
                                            <ProgressBar
                                                className="col-md-3"
                                                variant="primary"
                                                now={project.etape_precise * 100}
                                                // label={`${(project.etape_precise * 100).toFixed(0)}%`}
                                            />
                                            <div className="ms-1 "> {(project.etape_precise * 100).toFixed(0)}%</div>
                                        </div>
                                    )}
                                </Stack>
                            )}

                            {/* =============== DESCRIPTION DU PROJET =============== */}
                            {project.objet && (
                                <DisplaySimpleProperty
                                    property_name="Description"
                                    property_value={<p>{project.objet}</p>}
                                />
                            )}

                            {/* =============== PERIODE PRINCIPALE =============== */}
                            {project.periode_principale && (
                                <DisplaySimpleProperty
                                    property_name="Période principale"
                                    property_value={
                                        <DisplayPeriode
                                            periode_name="Periode principale"
                                            periode={project.periode_principale}
                                        />
                                    }
                                />
                            )}

                            {/* =============== PERIODE PEPARATOIRE =============== */}
                            {project.periode_preparatoire && (
                                <DisplaySimpleProperty
                                    property_name="Période préparatoire"
                                    property_value={
                                        <DisplayPeriode
                                            periode_name="Période préparatoire"
                                            periode={project.periode_preparatoire}
                                        />
                                    }
                                />
                            )}

                            {/* =============== CHARGE ERASME =============== */}
                            {project.charge_erasme && (
                                <DisplaySimpleProperty
                                    property_name="Charge Erasme"
                                    property_value={<p>{project.charge_erasme} JH</p>}
                                />
                            )}

                            {/* =============== DIRECTEUR PROJET =============== */}
                            {project.directeur_projet && (
                                <DisplaySimpleProperty
                                    property_name="Directeur de projet"
                                    property_value={project.directeur_projet.map((directeur) => (
                                        <span key={directeur.id}>
                                            <PeopleDisplay person={directeur} />{" "}
                                        </span>
                                    ))}
                                />
                            )}

                            {/* =============== CHEF DE PROJET =============== */}
                            {project.chef_de_projet_ou_referent && (
                                <DisplaySimpleProperty
                                    property_name="Chef de projet"
                                    property_value={project.chef_de_projet_ou_referent.map((chef) => (
                                        <span key={chef.id}>
                                            <PeopleDisplay person={chef} />{" "}
                                        </span>
                                    ))}
                                />
                            )}
                        </Col>

                        {/* ================== RIGHT COLUMN ================== */}
                        <Col lg={5} sm={12}>
                            {/* =============== METEO DU PROJET =============== */}
                            <Stack className="col-md-12 mx-auto text-center mt-3 mb-5">
                                <p className="display-2">{project.meteo}</p>
                                {project.meteo_precise && (
                                    <div className="d-flex justify-content-center align-items-center mt-3">
                                        <ProgressBar
                                            className="col-md-3"
                                            variant={
                                                project.meteo_precise * 100 < 33
                                                    ? "danger"
                                                    : project.meteo_precise * 100 < 66
                                                    ? "warning"
                                                    : "success"
                                            }
                                            now={project.meteo_precise * 100}
                                            // label={`${(project.meteo_precise * 100).toFixed(0)}%`}
                                        />
                                        <div className="ms-1 "> {(project.meteo_precise * 100).toFixed(0)}%</div>
                                    </div>
                                )}
                            </Stack>

                            {/* =============== COMMENTAIRE METEO =============== */}
                            <MeteoCommentaire
                                project_id={project.id}
                                commentaire={project.meteo_commentaire}
                                updateProjects={updateProject}
                            />

                            {/* =============== TYPE ACTIVITE =============== */}
                            {project.type_activite && (
                                <div className="d-flex justify-content-end fs-5 mb-1">
                                    <CustomBadge coloredText={project.type_activite} key="type_activite" />
                                </div>
                            )}

                            {/* =============== ETAT PROJET =============== */}
                            {project.etat && (
                                <div className="d-flex justify-content-end fs-5 mb-1">
                                    <CustomBadge coloredText={project.etat} key="etat_projet" />
                                </div>
                            )}

                            {/* =============== POLITIQUES PUBLIQUES =============== */}
                            {project.politiques_publiques && (
                                <>
                                    {project.politiques_publiques.map((politique) => (
                                        <div className="d-flex justify-content-end fs-6 mb-1" key={politique.text}>
                                            <CustomBadge coloredText={politique} />{" "}
                                        </div>
                                    ))}
                                </>
                            )}

                            {/* =============== DIRECTIONS METIERS =============== */}
                            {project.direction_metier && (
                                <>
                                    {project.direction_metier.map((direction) => (
                                        <div className="d-flex justify-content-end fs-6 mb-1" key={direction.text}>
                                            <CustomBadge coloredText={direction} />{" "}
                                        </div>
                                    ))}
                                </>
                            )}

                            {/* =============== Besoins lab =============== */}
                            {project.besoins_lab && (
                                <>
                                    <DisplaySimpleProperty property_name="Besoins lab" property_value={""} />
                                    {project.besoins_lab.map((besoin) => (
                                        <div className="d-flex justify-content-end fs-6 mb-1" key={besoin.text}>
                                            <CustomBadge coloredText={besoin} />{" "}
                                        </div>
                                    ))}
                                </>
                            )}

                            {/* =============== LINK TO NOTION =============== */}
                            <div className="mx-auto text-center mt-3">
                                <Button
                                    variant="outline-primary"
                                    size="sm"
                                    onClick={() => {
                                        window.open(project.notion_url);
                                    }}
                                >
                                    <FontAwesomeIcon className="align-middle" icon={faLink} /> Open in Notion
                                </Button>
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        {/* =============== Historique du projet =============== */}
                        {projectHistory.length > 0 && (
                            <>
                                <DisplaySimpleProperty property_name="Historique du projet" property_value="" />
                                <Container>
                                    <Row>
                                        <Col lg={6} sm={12}>
                                            <div className="px-3" style={{ width: "100%", height: 250 }}>
                                                <ProjectTimeChart projectHistory={projectHistory} type={"etape"} />
                                            </div>
                                        </Col>
                                        <Col lg={6} sm={12}>
                                            <div className="px-3" style={{ width: "100%", height: 250 }}>
                                                <ProjectTimeChart projectHistory={projectHistory} type={"meteo"} />
                                            </div>
                                        </Col>
                                    </Row>
                                </Container>
                            </>
                        )}
                    </Row>
                </Container>
            </Modal.Body>
        </Modal>
    );
};

export default ProjectDetailsModal;
