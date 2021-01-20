import React, { Component } from 'react';
import { Route, NavLink, Link, Switch, Redirect } from 'react-router-dom';
import {Nav,  Navbar, NavDropdown } from 'react-bootstrap';
import axios from 'axios';

import './Parent.scss';
import ShowsList from './ShowsList/ShowsList';
import NewShow from './NewShow/NewShow';
import About from './About/About';
import Show from './Show/Show';
import SongsList from './SongsList/SongsList';
import Song from './Song/Song';
import Stats from './Stats/Stats';
import LogIn from './LogIn/LogIn';
import SignUp from './SignUp/SignUp';
import logoLarge from './gmgtransparentlarge.png';


class Parent extends Component {
    state = {
        loggedIn: false
    }

    componentDidMount () {
        if (localStorage.getItem('auth_token') && !this.state.loggedIn) {
            axios.get("check_token_expired").then(response => {
                this.setState({
                    loggedIn: true
                });
            }).catch(response => {
                if (response.request.status === 401) {
                    this.logOut();
                }
            });
        }
    }

    handleLogIn = (credentials) => {
        return axios.post("authenticate", credentials).then(response => {
            if (response.data.auth_token) {
                localStorage.setItem("auth_token", response.data.auth_token);
                this.setState({
                    loggedIn: true
                });
            }
        });
    }

    logOut = () => {
        localStorage.removeItem("auth_token");
        this.setState({
            loggedIn: false
        });
    }

    render () {
        return (
            <div className="Parent">
                <header className="bootstrap-scope">
                    <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
                        <Navbar.Brand>
                            <NavLink to="/shows">
                                <img src={logoLarge} width="30" height="30" alt="" />
                            </NavLink>
                        </Navbar.Brand>
                        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                        <Navbar.Collapse id="responsive-navbar-nav">
                            <Nav className="ml-auto">
                                <NavLink to="/about" className="nav-link">About</NavLink>
                                <NavLink to="/shows" className="nav-link">Shows</NavLink>
                                <NavLink to="/stats" className="nav-link">Stats</NavLink>
                                {this.state.loggedIn ?
                                    <NavLink to={{
                                        pathname: '/upload',
                                        hash: '#submit'
                                    }} className="nav-link">Add a Show</NavLink> : ""}
                                <NavLink to="/songs" className="nav-link">Songs</NavLink>
                                {this.state.loggedIn ?
                                    <NavLink to="/logout" onClick={this.logOut.bind(this)} className="nav-link">Log Out</NavLink> :
                                    <NavLink to="/login" className="nav-link">Log In</NavLink>}
                            </Nav>
                        </Navbar.Collapse>
                    </Navbar>
                </header>
                <Switch>
                    <Route exact path="/">
                        <Redirect to="/shows" />
                    </Route>
                    <Route path="/about" component={About} />
                    <Route path="/shows" component={ShowsList} />
                    <Route path="/upload/:id" component={NewShow} />
                    <Route path="/upload" component={NewShow} />
                    <Route path="/show/:id" component={Show} />
                    <Route path="/songs" component={SongsList} />
                    <Route path="/song/:id" component={Song} />
                    <Route path="/stats" component={Stats} />
                    <Route 
                        path="/logout"
                        render={routeProps => (
                            <ShowsList {...routeProps} loggingOut />
                        )}>
                    </Route>
                    <Route 
                        path="/login"
                        render={routeProps => (
                            <LogIn 
                                {...routeProps} 
                                handleLogIn={this.handleLogIn.bind(this)}
                            />)}>
                    </Route>
                    <Route path="/signup" component={SignUp} />
                </Switch>
            </div>
        );
    }
}

export default Parent;