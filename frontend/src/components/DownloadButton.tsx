import { faDownload } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Button, OverlayTrigger, Popover } from "react-bootstrap";
import { exportAsPNG, exportAsSVG } from "../utils/export";

type Props = {
    // les props du composant
    svg: SVGSVGElement;
    fileName: string;
    //Optionnal props
    handleExportWeather?: (type: string) => void;
};

const DownloadButton: React.FC<Props> = ({ svg, fileName, handleExportWeather }) => {
    // une fonction pour rendre le contenu du popover
    const renderPopoverContent = () => {
        return (
            <Popover id="popover-download">
                <Popover.Header>Télécharger</Popover.Header>
                <Popover.Body>
                    <Button variant="outline-primary" onClick={() => exportSvg(svg, fileName, "png")}>
                        .png
                    </Button>{" "}
                    <Button variant="outline-secondary" onClick={() => exportSvg(svg, fileName, "svg")}>
                        .svg
                    </Button>
                </Popover.Body>
            </Popover>
        );
    };

    function exportSvg(svg: SVGSVGElement, fileName: string, type: string) {
        // if prop handleExportWeather is defined, call it
        if (handleExportWeather) {
            handleExportWeather(type);
        }
        // else call default export function
        else if (type === "png") {
            exportAsPNG(svg, fileName);
        } else if (type === "svg") {
            exportAsSVG(svg, fileName);
        }
    }
    return (
        // afficher le bouton avec react-bootstrap
        <OverlayTrigger trigger="click" rootClose placement="bottom" overlay={renderPopoverContent()}>
            <Button variant="outline-secondary">
                <FontAwesomeIcon icon={faDownload} />
            </Button>
        </OverlayTrigger>
    );
};

export default DownloadButton;
