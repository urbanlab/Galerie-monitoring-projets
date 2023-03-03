import { useEffect, useRef, useState } from "react";
import { Columns, ProjectHistory, Projet } from "../../models";
import { privateQuery } from "../../services";
import { exportAsSVG } from "../../utils/export";
import { AnimateElements } from "./components/AnimateElements";
import { TimeSlider } from "./components/TimeSlider";
import { WeatherChart } from "./components/WeatherChart";
import { WeatherMenu } from "./components/WeatherMenu";
import { AllProjectsHistory, DragElement, Filters, MenuMode, MenuOptions } from "./weatherModels";
import { styles } from "./WeatherStyle";

interface Props {
    setIsLoading: (isLoading: boolean) => void;
    onShowDetails: (projectId: string) => void;
    allProjects: Projet[];
    filteredProjects: Projet[];
    setAllProjects: (projects: Projet[]) => void;
    refresh: number;
    filters: Filters;
    setFilters: (filters: Filters) => void;
    columns: Columns | undefined;
    setColumns: (columns: Columns) => void;
}

export const WeatherPage = (props: Props) => {
    const { setIsLoading, onShowDetails, allProjects, setAllProjects, filteredProjects, refresh, filters, setFilters, columns, setColumns } = props;
    const [elements, setElements] = useState<DragElement[]>([]);
    const [allProjectsHistory, setAllProjectsHistory] = useState<AllProjectsHistory>(new AllProjectsHistory([]));
    const [menu, setMenu] = useState<string>(MenuOptions.FILTER);
    const menuRef = useRef<any>(null);
    const sliderRef = useRef<any>(null);
    const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().slice(0, 10));
    const [showAllLabels, setShowAllLabels] = useState<boolean>(false);

    const chartProjects = filteredProjects.filter(
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

    function handleExport() {
        const svg: any = document.querySelector(".weatherChart svg");
        let date = new Date().toISOString().slice(0, 10);

        if (filters.mode == MenuMode.EVOLUTION) {
            date = selectedDate;
        }
        let fileName = `meteo_${date}`;
        setShowAllLabels(true);
        setTimeout(() => {
            exportAsSVG(svg, fileName);
            setShowAllLabels(false);
        }, 100);

        //setShowAllLabels(false);
    }


    const startAnimation = AnimateElements(setElements);
    const setElementAtThisDate = (date: string) => {
        var endElements: DragElement[] = [];
        //si c'est la date du jour, on affiche les mêmes projets que dans le mode édition pour pas refaire une requete pour mettre à jour allProjectsHistory
        var projectsList = date == new Date().toISOString().slice(0, 10) ? chartProjects : allProjectsHistory.getListOfProjectsAtThisDate(allProjects, date)

        for (var project of projectsList) {
            if (filters.isProjectVisible(project)) {
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
        getAllProjectsHistory();
    }, []);

    //initialize elements
    useEffect(() => {
        if (filters.mode == MenuMode.EDITION) {
            var newElements: DragElement[] = [];
            for (var project of chartProjects) {
                if (filters.isProjectVisible(project)) {
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
    }, [refresh, filteredProjects, filters.mode]);

    const buildChart = () => {
        return (
            <div style={styles.chartContainer} className='weatherChart'>
                <WeatherChart
                    columns={columns}
                    elements={elements}
                    setElements={setElements}
                    onShowDetails={onShowDetails}
                    saveProject={saveProject}
                    mode={filters.mode}
                    menuRef={menuRef}
                    sliderRef={sliderRef}
                    showAllLabels={showAllLabels}
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
                chartProjects={allProjects}
                columns={columns}
                handleExport={handleExport}
                menu={menu}
                setMenu={setMenu}
            />

            {buildChart()}
            {filters.mode == MenuMode.EVOLUTION && (
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
