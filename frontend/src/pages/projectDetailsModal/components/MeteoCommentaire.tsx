import React, { useState } from "react";
import { Button, Form } from "react-bootstrap";
import { privateQuery } from "../../../services";

interface MeteoCommentaireProps {
    project_id: string;
    commentaire: string;
    updateProjects: (project_id: string) => void;
}

/*
    This component the meteo comment of a project
    The comment is editable
*/
const MeteoCommentaire: React.FC<MeteoCommentaireProps> = ({ project_id, commentaire, updateProjects }) => {
    const [commentaireMeteo, setCommentaireMeteo] = useState(commentaire);
    return (
        <div className="d-flex mb-3">
            <Form.Control
                as="textarea"
                rows={3}
                value={commentaireMeteo}
                onChange={(e) => setCommentaireMeteo(e.target.value)}
                spellCheck={false}
            />
            <Button
                className="ms-1 my-auto"
                variant="outline-success"
                size="sm"
                onClick={() =>
                    privateQuery("POST", `/update_meteo_comment/${project_id}`, { comment: commentaireMeteo }).then(
                        (res) => {
                            updateProjects(project_id);
                        },
                    )
                }
            >
                Modifier
            </Button>
        </div>
    );
};

export default MeteoCommentaire;
