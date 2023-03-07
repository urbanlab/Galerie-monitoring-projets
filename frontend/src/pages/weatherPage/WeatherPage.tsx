import { useEffect, useRef, useState } from "react";
import { Columns, ProjectHistoryItem, Projet } from "../../models";
import { privateQuery } from "../../services";
import { exportAsPNG, exportAsSVG } from "../../utils/export";
import { AnimateElements } from "./components/AnimateElements";
import { TimeSlider } from "./components/TimeSlider";
import { WeatherChart } from "./components/WeatherChart";
import { WeatherMenu } from "./components/WeatherMenu";
import { AllProjectsHistory, DragElement, Filters, MenuMode, MenuOptions } from "./weatherModels";
import { styles } from "./WeatherStyle";

interface Props {
    onShowDetails: (projectId: string) => void;
    allProjects: Projet[];
    setAllProjects: (projects: Projet[]) => void;
    refresh: number;
    filters: Filters;
    setFilters: (filters: Filters) => void;
    columns: Columns | undefined;
}

export const WeatherPage = (props: Props) => {
    const { onShowDetails, allProjects, setAllProjects, refresh, filters, setFilters, columns } = props;
    const [elements, setElements] = useState<DragElement[]>([]); //éléments à afficher sur le graphe
    const [allProjectsHistory, setAllProjectsHistory] = useState<AllProjectsHistory>(new AllProjectsHistory([])); //historique des projets
    const [menu, setMenu] = useState<string>(MenuOptions.FILTER); //menu affiché (filtres ou options)
    const menuRef = useRef<any>(null);
    const sliderRef = useRef<any>(null);
    const today = new Date().toISOString().slice(0, 10); //date du jour au format YYYY-MM-DD
    const [selectedDate, setSelectedDate] = useState<string>(today); //date sélectionnée dans le slider
    const [showAllLabels, setShowAllLabels] = useState<boolean>(false); //afficher ou non tous les labels
    const [elementsScale, setElementsScale] = useState<number>(1); //échelle des éléments (taille des icones)

    const chartProjects = allProjects.filter( //projets affichés sur le graphe (filtrés)
        (project) =>
            project.meteo_precise != null &&
            project.etape_precise != null
    );

    async function updateProject(projectId: string) {
        //fonction qui met à jour un projet
        privateQuery("GET", `/project/${projectId}`, null)
            .then((updatedProject: Projet) => {
                //on met à jour le projet dans la liste des projets
                var newProjects = allProjects.map((project) =>
                    project.id === updatedProject.id ? updatedProject : project,
                );
                setAllProjects(newProjects); //on met à jour la liste des projets
                updateProjectHistory(updatedProject); //on met à jour l'historique des projets

            })
            .catch((err: any) => {
                console.log(err);
            });
    }

    async function getAllProjectsHistory() {
        //fonction qui récupère l'historique des projets
        privateQuery("GET", `/all_projects_history`, null)
            .then((events: ProjectHistoryItem[]) => {
                setAllProjectsHistory(new AllProjectsHistory(events));
            })
            .catch((err: any) => {
                console.log(err);
            });
    }

    async function saveProject(projectId: string, etapePrecise: number, meteoPrecise: number) {
        //fonction qui sauvegarde les données météo et étape précise d'un projet
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

    useEffect(() => {
        getAllProjectsHistory();
    }, []);

    const updateProjectHistory = (project: Projet) => {
        //fonction qui met à jour l'historique des projets quand on bouge un projet sur le graphe
        if (project.etape_precise == null || project.meteo_precise == null) {
            return;
        }

        var newProjectHistoryItem = {
            project_id: project.id,
            date: today,
            etape_precise: project.etape_precise!,
            meteo_precise: project.meteo_precise!,
        };
        if (allProjectsHistory.fullHistory.filter((projectHistoryItem) =>
            projectHistoryItem.project_id === project.id &&
            projectHistoryItem.date === today).length == 0) {
            //si l'historique du projet pour la date du jour n'existe pas, on l'ajoute
            setAllProjectsHistory(new AllProjectsHistory([...allProjectsHistory.fullHistory, newProjectHistoryItem]));
            return;
        }
        else {
            //sinon on le met à jour
            var newProjectHistory = allProjectsHistory.fullHistory.map((projectHistoryItem) =>
                projectHistoryItem.project_id === project.id &&
                    projectHistoryItem.date === today
                    ? newProjectHistoryItem
                    : projectHistoryItem,
            );
            setAllProjectsHistory(new AllProjectsHistory(newProjectHistory));
        }
    };

    function handleExportWeather(type: string) {
        //fonction qui exporte le svg
        const svg: any = document.querySelector(".weatherChart svg");
        let date = today;

        if (filters.mode == MenuMode.EVOLUTION) {
            date = selectedDate;
        }
        let fileName = `meteo_${date}`;
        if (!showAllLabels) {
            //si les labels sont désactivés, on les affiche pour l'export puis on les désactive après
            setShowAllLabels(true);
            setTimeout(() => {
                if (type == "png") exportAsPNG(svg, fileName);
                else exportAsSVG(svg, fileName);
                setShowAllLabels(false);
            }, 100);
        } else {
            //si les labels sont activés, on exporte directement
            if (type == "png") exportAsPNG(svg, fileName);
            else exportAsSVG(svg, fileName);
        }
    }

    const startAnimation = AnimateElements(setElements);

    //initialize elements for evolution mode
    useEffect(() => {
        if (filters.mode == MenuMode.EVOLUTION) {
            var endElements: DragElement[] = [];
            //si c'est la date du jour, on affiche les mêmes projets que dans le mode édition pour pas refaire une requete pour mettre à jour allProjectsHistory
            var projectsList = allProjectsHistory.getListOfProjectsAtThisDate(allProjects, selectedDate)

            for (var project of projectsList) {
                if (filters.isProjectVisible(project)) {
                    endElements.push({
                        xNorm: project.etape_precise ?? 0,
                        yNorm: 1 - (project.meteo_precise ?? 1),
                        project: project,
                    });
                }
            }
            startAnimation(elements, endElements);
        }
    }, [selectedDate, allProjectsHistory, filters]);


    //initialize elements for edition mode
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
        }
    }, [refresh, filters]);

    return (
        <div className="px-3 py-3">
            <WeatherMenu
                menuRef={menuRef}
                setFilters={setFilters}
                filters={filters}
                chartProjects={allProjects}
                columns={columns}
                handleExportWeather={handleExportWeather}
                menu={menu}
                setMenu={setMenu}
                setShowAllLabels={setShowAllLabels}
                elementsScale={elementsScale}
                setElementsScale={setElementsScale}
                showAllLabels={showAllLabels}
            />

            <div style={styles.chartContainer} className="weatherChart">
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
                    elementsScale={elementsScale}
                />
            </div>
            {filters.mode == MenuMode.EVOLUTION && (
                <div className="d-flex" style={styles.sliderContainer} ref={sliderRef}>
                    <TimeSlider allProjectsHistory={allProjectsHistory} onChange={setSelectedDate} />
                </div>
            )}
        </div>
    );
};
