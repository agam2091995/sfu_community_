import React, { useState } from 'react';
import './Register.css';
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { Redirect } from 'react-router-dom';

import { Auth } from "aws-amplify";
import axios from "axios";
import config from "../config.json";

function Register(props) {

    const [fName, setFName] = useState('');
    const [lName, setLName] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [redirectLink, setRedirectLink] = useState(null);

    let inputChangeHandler = (event) => {
        switch (event.target.name){
            case "fName":
                setFName(event.target.value)
                break;
            case "lName":
                setLName(event.target.value)
                break;
            case "email":
                setEmail(event.target.value)
                break;
            case "password":
                setPassword(event.target.value)
                break;
            case "username":
                setUsername(event.target.value.toString().toLowerCase())
                break;
            default:
                console.log('input handler: nothing changed')
        }
    }

    let handleSubmit = async (event) => {
        event.preventDefault();

        // AWS Cognito Work
        try {
            const signUpResponse = await Auth.signUp({
                username,
                password,
                attributes: {
                    email: email,
                    given_name: fName,
                    family_name: lName
                }
            });
            console.log(signUpResponse);

            props.authProps.setIsAuthenticated(true);
            props.authProps.setUser(signUpResponse.user);

            const res = await axios.post(`${config.api.invokeURL}/users/${username}`, {
                    "id": username,
                    "fname": fName,
                    "lname": lName,
                    "courses": []
            });
            console.log(res);

            setRedirectLink(
                <Redirect to={'/login'}/>
            )
        }
        catch (err) {
            setError(err);
            setRedirectLink(
                <Redirect to={'/login'}/>
            )
        }
    }


    return (
        <div className="register-container">
            {redirectLink}
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="formBasicFname">
                    <Form.Label>First Name</Form.Label>
                    <Form.Control type="text" placeholder="Enter First Name" required name="fName" onChange={inputChangeHandler}/>
                </Form.Group>

                <Form.Group controlId="formBasicLname">
                    <Form.Label>Last Name</Form.Label>
                    <Form.Control type="text" placeholder="Enter Last Name" required name="lName" onChange={inputChangeHandler}/>
                </Form.Group>

                <Form.Group controlId="formBasicUserName">
                    <Form.Label>Username</Form.Label>
                    <Form.Control type="text" placeholder="Enter a username" required name="username" value={username} onChange={inputChangeHandler}/>
                    <Form.Text className="text-muted">
                        Note: must be lowercase
                    </Form.Text>
                </Form.Group>

                <Form.Group controlId="formBasicEmail">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control type="email" placeholder="Enter email" required name="email" onChange={inputChangeHandler}/>
                    <Form.Text className="text-muted">
                        We'll never share your email with anyone else.
                    </Form.Text>
                </Form.Group>

                <Form.Group controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" placeholder="Password" required name="password" onChange={inputChangeHandler}/>
                    <span>Minimum length 7</span>
                </Form.Group>
                <Form.Group controlId="formBasicCheckbox">
                    <Form.Check type="checkbox" label="I agree to all terms and conditions" required />
                </Form.Group>
                 <div><h3 style={{color: 'red'}}></h3></div>
                <Button variant="primary" type="submit">
                    Register
                </Button>
            </Form>
        </div>
    )
}

export default Register;