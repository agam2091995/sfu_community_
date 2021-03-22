import React,  { useState, useEffect } from "react";
import './Post.css';
import axios from "axios";
import config from "../config.json";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";

function Post(props) {

    const [postsData, setPostsData] = useState([]);
    const [newPostTitle, setNewPostTitle] = useState(null);
    const [newPostBody, setNewPostBody] = useState(null);

    //Modal state
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    async function fetchPosts() {
        try {
            const res = await axios.get(`${config.api.invokeURL}/posts`);
            
            setPostsData(JSON.parse(res.data.body));
            console.log(JSON.parse(res.data.body))
        }
        catch (err) {
            console.log("error fetching posts: ", err)
        }
    }

    async function postPosts() {
        try {
            let date = new Date();
            let id = date.valueOf().toString();
            const res = await axios.post(`${config.api.invokeURL}/posts/${id}`, {
                "id": id,
                "postCreatorUsername": props.authProps.user.username,
                "postTitle": newPostTitle,
                "postBody": newPostBody,
                "postDateAndTimeCreated": `${date.getFullYear()}-${date.getMonth()}-${date.getDate()} @ ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
            });
            console.log(res)
        }
        catch (err) {
            console.log("error fetching posts: ", err)
        }
    }

    useEffect(() => {
        fetchPosts().then(r => console.log("fetched"));
    }, [])

    function inputChangeHandler(event) {
        switch (event.target.name) {
            case "title":
                setNewPostTitle(event.target.value);
                break;
            case "body":
                setNewPostBody(event.target.value);
                break;
            default:
                console.log("input handler waiting for input")
        }
    }

    function handleSubmit() {
        postPosts().then(r => fetchPosts());
        handleClose();
    }

    return (
        <div className='post-container'>
            <Button variant="primary" className="add-new-post-btn" onClick={handleShow}>
                Add new Post
            </Button>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Add new Post</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="postTitle">
                            <Form.Label>Title</Form.Label>
                            <Form.Control type="text" placeholder="Enter Title" name="title" onChange={inputChangeHandler}/>
                        </Form.Group>

                        <Form.Group controlId="postBody">
                            <Form.Label>Body</Form.Label>
                            <Form.Control type="text" placeholder="Description" name="body" onChange={inputChangeHandler}/>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleSubmit}>
                        Add
                    </Button>
                </Modal.Footer>
            </Modal>



            {postsData.map((post, index) => {
                return (
                    <div key={index} className="post-container">
                        <Card style={{ width: '40rem', height: '15rem' }}>
                            <Card.Body>
                                <Card.Title>{post.postTitle}</Card.Title>
                                <Card.Subtitle className="mb-2 text-muted">by {post.postCreatorUsername}</Card.Subtitle>
                                <Card.Text>
                                    {post.postBody}
                                </Card.Text>
                                <div className="date-created">
                                    {post.postDateAndTimeCreated}
                                </div>
                            </Card.Body>
                        </Card>
                    </div>
                )
            })}
        </div>
    )
}

export default Post;