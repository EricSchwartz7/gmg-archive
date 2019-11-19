import React, { Component } from 'react';
import axios from 'axios';
import { Redirect } from 'react-router-dom';
import { Button, Form, Input, TextArea, Accordion } from 'semantic-ui-react'

import './NewShow.scss';
import 'react-semantic-ui-datepickers/dist/react-semantic-ui-datepickers.css';

class NewShow extends Component {
    state = {
        showData: {
            date: '',
            venue: '',
            first_set: '',
            second_set: '',
            encore: '',
        },
        routeToShow: false,
        showID: 0,
        loading: true
    }

    componentDidMount () {
        this.loadData();
    }

    loadData () {
        if ( this.props.match.params.id ) {
            axios.get( '/shows/' + this.props.match.params.id )
                .then( response => {
                    console.log(response);
                    this.setState({
                        showData: response.data
                    });
                })
                .finally( () => {
                    this.setState( { 
                        loading: false
                    });
                });
        }
    }


    postDataHandler = () => {
        axios.post('/shows', this.state.showData)
            .then(response => {
                this.setState({
                    routeToShow: true,
                    showID: response.data.id
                })
            });
    }

    updateHandler = () => {
        axios.put('/shows/' + this.props.match.params.id, {
            show: this.state.showData
        }).then(response => {
            this.setState({
                routeToShow: true,
                showID: response.data.id
            })
        })
    }

    handleSelectDate = date => {
        this.setState({
            date: date
        });
    };

    handleChange (field, value) {
        let showData = this.state.showData;
        showData[field] = value;
        this.setState({
            showData: showData
        });
    }

    render () {
        if (this.state.routeToShow === true) {
            return <Redirect to={'/show/' +  this.state.showID}/>
        }

        const panels = [
            {
                key: "secondSet",
                title: "Second Set",
                content: {
                    as: Form.TextArea,
                    value: this.state.showData.second_set,
                    onChange: (event) => this.handleChange("second_set", event.target.value)
                }
            },
            {
                key: "encore",
                title: "Encore",
                content: {
                    as: Form.TextArea,
                    rows: 1,
                    value: this.state.showData.encore,
                    onChange: (event) => this.handleChange("encore", event.target.value)
                }
            }
        ]

        return (
            <div className="NewShow">
                <Form>
                    {this.props.match.params.id ? <h1>Edit Show Details</h1> : <h1>Add a Show</h1>}
                    <Form.Field>
                        <label>Date</label>
                        <input 
                            type="date" 
                            className="ui calendar" 
                            value={this.state.showData.date} 
                            onChange={(event) => this.handleChange("date", event.target.value)}/>
                    </Form.Field>
                    <Form.Field>
                        <label>Venue</label>
                        <Input value={this.state.showData.venue} onChange={(event) => this.handleChange("venue", event.target.value)} />
                    </Form.Field>
                    <Form.Field>
                        <label>First Set</label>
                        <TextArea value={this.state.showData.first_set} onChange={(event) => this.handleChange("first_set", event.target.value)} />
                    </Form.Field>
                    {this.props.match.params.id && this.state.loading ? 
                        null :
                        <Accordion 
                            as={Form.Field} 
                            panels={panels} 
                            defaultActiveIndex={[
                                this.state.showData.second_set ? 0 : -1,
                                this.state.showData.encore ? 1 : -1
                            ]}
                            exclusive={false}/>
                    }
                    <div className="submit-button">
                        {this.props.match.params.id ? 
                            <Button type="Submit" onClick={this.updateHandler}>Save</Button> :
                            <Button type="Submit" onClick={this.postDataHandler}>Add Show</Button>}
                    </div>
                </Form>
            </div>
        );
    }
}

export default NewShow;