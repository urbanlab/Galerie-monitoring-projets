import { faDownload } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
import { Columns, Projet } from "../../models";
import { privateQuery } from "../../services";
import { exportAsSVG } from "../../utils/export";
import BarChartBudget from "./components/BarChartBudget";
import BarChart from "./components/BarChartSteps";
import MeteoCircleChart from "./components/MeteoCircleChart";
import { PieChart } from "./components/PieChart";
import { styles } from "./HomeStyle";

interface Props {
    projets: Projet[];
    setIsLoading: (isLoading: boolean) => void;
    showProjectsTableModal: (title: string, filter: (projet: Projet) => boolean) => void;
}

const getProjectsByMeteo = (projets: Projet[], meteo: string | null) => {
    if (!meteo) return 0;
    return projets.filter((projet) => projet.meteo?.includes(meteo)).length;
};

const formatMeteo = (projets: Projet[]) => {
    const meteos = projets.map((projet) => projet.meteo);
    const meteoSet = new Set(meteos);
    const meteoArray = Array.from(meteoSet).filter((w) => w !== null);
    const meteoFormatted = {
        name: "root",
        children:
            meteoArray?.map((meteo) => {
                const count = getProjectsByMeteo(projets, meteo);
                return {
                    name: meteo,
                    loc: count,
                };
            }) ?? [],
    };
    return meteoFormatted;
};

export const HomePage = ({ projets, setIsLoading, showProjectsTableModal }: Props) => {
    const [columns, setColumns] = useState<Columns>();
    const [meteoFormatted, setMeteoFormatted] = useState<any>(formatMeteo(projets));


    function handleExport(className: string, fileName: string) {
        const svg: any = document.querySelector(`.${className} svg`);
        exportAsSVG(svg, fileName);
    }

    async function getColumns() {
        setIsLoading(true);
        privateQuery("GET", `/columns_data`, null)
            .then((events: Columns) => {
                setColumns(events);
                setIsLoading(false);
            })
            .catch((err: any) => {
                console.log(err);
            });
    }

    useEffect(() => {
        setMeteoFormatted(formatMeteo(projets));
    }, [projets]);

    useEffect(() => {
        getColumns();
    }, []);
    return (
        <div className="col-xl-10 col-lg-12 mx-auto text-center">
            <Container fluid>
                <Row className="mx-5 mb-1">
                    <Col md={8} className="ps-5 pe-3 pb-4">

                        <div className="p-2 bg-light" style={styles.shadow}>
                            <div style={{ display: "flex", alignItems: "center" }}>
                                <p style={styles.title} className="m-2">
                                    Nombre des projets selon l'étape
                                </p>
                                <Button
                                    variant="outline-secondary"
                                    onClick={() => handleExport("barchart", "BarChart")}
                                >
                                    <FontAwesomeIcon icon={faDownload} />
                                </Button>
                            </div>
                            <div style={styles.chart} className="barchart">
                                <BarChart
                                    projects={projets}
                                    columns={columns}
                                    showProjectsTableModal={showProjectsTableModal}
                                />
                            </div>
                        </div>
                    </Col>
                    <Col md={4} className="ps-3 pe-5 pb-4">
                        <div className="p-2 bg-light" style={styles.shadow}>
                            <div style={{ display: "flex", alignItems: "center" }}>
                                <p style={styles.title} className="m-2">
                                    Méteo
                                </p>
                                <Button
                                    variant="outline-secondary"
                                    onClick={() => handleExport("MeteoCircle", "MeteoCircleChart")}
                                >
                                    <FontAwesomeIcon icon={faDownload} />
                                </Button>
                            </div>
                            <div style={styles.chart} className="MeteoCircle">
                                <MeteoCircleChart
                                    meteo={meteoFormatted}
                                    showProjectsTableModal={showProjectsTableModal}
                                />
                            </div>
                        </div>
                    </Col>
                </Row>
                <Row className="mx-5 my-1">
                    <Col md={8} className="ps-5 pe-3 pb-2">
                        <div className="p-2 bg-light" style={styles.shadow}>
                            <div style={{ display: "flex", alignItems: "center" }}>
                                <p style={styles.title} className="m-2">
                                    Budget par type d'activité
                                </p>
                                <Button
                                    variant="outline-secondary"
                                    onClick={() => handleExport("BudgetBarChart", "BudgetBarChart")}
                                >
                                    <FontAwesomeIcon icon={faDownload} />
                                </Button>
                            </div>
                            <div style={{ ...styles.chart }} className="BudgetBarChart">
                                <BarChartBudget projects={projets}></BarChartBudget>
                            </div>
                        </div>
                    </Col>

                    <Col md={4} className="ps-3 pe-5 pb-2">
                        <div className="p-2 bg-light" style={styles.shadow}>
                            <div style={{ display: "flex", alignItems: "center" }}>
                                <p style={styles.title} className="m-2">
                                    Status des projets
                                </p>
                                <Button
                                    variant="outline-secondary"
                                    onClick={() => handleExport("PieChart", "PieChart")}
                                >
                                    <FontAwesomeIcon icon={faDownload} />
                                </Button>
                            </div>
                            <div style={styles.chart} className="PieChart">
                                <PieChart
                                    projects={projets}
                                    columns={columns}
                                    showProjectsTableModal={showProjectsTableModal}
                                />
                            </div>
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};
