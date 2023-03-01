import { Modal } from "react-bootstrap";
import { Projet } from "../models";
import ProjectsTable from "../pages/projectsTablePage/ProjectsTable";

interface Props {
    title: string;
    projects: Projet[];
    onClose: () => void;
    showProjectDetails: (projectId: string) => void;
    projectDetailsIsOpen: boolean;
}
/*

*/
const ProjectsTableModal: React.FC<Props> = ({
    title,
    projects,
    onClose,
    showProjectDetails,
    projectDetailsIsOpen,
}) => {
    return (
        <Modal
            show={projects.length > 0 && !projectDetailsIsOpen}
            onHide={onClose}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">{title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <ProjectsTable projets={projects} onShowDetails={showProjectDetails} />
            </Modal.Body>
        </Modal>
    );
};

export default ProjectsTableModal;
