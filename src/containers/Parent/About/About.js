import React, { Component } from 'react';

import './About.css';

class About extends Component {
    state = {
        title: '',
        content: '',
        author: 'Max'
    }

    componentDidMount () {
        console.log(this.props);
    }

    render () {
        return (
            <section className="About">
                <h1>About Go Man Go</h1>
            </section>
        );
    }
}

export default About;