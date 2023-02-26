import { faCircleUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { People } from "../models";

interface Props {
    person: People;
}

/*
    This component is used to display a person's name and avatar.
    If the person does not have an avatar, it will display a circle with the first letter of their name.
    If the person does not have a name, it will display a circle with a question mark.
*/
const PeopleDisplay: React.FC<Props> = ({ person }) => {
    return (
        <span className="d-inline-block my-1 mx-2">
            <span className="d-flex align-items-center w-auto">
                {/* {person.avatar_url === '' && <span className='me-1 my-auto' style={{ backgroundColor: '#37352F', padding: '0.05em 0.5em', borderRadius: '0.25em', color: '#37352F', whiteSpace: 'nowrap' }}></span>
                } */}
                {person.avatar_url && (
                    <img
                        src={person.avatar_url}
                        alt={person.name}
                        referrerPolicy="no-referrer"
                        style={{
                            borderRadius: "50%",
                            height: "1em",
                            width: "1em",
                            objectFit: "cover",
                        }}
                    />
                )}
                {!person.avatar_url && <FontAwesomeIcon icon={faCircleUser} />}
                <p className="ms-1 my-auto">{person.name}</p>
            </span>
        </span>
    );
};

export default PeopleDisplay;
