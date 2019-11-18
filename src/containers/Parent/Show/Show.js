import React, { Component } from 'react';
import axios from 'axios';
import { Button, Label, Modal, Input, Form } from 'semantic-ui-react'
import { Link, useHistory } from 'react-router-dom';
import DeleteButton from "components/DeleteButton/DeleteButton";
import FormatHelper from "FormatHelper"
import AddMediaDialog from "components/AddMediaDialog/AddMediaDialog"

import './Show.scss';

class Show extends Component {
    state = {
    }

    // componentDidMount () {
    //     console.log(this.props);
    //     this.loadData();
    // }

    // componentDidUpdate() {
    //     this.loadData();
    // }

    componentWillMount() {
        this.loadData();
    }

    loadData () {
        if ( this.props.match.params.id ) {
            if ( !this.state.loadedShow || (this.state.loadedShow && this.state.loadedShow.id !== +this.props.match.params.id) ) {
                axios.get( '/shows/' + this.props.match.params.id )
                    .then( response => {
                        // console.log(response);
                        this.setState( { loadedShow: response.data } );
                    }).catch( () => {
                        this.setState( {loadedShow: "notfound"} );
                    })
            }
        }
    }

    // formatSetlist (setlist) {
    //     if (setlist) {
    //         return setlist.replace(/[\n\r]/g, ', ');
    //     }
    // }

    deleteShow = () => {
        axios.delete("/shows/" + this.props.match.params.id)
        let history = useHistory();
        history.push("/shows");
    }

    handleSubmit(videoData) {
        videoData.show_id = this.props.match.params.id;
        axios.post('/videos', videoData);
    }

    render () {
        let show = <p style={{ textAlign: 'center' }}>Please select a Show!</p>;
        if ( this.props.match.params.id ) {
            show = <p style={{ textAlign: 'center' }}>Loading show #{this.props.match.params.id}...</p>;
        }
        if (this.state.loadedShow === "notfound") {
            show = (
                <div>
                    <h3>404 Not Found</h3>
                </div>
            )
        } else if ( this.state.loadedShow ) {
            let date = new Date(this.state.loadedShow.date + " EST").toLocaleDateString();
            let firstSet = FormatHelper.formatSetlist(this.state.loadedShow.first_set);
            let secondSet = FormatHelper.formatSetlist(this.state.loadedShow.second_set);
            let encore = FormatHelper.formatSetlist(this.state.loadedShow.encore);

            show = (
                <div className="Show">
                    <h1>{date}</h1>
                    <h2>{this.state.loadedShow.venue}</h2>
                    <p><span>SET 1: </span>{firstSet}</p>
                    {secondSet ? (<p><span>SET 2: </span>{secondSet}</p>) : null}
                    {encore ? (<p><span>ENCORE: </span>{encore}</p>) : null}
                    <div className="button-group">
                        <Link to={'/upload/' + this.props.match.params.id}>        
                            <Button>Edit</Button>
                        </Link>
                        {/* <Link to={'/upload/'}>        
                            <Button>Add a photo or video</Button>
                        </Link> */}
                        <AddMediaDialog handleSubmit={this.handleSubmit.bind(this)}/>

                        <DeleteButton history={this.props.history} id={this.props.match.params.id} />
                    </div>
                </div>
            );
        }
        return show;
    }
}

export default Show;