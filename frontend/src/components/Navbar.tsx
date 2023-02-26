import { Form, FormControl, Nav, Navbar, Spinner } from "react-bootstrap";

interface NavBarProps {
    isLoading: boolean;
    nameFilter: string;
    handleNameFilterChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

/*
    This component is used to display the navigation bar.
    It contains links to the home page, the table page, and the weather page.
    It also contains a search bar to filter the table by name.
*/
export default function NavBar({ isLoading, nameFilter, handleNameFilterChange }: NavBarProps) {
    return (
        <Navbar bg="light" expand="lg" className="p-2">
            <Navbar.Brand href="/">GALERIE MONITORING PROJET</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="me-auto">
                    <Nav.Link href="/">Home</Nav.Link>
                    <Nav.Link href="/table">Table</Nav.Link>
                    <Nav.Link href="/weather">Météo</Nav.Link>
                    <Nav.Link href="/circleCharts">Circle Charts</Nav.Link>
                </Nav>
                {isLoading && (
                    <Spinner animation="grow" role="status" size="sm" className="me-2" variant="primary">
                        <span className="visually-hidden">Loading...</span>
                    </Spinner>
                )}
                <Form className="form-inline d-flex">
                    <FormControl
                        className="me-1"
                        type="text"
                        placeholder="Search by name"
                        value={nameFilter}
                        onChange={handleNameFilterChange}
                    />
                </Form>
            </Navbar.Collapse>
        </Navbar>
    );
}
