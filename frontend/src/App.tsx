import "@fontsource/montserrat";
import { Buffer } from "buffer";
import { memo, useEffect, useState } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import { FiltersMenu } from "./components/FiltersMenu";
import NavBar from "./components/Navbar";
import ProjectsTableModal from "./components/ProjectsTableModal";
import mockProjets from "./mock-data";
import { Columns, Projet } from "./models";
import MyResponsiveCirclePacking from "./pages/circlePackingPage/CirclePackingPage";
import { HomePage } from "./pages/homePage/HomePage";
import Login from "./pages/loginPage/LoginPage";
import ProjectDetailsModal from "./pages/projectDetailsModal/ProjectDetailsModal";
import ProjectsTable from "./pages/projectsTablePage/ProjectsTable";
import { Filters } from "./pages/weatherPage/weatherModels";
import { WeatherPage } from "./pages/weatherPage/WeatherPage";
import { privateQuery, useToken } from "./services";

function PrivateRoute({ children }: any) {
    const { token } = useToken();

    if (!token) return <Navigate to="/login" />;
    const claimsB64 = token.substring(token.indexOf("."), token.lastIndexOf("."));
    try {
        const claims = JSON.parse(Buffer.from(claimsB64, "base64").toString());
        const expireDate = new Date(claims.valid_until);
        if (expireDate.getTime() < Date.now()) {
            // jwt is expired, it is therefore cleared from local storage
            localStorage.clear();
            return <Navigate to="/login" />;
        }
        // jwt is still valid it will be sent in upcoming api calls
        return children;
    } catch (err) {
        // jwt cannot be decoded : it is invalid and therefore cleared from local storage
        localStorage.clear();
        return <Navigate to="/login" />;
    }
}

function OnlyPublicRoute({ children }: any) {
    const { token } = useToken();
    return !token ? children : <Navigate to="/" />;
}

const App = () => {
    const { token, setToken } = useToken();
    const [projectDetailsIsOpen, setProjectDetailsIsOpen] = useState<boolean>(false);
    const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
    const [selectedProjects, setSelectedProjects] = useState<Projet[]>([]);
    const [ProjectsTableModalTitle, setProjectsTableModalTitle] = useState<string>("");
    const [projects, setProjects] = useState<Projet[]>(mockProjets);
    const [isLoading, setIsLoading] = useState(false);
    const [refresh, setRefresh] = useState(0);
    const [filters, setFilters] = useState<Filters>(new Filters({}));
    const [filteredProjects, setFilteredProjects] = useState<Projet[]>([]);
    const [columns, setColumns] = useState<Columns>();

    const cachedProjects = () => {
        setIsLoading(true);
        privateQuery("GET", `/cached_projects`, null)
            .then((events: Projet[]) => {
                setProjects(events);
                setRefresh(1);
            })
            .catch((err: any) => {
                console.log(err);
            });
    };

    const updateProjects = () => {
        setIsLoading(true);
        privateQuery("GET", `/all_projects`, null)
            .then((events: Projet[]) => {
                setProjects(events);
                setIsLoading(false);
                setRefresh(2);
            })
            .catch((err: any) => {
                console.log(err);
            });
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
        cachedProjects();
        getColumns();
        updateProjects();
    }, []);

    /* =================== Show project details =================== */
    function showProjectDetails(projectId: string) {
        setSelectedProjectId(projectId);
        setProjectDetailsIsOpen(true);
    }

    const selectedProject = selectedProjectId ? projects.find((projet) => projet.id === selectedProjectId) : undefined;

    /* =================== Project table modal =================== */
    function showProjectsTableModal(title: string, filter: (projet: Projet) => boolean) {
        setProjectsTableModalTitle(title);
        const fullFilter = (projet: Projet) => filters.isProjectVisible(projet) && filter(projet);
        setSelectedProjects(projects.filter(fullFilter));
    }

    useEffect(() => {
        let newFilteredProjects = projects.filter((projet) => filters.isProjectVisible(projet));
        setFilteredProjects(newFilteredProjects);
    }, [filters.typeActivite, filters.directeurOuReferentsProjet, filters.etat, filters.politiquesPubliques, projects]);

    const filtersMenu = <FiltersMenu columns={columns} filters={filters} setFilters={setFilters} projects={projects} />;

    /* =================== Render =================== */
    return (
        <div className="App">
            <BrowserRouter>
                {/* === Navbar === */}
                <NavBar />
                {/* === Project Details Modal === */}
                {selectedProject && (
                    <ProjectDetailsModal
                        project={selectedProject}
                        onClose={() => {
                            setSelectedProjectId(null);
                            setProjectDetailsIsOpen(false);
                        }}
                        setAllProjects={setProjects}
                        allProjects={projects}
                    />
                )}
                {/* === Project Table Modal === */}
                {selectedProjects.length > 0 && (
                    <ProjectsTableModal
                        title={ProjectsTableModalTitle}
                        projects={selectedProjects}
                        onClose={() => setSelectedProjects([])}
                        showProjectDetails={showProjectDetails}
                        projectDetailsIsOpen={projectDetailsIsOpen}
                    />
                )}

                {/* === Routes === */}
                <Routes>
                    {/* Route to / */}
                    <Route
                        path="/"
                        element={
                            <PrivateRoute>
                                {filtersMenu}
                                <HomePage
                                    projets={filteredProjects}
                                    setIsLoading={setIsLoading}
                                    showProjectsTableModal={showProjectsTableModal}
                                ></HomePage>
                            </PrivateRoute>
                        }
                    />

                    {/* Route to /table */}
                    <Route
                        path="/table"
                        element={
                            <PrivateRoute>
                                {filtersMenu}
                                <ProjectsTable projets={filteredProjects} onShowDetails={showProjectDetails} />
                            </PrivateRoute>
                        }
                    />

                    {/* Route to /meteo */}
                    <Route
                        path="/weather"
                        element={
                            <PrivateRoute>
                                <WeatherPage
                                    onShowDetails={showProjectDetails}
                                    allProjects={projects}
                                    setAllProjects={setProjects}
                                    refresh={refresh}
                                    filters={filters}
                                    setFilters={setFilters}
                                    columns={columns}
                                />
                            </PrivateRoute>
                        }
                    />

                    {/* Route to /timeline */}
                    <Route
                        path="/circleCharts"
                        element={
                            <PrivateRoute>
                                {filtersMenu}
                                <div className="d-flex justify-content-center m-auto">
                                    <MyResponsiveCirclePacking
                                        projets={filteredProjects}
                                        showProjectsTableModal={showProjectsTableModal}
                                    />
                                </div>
                            </PrivateRoute>
                        }
                    />

                    <Route
                        path="/login"
                        element={
                            <OnlyPublicRoute>
                                <Login setToken={setToken} />
                            </OnlyPublicRoute>
                        }
                    />
                </Routes>
            </BrowserRouter>
        </div>
    );
};

export default memo(App);
