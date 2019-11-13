import React, { Component } from 'react';
import axios from '../../../axios';
import { Route, Link } from 'react-router-dom';
import { Card } from 'semantic-ui-react';


import Post from '../../../components/Post/Post';
import './ShowsList.css';
import FullPost from '../FullPost/FullPost';
import ShowCard from '../../../components/ShowCard/ShowCard'

class ShowsList extends Component {
    state = {
        shows: []
    }

    componentDidMount() {
        axios.get( '/shows' )
            .then( response => {
                this.setState({ 
                    shows: response.data 
                });
                console.log( response.data );
            } )
            .catch( error => {
                console.log( error );
                // this.setState({error: true});
            } );
    }

    render() {
        let showCards = <p style={{ textAlign: 'center' }}>Something went wrong!</p>;
        if ( !this.state.error ) {
            showCards = this.state.shows.map( (show, i) => {
                let date = show.date? new Date(show.date + " EST").toLocaleDateString() : "";
                return (
                    <Link className="ui card" to={'/show/' + show.id} key={i}>
                        <ShowCard
                            key={i}
                            id={show.id}
                            // to={'/show/' + show.id}
                            // history={this.props.history}
                            date={date}
                            venue={show.venue}
                            img={show.img}
                        />
                    </Link>
                )
            });
        }

        return (
            <div>
                <section className="ShowsList">
                    <div className="cards">
                        <Card.Group>
                            {/* {this.props.products.map( (product, i) => */}
                            {/* )} */}
                            {showCards}
                        </Card.Group>
                    </div>
                </section>
            </div>
        );
    }
}

export default ShowsList;