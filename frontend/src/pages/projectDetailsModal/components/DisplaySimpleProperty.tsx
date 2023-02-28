import { Col, Container, Row } from "react-bootstrap";

interface Props {
    property_name: string;
    property_value: any;
}

/*
    This component is used to display properties in a nice way
*/
const DisplaySimpleProperty: React.FC<Props> = ({ property_name, property_value }) => {
    return (
        <div className="mb-3">
            <Container>
                <Row>
                    <Col md="auto" className="px-0">
                        <strong>
                            <p className="mb-1">{property_name} :</p>
                        </strong>
                        <hr className="my-0" />
                    </Col>
                    <Col>{property_value}</Col>
                </Row>
            </Container>
        </div>
    );
};

export default DisplaySimpleProperty;
