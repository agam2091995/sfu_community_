import './Home.css';
import Card from "react-bootstrap/Card";
import {Link} from "react-router-dom";
import React from "react";

function Home(props) {
    return (
        <div className="app-container">
            <Card className="card" style={{ width: '30rem' }}>
                <Card.Body>
                    <Card.Title>
                        <Link to="/register">
                            <h1>Register Account</h1>
                        </Link>
                    </Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">Create a new Account</Card.Subtitle>
                </Card.Body>
            </Card>


            <Card className="card" style={{ width: '30rem' }}>
                <Card.Body>
                    <Card.Title>
                        <Link to="/login">
                            <h1>Login Account</h1>
                        </Link>
                    </Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">Sign into an existing account</Card.Subtitle>
                </Card.Body>
            </Card>
        </div>
    )
}

export default Home;