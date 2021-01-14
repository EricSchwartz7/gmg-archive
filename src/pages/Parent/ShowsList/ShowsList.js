import React, { Component } from 'react';
import axios from '../../../axios';
import { Link } from 'react-router-dom';
import { Card, Dropdown, Form, Message, Loader, Dimmer, Checkbox } from 'semantic-ui-react';
import _ from 'lodash';

import './ShowsList.scss';
import ShowCard from '../../../components/ShowCard/ShowCard';
import FilterDropdown from '../../../components/FilterDropdown/FilterDropdown';
import { CSSTransitionGroup } from 'react-transition-group';

class ShowsList extends Component {
    state = {
        shows: [],
        venuesList: [],
        yearsList: [],
        filterAndSort: {
            year_filter: "",
            venue_filter: "",
            sort_order: "most_recent",
            include_all: true
        },
        loading: false
    }

    componentDidMount() {
        this.getShows(this.state.filterAndSort);
    }

    getYears() {
        axios.get("years")
            .then(response => {
                const yearsList = response.data.map((year, i) => ({
                    key: i,
                    text: year.toString(),
                    value: year.toString()
                }));
                this.setState({
                    yearsList
                })
            });
    }

    getVenues() {
        axios.get("venues")
            .then(response => {
                const venuesList = response.data.map((venue, i) => ({
                    key: i,
                    text: venue,
                    value: venue
                }));
                this.setState({
                    venuesList: _.uniqBy(venuesList, "value")
                });
            });
    }

    filterYear(e, data) {
        this.getShows({...this.state.filterAndSort, year_filter: data.value});
    }

    filterVenue(e, data) {
        this.getShows({...this.state.filterAndSort, venue_filter: data.value});
    }
    
    sort(e, data) {
        this.getShows({...this.state.filterAndSort, sort_order: data.value});
    }

    includeAll(e, data) {
        this.getShows({...this.state.filterAndSort, include_all: !data.checked});
    }

    getShows(params) {
        this.setState({
            loading: true
        });
        axios.get("shows", {params})
            .then( response => {
                this.setState({ 
                    shows: response.data,
                    filterAndSort: {...params},
                    loading: false
                });
            })
            .catch(error => {
                this.setState({
                    loading: false
                });
            })
    }

    render() {
        let showCards = <p style={{ textAlign: 'center' }}>Something went wrong!</p>;
        if ( !this.state.error ) {
            showCards = this.state.shows.map( (show, i) => {
                let date = show.date? new Date(show.date.replace(/-/g, "/") + " EST").toLocaleDateString() : "";
                return (
                    <Link className="ui card fluid" to={'/show/' + show.id} key={i}>
                        <ShowCard
                            key={i}
                            id={show.id}
                            show={show}
                            date={date}
                        />
                    </Link>
                )
            });
        }

        const sortOptions = [
            {
                key: "most_recent",
                text: "Most Recent",
                value: "most_recent"
            },
            {
                key: "oldest",
                text: "Oldest",
                value: "oldest"
            }
        ];

        return (
                <div>
                    {this.props.loggingOut ? 
                        <Message
                            success
                            header="Wepa!"
                            content="You have successfully logged out."
                        /> : ""}
                    {this.props.location.loggingIn ? 
                        <Message
                            success
                            header="Wepa!"
                            content="You have successfully logged in."
                        /> : ""}
                    <section className="ShowsList">
                        <div className="filters">
                            <Form>
                                <Form.Group widths="equal">
                                    <FilterDropdown
                                        placeholder="Year"
                                        onClick={this.getYears.bind(this)}
                                        options={this.state.yearsList}
                                        onChange={this.filterYear.bind(this)}/>
                                    <FilterDropdown
                                        placeholder="Venue"
                                        onClick={this.getVenues.bind(this)}
                                        options={this.state.venuesList}
                                        onChange={this.filterVenue.bind(this)}/>
                                    <Form.Select
                                        placeholder="Sort"
                                        selection
                                        options={sortOptions}
                                        onChange={this.sort.bind(this)}/>
                                </Form.Group>
                                <Form.Checkbox
                                        toggle
                                        label="Hide shows with no media"
                                        onChange={this.includeAll.bind(this)} />
                            </Form>
                        </div>
                        {this.state.loading ? 
                            <Loader active /> :
                            <CSSTransitionGroup
                                transitionName="fade"
                                transitionAppear={true}
                                transitionAppearTimeout={500}
                                transitionEnter={false}
                                transitionLeave={false}>
                                <div className="cards">
                                    <Card.Group>{showCards}</Card.Group>
                                </div>
                            </CSSTransitionGroup>
                        }
                    </section>
                </div>
        );
    }
}

export default ShowsList;