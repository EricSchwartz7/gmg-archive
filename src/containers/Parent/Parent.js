import React, { Component } from 'react';
// import axios from 'axios';
import { Route, NavLink, Switch } from 'react-router-dom';

import './Parent.css';
import ShowsList from './ShowsList/ShowsList';
import NewShow from './NewShow/NewShow';
import About from './About/About';
import Show from './Show/Show';

class Parent extends Component {
    render () {
        return (
            <div className="Parent">
                <header>
                    <nav>
                        <ul>
                            <li><NavLink
                                to="/about/"
                                >About</NavLink></li>
                            <li><NavLink
                                to="/shows/"
                                >Shows</NavLink></li>
                            <li><NavLink
                                to="/bps/"
                                >Band Practices</NavLink></li>
                            <li><NavLink
                                to="/studio/"
                                >Studio Recordings</NavLink></li>
                            <li><NavLink
                                to="/stats/"
                                >Stats</NavLink></li>
                            <li><NavLink to={{
                                pathname: '/upload',
                                hash: '#submit',
                                search: '?quick-submit=true'
                            }}>Add a Show</NavLink></li>
                        </ul>
                    </nav>
                </header>
                <Switch>
                    <Route path="/about" component={About} />
                    <Route path="/shows" component={ShowsList} />
                    <Route path="/upload/:id" component={NewShow} />
                    <Route path="/upload" component={NewShow} />
                    <Route path="/show/:id" component={Show} />
                </Switch>
            </div>
        );
    }
}

export default Parent;