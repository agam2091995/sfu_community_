import React, {useState, useEffect } from "react";
import "./Account.css";

import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import axios from "axios";
import config from "../config.json";

function Account(props) {

    const [fName, setFName] = useState('');
    const [lName, setLName] = useState('');
    const [courses, setCourses] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchInfo().then(r => console.log("fetched"));
    }, [])

    let fetchInfo = async () => {
        try {
            let id = props.authProps.user.username.toString().toLowerCase();
            console.log(id)
            const res = await axios.get(`${config.api.invokeURL}/users/${id}`);
            console.log(res.data)

            setFName(res.data.fname);
            setLName(res.data.lname);
            setCourses(res.data.courses.toString());
        }
        catch (err) {
            console.log("error fetching posts: ", err)
        }
    }

    let inputChangeHandler = (event) => {
        setMessage('');
        switch (event.target.name){
            case "fName":
                setFName(event.target.value)
                break;
            case "lName":
                setLName(event.target.value)
                break;
            case "courses":
                setCourses(event.target.value.split(','))
                break;
            default:
                console.log('input handler: nothing changed')
        }
    }


    let handleSubmit = async (event) => {
        event.preventDefault();
        try {
            let id = props.authProps.user.username.toString().toLocaleLowerCase();
            const res = await axios.post(`${config.api.invokeURL}/users/${id}`, {
                "id": id,
                "fname": fName,
                "lname": lName,
                "courses": courses
            });
            console.log(res);
            setMessage('Information updated successfully');
        }
        catch (err) {
            console.log("error fetching posts: ", err);
            setMessage(`Error while updating info: ${err}`);
        }
    }

    return (
        <div className="account-container">
            <Form onSubmit={handleSubmit}>
                <div><h3>User Account Info</h3></div>
                <Form.Group controlId="formBasicFname">
                    <Form.Label>First Name</Form.Label>
                    <Form.Control type="text" placeholder="Enter First Name" required name="fName" value={fName} onChange={inputChangeHandler}/>
                </Form.Group>

                <Form.Group controlId="formBasicLname">
                    <Form.Label>Last Name</Form.Label>
                    <Form.Control type="text" placeholder="Enter Last Name" required name="lName" value={lName} onChange={inputChangeHandler}/>
                </Form.Group>

                <Form.Group controlId="formBasicCourses">
                    <Form.Label>Courses</Form.Label>
                    <Form.Control type="text" placeholder="Enter list of courses" required name="courses" value={courses} onChange={inputChangeHandler}/>
                    <Form.Text className="text-muted">
                        Use format: courseA, courseB, courseC...
                    </Form.Text>
                </Form.Group>
                <div>{message}</div>
                <Button variant="primary" type="submit">
                    Edit Info
                </Button>
            </Form>
        </div>
    )
}

export default Account;