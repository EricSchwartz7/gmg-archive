import React, { Component } from 'react';
import { Route, NavLink, Switch, FadeIn } from 'react-router-dom';

import './Parent.css';
import ShowsList from './ShowsList/ShowsList';
import NewShow from './NewShow/NewShow';
import About from './About/About';
import Show from './Show/Show';
import SongsList from './SongsList/SongsList';
import Song from './Song/Song';
import Stats from './Stats/Stats';
import LogIn from './LogIn/LogIn';
import SignUp from './SignUp/SignUp';
import axios from 'axios';

class Parent extends Component {
    state = {
        loggedIn: false
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
                <header>
                    <nav>
                        <ul>
                            <li><NavLink
                                to="/about"
                                >About</NavLink></li>
                            <li><NavLink
                                to="/shows"
                                >Shows</NavLink></li>
                            {/* <li><NavLink
                                to="/bps/"
                                >Band Practices</NavLink></li>
                            <li><NavLink
                                to="/studio/"
                                >Studio Recordings</NavLink></li> */}
                            <li><NavLink
                                to="/stats"
                                >Stats</NavLink></li>
                            {this.state.loggedIn ?
                                <li><NavLink to={{
                                    pathname: '/upload',
                                    hash: '#submit'
                                }}>Add a Show</NavLink></li> : ""}
                            <li><NavLink
                                to="/songs"
                                >Songs</NavLink></li>
                            {this.state.loggedIn ?
                                <li><NavLink
                                    to="/logout"
                                    onClick={this.logOut.bind(this)}
                                    >Log Out</NavLink></li> :
                                <li><NavLink
                                    to="/login"
                                    >Log In</NavLink></li>}
                        </ul>
                    </nav>
                </header>
                <Switch>
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