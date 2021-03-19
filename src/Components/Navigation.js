import './Navigation.css';
import { Navbar } from 'react-bootstrap';
import { Link } from "react-router-dom";

function Navigation(props) {

    return (
        <Navbar className="navigation" bg="light" expand="lg">
            <Navbar.Brand className="navigation-brand">
                <Link to="/home">
                    <div>SFU Community</div>
                </Link>
            </Navbar.Brand>
            <Link to="/home">
                <div>Home</div>
            </Link>
            <Link to="/post">
                <div>All Posts</div>
            </Link>
            <Link to="/mypost">
                <div>My Posts</div>
            </Link>
            <Link to="/course-groups">
                <div>Groups</div>
            </Link>
            <Link to="/account">
                <div>Account</div>
            </Link>
        </Navbar>
    );
}

export default Navigation;