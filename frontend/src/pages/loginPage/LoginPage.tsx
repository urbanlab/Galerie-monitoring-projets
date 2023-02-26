import { useState } from "react";
import { Button, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../services";

interface LoginResponseModel {
    access_token: string;
}

/*
    This component is the login page.
    It contains a form with a password input and a submit button.
    When the user clicks on the submit button, the password is sent to the backend.
    If the password is correct, the backend returns a token.
    The token is stored in the local storage and the page is reloaded.
*/
export default function Login(props: { setToken: (userToken: string) => void }) {
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        // We send the password to the backend.
        const loginResponse: LoginResponseModel = await loginUser({
            password,
        });
        // If the login is successful, we store the token in the local storage and reload the page.
        if (loginResponse.access_token) {
            props.setToken(loginResponse.access_token);
            window.location.reload();
            navigate("/");
        }
    };

    return (
        // We use the bootstrap grid system to center the form.
        <div id="login-wrapper" className="d-flex justify-content-center">
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="formBasicPassword">
                    <Form.Control
                        className="mt-5 mb-2"
                        type="password"
                        placeholder="Mot de passe"
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </Form.Group>
                <Button variant="outline-success" type="submit">
                    Se connecter
                </Button>
            </Form>
        </div>
    );
}
