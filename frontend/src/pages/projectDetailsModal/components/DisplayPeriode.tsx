import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Periode } from "../../../models";

interface Props {
    periode_name: string;
    periode: Periode;
}

/*
    This component is used to display a periode in a nice way
*/
const DisplayPeriode: React.FC<Props> = ({ periode_name, periode }) => {
    return (
        <div key={periode_name}>
            {periode?.start &&
                new Date(periode?.start).toLocaleDateString("fr", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                })}{" "}
            {periode?.end && <FontAwesomeIcon icon={faArrowRight} />}{" "}
            {periode?.end &&
                new Date(periode?.end).toLocaleDateString("fr", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                })}
        </div>
    );
};

export default DisplayPeriode;
