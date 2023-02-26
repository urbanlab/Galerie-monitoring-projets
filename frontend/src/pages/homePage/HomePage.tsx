import { useEffect, useState } from "react";
import { Card, Col, Container, Row } from "react-bootstrap";

import { Columns, Projet } from "../../models";
import { privateQuery } from "../../services";

import BarChartBudget from "./components/BarChartBudget";
import BarChart from "./components/BarChartSteps";
import MeteoCircleChart from "./components/MeteoCircleChart";
import { PieChart } from "./components/PieChart";

interface Props {
    projets: Projet[];
    setIsLoading: (isLoading: boolean) => void;
}

const getProjectsByState = (projets: Projet[], state: string) => {
    return projets.filter((projet) => projet.etat?.text.includes(state)).length;
};

const getProjectsByMeteo = (projets: Projet[], meteo: string) => {
    return projets.filter((projet) => projet.meteo?.includes(meteo)).length;
};

export const HomePage = ({ projets, setIsLoading }: Props) => {
    const [columns, setColumns] = useState<Columns>();
    const etat =
        columns?.etats?.map((etat) => {
            const count = getProjectsByState(projets, etat.text);
            return (
                <Col
                    style={{
                        display: "flex",
                        backgroundColor: etat.color,
                        height: "60px",
                        color: "#ffffff",
                        fontSize: "20px",
                        justifyContent: "center",
                        alignItems: "center",
                        border: "solid black 0.5px",
                        margin: "5px",
                    }}
                >
                    {etat.text}: {count}
                </Col>
            );
        }) ?? [];
    const meteo =
        columns?.meteos?.map((meteo, index) => {
            const count = getProjectsByMeteo(projets, meteo);
            const color = ["warning", "light", "info"];
            return (
                <Card
                    bg={color[index]}
                    key={index}
                    text={color[index] === "light" ? "dark" : "white"}
                    style={{ width: "18rem" }}
                    className="mb-2"
                >
                    <Card.Header>{meteo} Projects </Card.Header>
                    <Card.Body>
                        <Card.Text>{count}</Card.Text>
                    </Card.Body>
                </Card>
            );
        }) ?? [];

    const getWeatherType = (weather: string): string => {
        switch (weather) {
            case "☀️":
                return "sunny";
            case "⛅️":
                return "cloudy";
            case "🌧":
                return "rainy";
            default:
                return "unknown";
        }
    };

    const meteoFormatted = {
        name: "root",
        children:
            columns?.meteos?.map((meteo) => {
                const count = getProjectsByMeteo(projets, meteo);
                return {
                    name: getWeatherType(meteo),
                    loc: count,
                };
            }) ?? [],
    };

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
        getColumns();
    }, []);
    return (
        <Container fluid>
            <Row style={{ height: "30vh" }} className="my-5 mx-3">
                <Col md={6}>
                    {/* 
                    <CardGroup>
                        {meteo}
                    </CardGroup> */}
                    <div style={{ height: "30vh", width: "100%" }} className="m-auto">
                        {meteoFormatted && <MeteoCircleChart meteo={meteoFormatted} />}
                    </div>
                </Col>
                <Col md={6}>
                    <p style={{ fontSize: "20px", fontWeight: "bold", textAlign: "center" }} className="m-2">
                        Status des projets
                    </p>
                    <div style={{ height: "30vh", width: "100%" }} className="m-auto">
                        <PieChart projects={projets} columns={columns} />
                    </div>
                </Col>
            </Row>
            <Row style={{ height: "30vh" }} className="my-5 mx-3">
                <Col md={6}>
                    <BarChartBudget projects={projets} columns={columns}></BarChartBudget>
                </Col>
                <Col md={6} className="p-2">
                    <div style={{ height: "32vh", width: "100%" }}>
                        <p style={{ fontSize: "20px", fontWeight: "bold", textAlign: "center" }} className="m-2">
                            Nombre des projets selon l'étape
                        </p>
                        <BarChart projects={projets} columns={columns} />
                    </div>
                </Col>
                <Col md={6} className="p-2">
                    {/* <div style={{ height: '32vh', width: '100%' }} >
                        <p style={{ fontSize: '20px', fontWeight: 'bold', textAlign: 'center' }} className="m-2">Nombre des projets selon l'étape</p>
                        <BarChart projects={projets} columns={columns} />
                    </div> */}
                </Col>
            </Row>
        </Container>
    );
};
