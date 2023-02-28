import "@fontsource/montserrat";
import { Buffer } from "buffer";
import React, { memo, useEffect, useState } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import NavBar from "./components/Navbar";
import mockProjets from "./mock-data";
import { Projet } from "./models";
import MyResponsiveCirclePacking from "./pages/circlePackingPage/CirclePackingPage";
import { HomePage } from "./pages/homePage/HomePage";
import Login from "./pages/loginPage/LoginPage";
import ProjectDetailsModal from "./pages/projectDetailsModal/ProjectDetailsModal";
import ProjectsTable from "./pages/projectsTablePage/ProjectsTable";
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
    const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
    const [projets, setProjects] = useState<Projet[]>(mockProjets);
    const [nameFilter, setNameFilter] = useState("");
    const [sortColumn, setSortColumn] = useState<keyof Projet>("id");
    const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
    const [isLoading, setIsLoading] = useState(false);
    const [refresh, setRefresh] = useState(0);

    const cachedProjects = () => {
        setIsLoading(true);
        privateQuery("GET", `/cached_projects`, null)
            .then((events: Projet[]) => {
                setProjects(events);
                setRefresh(1);
                //console.log(events)
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

    useEffect(() => {
        cachedProjects();
        updateProjects();
    }, []);

    /* =================== Sort projects =================== */
    const handleSort = (column: keyof Projet) => {
        if (sortColumn === column) {
            setSortDirection(sortDirection === "asc" ? "desc" : "asc");
        } else {
            setSortColumn(column);
            setSortDirection("asc");
        }
    };

    /* =================== Show project details =================== */
    function showProjectDetails(projectId: string) {
        setSelectedProjectId(projectId);
    }

    const selectedProject = selectedProjectId ? projets.find((projet) => projet.id === selectedProjectId) : undefined;

    /* =================== Filter projects =================== */
    const handleNameFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNameFilter(event.target.value);
    };
    const filteredProjects = projets.filter((projet) =>
        projet.projet?.toLowerCase().includes(nameFilter.toLowerCase()),
    );
    const sortedProjects = [...filteredProjects]?.sort((a, b) => {
        if (sortDirection === "asc") {
            return (a[sortColumn] || 0) > (b[sortColumn] || 0) ? 1 : -1;
        } else {
            return (a[sortColumn] || 0) < (b[sortColumn] || 0) ? 1 : -1;
        }
    });

    /* =================== Render =================== */
    return (
        <div className="App">
            <BrowserRouter>
                {/* === Navbar === */}
                <NavBar isLoading={isLoading} nameFilter={nameFilter} handleNameFilterChange={handleNameFilterChange} />

                {/* === Project Details Modal === */}
                {selectedProject && (
                    <ProjectDetailsModal project={selectedProject} onClose={() => setSelectedProjectId(null)} />
                )}

                {/* === Routes === */}
                <Routes>
                    {/* Route to / */}

                    <Route
                        path="/"
                        element={
                            <PrivateRoute>
                                <HomePage projets={sortedProjects} setIsLoading={setIsLoading}></HomePage>
                            </PrivateRoute>
                        }
                    />

                    {/* Route to /table */}
                    <Route
                        path="/table"
                        element={
                            <PrivateRoute>
                                <ProjectsTable
                                    projets={sortedProjects}
                                    onShowDetails={showProjectDetails}
                                    handleSort={handleSort}
                                    sortDirection={sortDirection}
                                    sortColumn={sortColumn}
                                />
                            </PrivateRoute>
                        }
                    />

                    {/* Route to /meteo */}
                    <Route
                        path="/weather"
                        element={
                            <PrivateRoute>
                                <WeatherPage
                                    setIsLoading={setIsLoading}
                                    onShowDetails={showProjectDetails}
                                    allProjects={projets}
                                    setAllProjects={setProjects}
                                    refresh={refresh}
                                />
                            </PrivateRoute>
                        }
                    />

                    {/* Route to /timeline */}
                    <Route
                        path="/circleCharts"
                        element={
                            <PrivateRoute>
                                <div className="d-flex justify-content-center mt-5 m-auto">
                                    <MyResponsiveCirclePacking projets={projets} />
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
