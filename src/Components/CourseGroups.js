import React, {useState, useEffect} from "react";
import "./CourseGroups.css";
import axios from "axios";
import config from "../config.json";
import Card from "react-bootstrap/Card";

function CourseGroups(props) {

    const [courseData, setCourseData] = useState([]);

    useEffect(() => {
        fetchCourseGroups().then(r => console.log("fetched"));
    }, []);

    let fetchCourseGroups = async () => {
        try {
            let id = props.authProps.user.username.toString().toLowerCase();
            const res = await axios.get(`${config.api.invokeURL}/users/${id}`);
            console.log(res.data.courses)

            let courses = res.data.courses.toString();
            const course_res = await axios.get(`${config.api.invokeURL}/course-groups`, { params: { courses: courses } });
            console.log(course_res.data);

            setCourseData(course_res.data);
        }
        catch (err) {
            console.log("error fetching course groups: ", err)
        }
    }

    return (
        <div className="course-groups-container">
            <h3> My Course Groups</h3>

            {courseData.map((course, index) => {
                return (
                    <div key={index} className="course-container">
                        <Card style={{ width: '40rem', height: '15rem' }}>
                            <Card.Body>
                                <Card.Title>{course.id}</Card.Title>
                                <Card.Subtitle>Group Members: </Card.Subtitle>
                                {course.members.map((member, key) => {
                                    return (
                                        <div key={key} className="member">
                                            {member}
                                        </div>
                                    )
                                })}
                            </Card.Body>
                        </Card>
                    </div>
                )
            })}
        </div>
    )
}

export default CourseGroups;