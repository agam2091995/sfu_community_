import './Login.css';
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import React, { useState } from "react";
import { Auth } from "aws-amplify";
import {Redirect} from "react-router-dom";

function Login(props) {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [redirectLink, setRedirectLink] = useState(null);

    let inputChangeHandler = (event) => {
        switch (event.target.name){
            case "username":
                setUsername(event.target.value)
                break;
            case "password":
                setPassword(event.target.value)
                break;
            default:
                console.log('input handler: nothing changed')
        }
    }

    let handleSubmit = async (event) => {
        event.preventDefault();

        // AWS Cognito Work
        try {
            const user = await Auth.signIn(username, password)
            console.log(user)

            props.authProps.setIsAuthenticated(true);
            props.authProps.setUser(user);
            setRedirectLink(
                <Redirect to={'/post'}/>
            )
        }
        catch (err) {
            setError(err);
        }
    }

    return (
        <div className="login-container">
            {redirectLink}
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="formBasicUserName">
                    <Form.Label>Username</Form.Label>
                    <Form.Control type="text" placeholder="Enter a username" required name="username" onChange={inputChangeHandler}/>
                </Form.Group>

                <Form.Group controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" placeholder="Password" required name="password" onChange={inputChangeHandler}/>
                </Form.Group>
                <div><h3 style={{color: 'red'}}>{error.message}</h3></div>
                <Button variant="primary" type="submit">
                    Login
                </Button>
            </Form>
        </div>
    )
}

export default Login;