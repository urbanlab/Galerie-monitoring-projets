import { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { Columns, Projet } from "../../models";
import { privateQuery } from "../../services";
import BarChartBudget from "./components/BarChartBudget";
import BarChart from "./components/BarChartSteps";
import MeteoCircleChart from "./components/MeteoCircleChart";
import { PieChart } from "./components/PieChart";
import { styles } from "./HomeStyle";

interface Props {
    projets: Projet[];
    setIsLoading: (isLoading: boolean) => void;
}

const getProjectsByMeteo = (projets: Projet[], meteo: string) => {
    return projets.filter((projet) => projet.meteo?.includes(meteo)).length;
};

export const HomePage = ({ projets, setIsLoading }: Props) => {
    const [columns, setColumns] = useState<Columns>();
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
        <Container fluid style={{ backgroundColor:"#DEDEDE"}}>
            <Row  className="my-5 mx-3">
                <Col md={7} className="p-2" style={styles.col}>
                    <p style={styles.title} className="m-2">
                        Nombre des projets selon l'étape
                    </p>
                    <div style={styles.chart}>
                        <BarChart projects={projets} columns={columns} />
                    </div>
                </Col>
                <Col md={4} className="p-2" style={styles.col}>
                    <p style={styles.title} className="m-2">
                        Méteo
                    </p>
                    <div style={styles.chart} className="m-auto">
                        {meteoFormatted && <MeteoCircleChart meteo={meteoFormatted} />}
                    </div>
                </Col>
            </Row>
            <Row  className="my-5 mx-3">
                <Col md={7} className="p-2" style={styles.col}>
                    <p style={styles.title} className="m-2">
                        Budget par type d'activité
                    </p>
                    <div style={{...styles.chart,marginLeft:"20px"}}>
                        <BarChartBudget projects={projets}></BarChartBudget>
                    </div>
                </Col>

                <Col md={4} className="p-2" style={styles.col}>
                    <p style={styles.title} className="m-2">
                        Status des projets
                    </p>
                    <div style={styles.chart} className="m-auto">
                        <PieChart projects={projets} columns={columns} />
                    </div>
                </Col>
            </Row>
        </Container>
    );
};
