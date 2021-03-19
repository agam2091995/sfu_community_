import './Welcome.css';
import Card from "react-bootstrap/Card";
import {Link} from "react-router-dom";

function Welcome () {
    return (
        <div className='welcome-container'>
            <Card className="card" style={{ width: '35rem' }}>
                <Card.Body>
                    <Card.Title>
                        <h1>Welcome</h1>
                    </Card.Title>
                    <Card.Subtitle className="mb-5 text-muted">
                        Please verify your account by clicking the link in your email to Activate/Confirm your account.
                    </Card.Subtitle>
                    <Card.Text className="mb-2 text-muted">
                        <Link to="/login">
                            Click here to Login.
                        </Link>
                    </Card.Text>
                </Card.Body>
            </Card>
        </div>
    )
}

export default Welcome;