import React, { useState, useEffect } from "react";
import './App.css';
import { Auth } from 'aws-amplify';

import {BrowserRouter as Router } from "react-router-dom";
import { Route, Switch} from 'react-router-dom';

import Home from "./Components/Home";
import Navigation from "./Components/Navigation";
import Register from "./Components/Register";
import Login from "./Components/Login";
import Welcome from "./Components/Welcome";
import Post from "./Components/Post";
import MyPost from "./Components/MyPost";
import Account from "./Components/Account";
import CourseGroups from "./Components/CourseGroups";

function App() {

    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);

    const authProps = {
        isAuthenticated: isAuthenticated,
        user: user,
        setIsAuthenticated: setIsAuthenticated,
        setUser: setUser
    }

    useEffect(  () => {
        async function fetchLocalStorageData() {
            try {
                const session = await Auth.currentSession();
                setIsAuthenticated(true);
                const user = await Auth.currentAuthenticatedUser();
                setUser(user);
                console.log(session, user);
            }
            catch (err){
                console.log('Error fetching data from local storage', err);
            }
        }
        fetchLocalStorageData();
    }, [])


    return (
        <Router>
            <Navigation />

            <Switch>
                <Route path="/home">
                    <Home authProps={authProps}/>
                </Route>
                <Route path="/register">
                    <Register authProps={authProps}/>
                </Route>
                <Route path="/login">
                    <Login authProps={authProps}/>
                </Route>
                <Route path="/welcome">
                    <Welcome authProps={authProps}/>
                </Route>
                <Route path="/post">
                    <Post authProps={authProps}/>
                </Route>
                <Route path="/mypost">
                    <MyPost authProps={authProps}/>
                </Route>
                <Route path="/account">
                    <Account authProps={authProps}/>
                </Route>
                <Route path="/course-groups">
                    <CourseGroups authProps={authProps}/>
                </Route>
                <Route path="/">
                    <Home authProps={authProps}/>
                </Route>
            </Switch>
        </Router>
  );
}

export default App;
