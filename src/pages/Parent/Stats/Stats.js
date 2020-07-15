import React, { Component } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Dropdown } from 'semantic-ui-react'

import './Stats.scss';

class Stats extends Component {
    state = {
        statSelected: "",
        currentStatArray: []
        // times_played_list: [],
        // percentage_played_list: [],
        // first_set_openers: [],
        // second_set_openers: [],
        // first_set_closers: [],
        // second_set_closers: [],
        // encore_appearances: []
    }

    // componentWillMount() {
    //     this.fetchAllTimesPlayed();
    //     this.fetchAllPercentagePlayed();
    //     this.fetchSetOpenerCounts(1);
    //     this.fetchSetOpenerCounts(2);
    //     this.fetchSetCloserCounts(1);
    //     this.fetchSetCloserCounts(2);
    //     this.fetchEncoreAppearances();
    // }

    // fetchAllTimesPlayed() {
    //     axios.get("/all_times_played")
    //         .then(response => {
    //             this.setState({
    //                 times_played_list: response.data
    //             });
    //         });
    // }

    // fetchAllPercentagePlayed() {
    //     axios.get("/all_percentage_played")
    //         .then(response => {
    //             this.setState({
    //                 percentage_played_list: response.data
    //             });
    //         });
    // }

    // fetchSetOpenerCounts(setNumber) {   
    //     axios.get("/all_set_openers/" + setNumber)
    //         .then(response => {
    //             switch(setNumber) {
    //                 case 1:
    //                     this.setState({
    //                         first_set_openers: response.data
    //                     });
    //                     break;
    //                 case 2:
    //                     this.setState({
    //                         second_set_openers: response.data
    //                     });
    //                     break;
    //             }
    //         });
    // }

    // fetchSetCloserCounts(setNumber) {   
    //     axios.get("/all_set_closers/" + setNumber)
    //         .then(response => {
    //             switch(setNumber) {
    //                 case 1:
    //                     this.setState({
    //                         first_set_closers: response.data
    //                     });
    //                     break;
    //                 case 2:
    //                     this.setState({
    //                         second_set_closers: response.data
    //                     });
    //                     break;
    //             }
    //         });
    // }

    // fetchEncoreAppearances() {
    //     axios.get("/all_encore_appearances")
    //         .then(response => {
    //             this.setState({
    //                 encore_appearances: response.data
    //             });
    //         });
    // }

    handleSelectStat(e, valueObj) {
        const selectedObj = valueObj.options.find(option => option.value === valueObj.value);
        axios.get(selectedObj.path).then(response => {
            this.setState({
                currentStatArray: response.data
            });
        });
        this.setState({
            statSelected: selectedObj
        });
    }

    render() {

        const statsList = [
            {
                text: "Times Played",
                value: "timesPlayed",
                path: "/all_times_played"
            },
            {
                text: "Percentage of Shows",
                value: "showPercentage",
                path: "/all_percentage_played"
            },
            {
                text: "First Set Openers",
                value: "firstSetOpeners",
                path: "/all_set_openers/1"
            },
            {
                text: "Second Set Openers",
                value: "secondSetOpeners",
                path: "/all_set_openers/2"
            },
            {
                text: "First Set Closers",
                value: "firstSetClosers",
                path: "/all_set_closers/1"
            },
            {
                text: "Second Set Closers",
                value: "secondSetClosers",
                path: "/all_set_closers/2"
            },
            {
                text: "Encore Appearances",
                value: "encoreAppearances",
                path: "/all_encore_appearances"
            },
        ]

        const selectStatDropdown = () => {
            return <Dropdown
                placeholder='Select Stat'
                selection
                options={statsList}
                onChange={this.handleSelectStat.bind(this)}
            />
        }

        let showPercentSign = () => {
            return this.state.statSelected.value === "showPercentage"
        }

        return (
            <section className="Stats">
                <h1>Statistics</h1>
                <div className="statistics">
                    {selectStatDropdown()}
                    <div className="song-list">
                        {/* <h3>{this.state.statSelected.text}</h3> */}
                        {this.state.currentStatArray.map((song, i) => {
                            return <div className="single-song" key={i}>
                                <Link to={"/song/" + song.id}>{song.title}</Link> - {showPercentSign() ? "%" : ""}{song.value}
                            </div>
                        })}
                    </div>

                    {/* <div className="column">
                        <h3>Times Played</h3>
                        {this.state.times_played_list.map((song, i) => {
                            return <div key={i}>
                                <Link to={"/song/" + song.id}>{song.title}</Link> - {song.times_played}
                            </div>
                        })}
                    </div>

                    <div className="column">
                        <h3>Percentage of Shows</h3>
                        {this.state.percentage_played_list.map((song, i) => {
                            return <div key={i}>
                                <Link to={"/song/" + song.id}>{song.title}</Link> - %{song.percentage_played}
                            </div>
                        })}
                    </div>

                    <div className="column">
                        <h3>First Set Openers</h3>
                        {this.state.first_set_openers.map((song, i) => {
                            return <div key={i}>
                                <Link to={"/song/" + song.id}>{song.title}</Link> - {song.set_opener_count}
                            </div>
                        })}
                    </div>

                    <div className="column">
                        <h3>Second Set Openers</h3>
                        {this.state.second_set_openers.map((song, i) => {
                            return <div key={i}>
                                <Link to={"/song/" + song.id}>{song.title}</Link> - {song.set_opener_count}
                            </div>
                        })}
                    </div>

                    <div className="column">
                        <h3>First Set Closers</h3>
                        {this.state.first_set_closers.map((song, i) => {
                            return <div key={i}>
                                <Link to={"/song/" + song.id}>{song.title}</Link> - {song.set_closer_count}
                            </div>
                        })}
                    </div>

                    <div className="column">
                        <h3>Second Set Closers</h3>
                        {this.state.second_set_closers.map((song, i) => {
                            return <div key={i}>
                                <Link to={"/song/" + song.id}>{song.title}</Link> - {song.set_closer_count}
                            </div>
                        })}
                    </div>

                    <div className="column">
                        <h3>Encore Appearances</h3>
                        {this.state.encore_appearances.map((song, i) => {
                            return <div key={i}>
                                <Link to={"/song/" + song.id}>{song.title}</Link> - {song.encore_appearances}
                            </div>
                        })}
                    </div> */}
                </div>
            </section>
        );        
    }

}

export default Stats;