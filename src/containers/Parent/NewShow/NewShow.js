import React, { Component } from 'react';
import axios from 'axios';
import { Link, Redirect } from 'react-router-dom';
import { Button, Form, Input, TextArea } from 'semantic-ui-react'
import SemanticDatepicker from 'react-semantic-ui-datepickers';

import './NewShow.css';
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
        showID: 0
    }

    componentWillMount() {
        this.loadData();
    }

    loadData () {
        if ( this.props.match.params.id ) {
            if ( !this.state.loadedShow || (this.state.loadedShow && this.state.loadedShow.id !== +this.props.match.params.id) ) {
                axios.get( '/shows/' + this.props.match.params.id )
                    .then( response => {
                        response.data.date = new Date(response.data.date);
                        console.log(response);
                        this.setState( { showData: response.data } );
                    });
            }
        }
    }

    componentDidMount () {
        // console.log(this.props);
    }

    postDataHandler = () => {
        axios.post('/shows', this.state.showData)
            .then(response => {
                // console.log(response);
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
        console.log(this.state);
    }

    render () {
        if (this.state.routeToShow === true) {
            return <Redirect to={'/show/' +  this.state.showID}/>
        }

        let date = new Date(this.state.showData.date);
        // this.handleChange("date", date);

        return (
            <div className="NewShow">
                <Form>
                    <h1>Add a Show</h1>
                    <Form.Field>
                        <label>Date</label>
                        <SemanticDatepicker 
                            // value={date}
                            // selectedDate={date}
                            onDateChange={(dateValue) => this.handleChange("date", dateValue)} 
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>Venue</label>
                        <Input value={this.state.showData.venue} onChange={(event) => this.handleChange("venue", event.target.value)} />
                    </Form.Field>
                    <Form.Field>
                        <label>First Set</label>
                        <TextArea value={this.state.showData.first_set} onChange={(event) => this.handleChange("first_set", event.target.value)} />
                    </Form.Field>
                    <Form.Field>
                        <label>Second Set</label>
                        <TextArea value={this.state.showData.second_set} onChange={(event) => this.handleChange("second_set", event.target.value)} />
                    </Form.Field>
                    <Form.Field>
                        <label>Encore</label>
                        <TextArea value={this.state.showData.encore} rows={1} onChange={(event) => this.handleChange("encore", event.target.value)} />
                    </Form.Field>
                    {this.props.match.params.id ? 
                        <Button type="Submit" onClick={this.updateHandler}>Update Show</Button> :
                        <Button type="Submit" onClick={this.postDataHandler}>Add Show</Button>
                    }
                </Form>
            </div>
        );
    }
}

export default NewShow;