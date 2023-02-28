import { useEffect, useRef, useState } from "react";
import { Columns, ProjectHistory, Projet } from "../../models";
import { privateQuery } from "../../services";
import { AnimateElements } from "./components/AnimateElements";
import { TimeSlider } from "./components/TimeSlider";
import { WeatherChart } from "./components/WeatherChart";
import { WeatherMenu } from "./components/WeatherMenu";
import { AllProjectsHistory, DragElement, Filters, MenuOptions } from "./weatherModels";
import { styles } from "./WeatherStyle";

interface Props {
    setIsLoading: (isLoading: boolean) => void;
    onShowDetails: (projectId: string) => void;
    allProjects: Projet[];
    setAllProjects: (projects: Projet[]) => void;
    refresh: number;
}

export const WeatherPage = (props: Props) => {
    const { setIsLoading, onShowDetails, allProjects, setAllProjects, refresh } = props;
    const [columns, setColumns] = useState<Columns>();
    const [elements, setElements] = useState<DragElement[]>([]);
    const [filters, setFilters] = useState<Filters>(new Filters({}));
    const [allProjectsHistory, setAllProjectsHistory] = useState<AllProjectsHistory>(new AllProjectsHistory([]));
    const [menu, setMenu] = useState<string>(MenuOptions.filter);
    const menuRef = useRef<any>(null);
    const chartRef = useRef<any>(null);
    const sliderRef = useRef<any>(null);
    const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().slice(0, 10));

    const chartProjects = allProjects.filter(
        (project) =>
            project.meteo_precise != null &&
            project.etape_precise != null
    );

    async function updateProject(projectId: string) {
        privateQuery("GET", `/project/${projectId}`, null)
            .then((updatedProject: Projet) => {
                var newProjects = allProjects.map((project) =>
                    project.id === updatedProject.id ? updatedProject : project,
                );
                setAllProjects(newProjects);
            })
            .catch((err: any) => {
                console.log(err);
            });
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

    async function getAllProjectsHistory() {
        privateQuery("GET", `/all_projects_history`, null)
            .then((events: ProjectHistory[]) => {
                setAllProjectsHistory(new AllProjectsHistory(events));
            })
            .catch((err: any) => {
                console.log(err);
            });
    }

    async function saveProject(projectId: string, etapePrecise: number, meteoPrecise: number) {
        privateQuery("POST", `/update_etape_meteo/${projectId}`, {
            etape_precise: etapePrecise,
            meteo_precise: meteoPrecise,
        })
            .then((_) => {
                updateProject(projectId);
            })
            .catch((err: any) => {
                console.log(err);
            });
    }

    const isProjectVisible = (project: Projet) => {
        let isVisible = true;
        if (
            filters.directeurProjet !== "all" &&
            !project.directeur_projet?.map((directeur) => directeur.name).includes(filters.directeurProjet)
        ) {
            isVisible = false;
        }
        if (
            filters.referentsProjet !== "all" &&
            !project.chef_de_projet_ou_referent
                ?.map((referent) => referent.name)
                .includes(filters.referentsProjet)
        ) {
            isVisible = false;
        }
        if (
            filters.politiquesPubliques !== "all" &&
            !project.politiques_publiques
                ?.map((politique_publique) => politique_publique.text)
                .includes(filters.politiquesPubliques)
        ) {
            isVisible = false;
        }
        if (filters.typeActivite !== "all" && project.type_activite?.text !== filters.typeActivite) {
            isVisible = false;
        }
        if (
            filters.etat !== "all" && project.etat?.text !== filters.etat) {
            isVisible = false;
        }
        return isVisible
    }

    function handleExport() {
        const svg = chartRef.current.querySelector("svg");
        const svgString = new XMLSerializer().serializeToString(svg);
        // create a download link
        const downloadLink = document.createElement("a");
        downloadLink.download = "chart.svg";
        downloadLink.href = `data:image/svg+xml;utf8,${encodeURIComponent(svgString)}`;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
    }


    const startAnimation = AnimateElements(setElements);
    const setElementAtThisDate = (date: string) => {
        var endElements: DragElement[] = [];
        //si c'est la date du jour, on affiche les mêmes projets que dans le mode édition pour pas refaire une requete pour mettre à jour allProjectsHistory
        var projectsList = date == new Date().toISOString().slice(0, 10) ? chartProjects : allProjectsHistory.getListOfProjectsAtThisDate(allProjects, date)

        for (var project of projectsList) {
            if (isProjectVisible(project)) {
                endElements.push({
                    xNorm: project.etape_precise ?? 0,
                    yNorm: 1 - (project.meteo_precise ?? 1),
                    project: project,
                });
            }
            startAnimation(elements, endElements);
        }
    };

    useEffect(() => {
        setElementAtThisDate(selectedDate);
    }, [selectedDate]);

    useEffect(() => {
        getColumns();
        getAllProjectsHistory();
    }, []);

    //initialize elements
    useEffect(() => {
        if (filters.mode == "edition") {
            var newElements: DragElement[] = [];
            for (var project of chartProjects) {
                if (isProjectVisible(project)) {
                    newElements.push({
                        xNorm: project.etape_precise ?? 0,
                        yNorm: 1 - (project.meteo_precise ?? 1),
                        xStart: 0,
                        yStart: 0,
                        offsetX: 0,
                        offsetY: 0,
                        active: false,
                        project: project,
                    });
                }
            }
            startAnimation(elements, newElements, 150);
        } else {
            setElementAtThisDate(selectedDate);
        }
    }, [refresh, filters]);

    const buildChart = () => {
        return (
            <div style={styles.chartContainer} ref={chartRef}>
                <WeatherChart
                    columns={columns}
                    elements={elements}
                    setElements={setElements}
                    onShowDetails={onShowDetails}
                    saveProject={saveProject}
                    mode={filters.mode}
                    menuRef={menuRef}
                    sliderRef={sliderRef}
                />
            </div>
        );
    };

    return (
        <div className="px-3 py-3">
            <WeatherMenu
                menuRef={menuRef}
                setFilters={setFilters}
                filters={filters}
                chartProjects={chartProjects}
                columns={columns}
                handleExport={handleExport}
                menu={menu}
                setMenu={setMenu}
            />

            {buildChart()}
            {filters.mode == "evolution" && (
                <div className="d-flex" style={styles.sliderContainer} ref={sliderRef}>
                    <TimeSlider
                        allProjectsHistory={allProjectsHistory}
                        onChange={setSelectedDate}
                    />
                </div>
            )}
        </div>
    );
};
