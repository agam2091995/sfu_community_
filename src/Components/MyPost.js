import React, {useEffect, useState} from "react";
import "./MyPost.css"
import axios from "axios";
import config from "../config.json";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Card from "react-bootstrap/Card";

function MyPost(props) {

    const [postsData, setPostsData] = useState([]);
    const [newPostTitle, setNewPostTitle] = useState(null);
    const [newPostBody, setNewPostBody] = useState(null);
    const [updatingPostId, setUpdatingPostId] = useState(null);

    //Modal state
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = (id) => {
        setUpdatingPostId(id);
        setShow(true);
    }

    async function fetchPosts() {
        try {
            const res = await axios.get(`${config.api.invokeURL}/posts`);
            let myPosts = [];
            for (let post of res.data){
                if(post.postCreatorUsername === props.authProps.user.username){
                    myPosts.push(post);
                }
            }
            setPostsData(myPosts);
            console.log(res.data)
        }
        catch (err) {
            console.log("error fetching posts: ", err)
        }
    }

    async function postPosts() {
        try {
            let date = new Date();
            let id = updatingPostId.toString();
            const res = await axios.patch(`${config.api.invokeURL}/posts/${id}`, {
                "id": id,
                "postCreatorUsername": props.authProps.user.username,
                "postTitle": newPostTitle,
                "postBody": newPostBody,
                "postDateAndTimeCreated": `${date.getFullYear()}-${date.getMonth()}-${date.getDate()} @ ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
            });
            console.log(res)
        }
        catch (err) {
            console.log("error posting posts: ", err)
        }
    }

    async function deletePosts(id) {
        try {
            const res = await axios.delete(`${config.api.invokeURL}/posts/${id}`);
            console.log(res)
        }
        catch (err) {
            console.log("error deleting posts: ", err)
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

    function handleDelete(id) {
        deletePosts(id).then(r => fetchPosts());
        handleClose();
    }

    return (
        <div className='post-container'>
            <Button variant="primary" className="add-new-post-btn" onClick={handleShow}>
                Add new Post
            </Button>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Post</Modal.Title>
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
                        Edit
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
                                <Button variant="primary" className="edit-post" onClick={() => handleShow(post.id)}>
                                    Edit
                                </Button>
                                <Button variant="primary" className="delete-post" onClick={() => handleDelete(post.id)}>
                                    Delete
                                </Button>
                            </Card.Body>
                        </Card>
                    </div>
                )
            })}
        </div>
    )
}

export default MyPost;