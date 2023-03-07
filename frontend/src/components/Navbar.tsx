import { useEffect, useState } from "react";
import { Container, Nav, Navbar } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";

interface NavBarProps { }

/*
    This component is used to display the navigation bar.
    It contains links to the home page, the table page, and the weather page.
*/
const NavBar: React.FC<NavBarProps> = () => {
    const location = useLocation();
    const [activePath, setActivePath] = useState(location.pathname);
    const imagePath = require(`../assets/logo_erasme.png`);

    const navItems = [
        { path: "/", label: "Accueil" },
        { path: "/table", label: "Projets" },
        { path: "/weather", label: "Météo" },
        { path: "/circleCharts", label: "Bulles" },
    ];

    useEffect(() => {
        setActivePath(location.pathname);
    }, [location]);

    return (
        <Navbar variant="dark" expand="lg" style={{ backgroundColor: "#4d4c4c" }} className="shadow">
            <Container fluid>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav" className="ms-4">
                    <Nav className="me-auto">
                        {navItems.map((item) => (
                            <Nav.Link key={item.path} as={Link} to={item.path} active={activePath === item.path}>
                                {item.label}
                            </Nav.Link>
                        ))}
                    </Nav>
                </Navbar.Collapse>
                <Navbar.Brand
                    className="pe-4 py-0 my-auto d-none d-md-flex" // Hide text on small screens
                    style={{ borderRight: "1px solid", borderColor: "#cdcdcd", height: "1.5em" }}
                >
                    <p className="my-auto mx-0">GALERIE MONITORING PROJET</p>
                </Navbar.Brand>
                <Navbar.Brand>
                    <img src={imagePath} alt="logo" style={{ height: "1.5em" }} />
                </Navbar.Brand>
            </Container>
        </Navbar>
    );
};

export default NavBar;
