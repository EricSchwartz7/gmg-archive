import React, { Component } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Dropdown } from 'semantic-ui-react'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'

import './Stats.scss';

class Stats extends Component {
    state = {
        statSelected: "",
        currentStatArray: [],
        loading: false
    }

    handleSelectStat(e, valueObj) {
        const selectedObj = valueObj.options.find(option => option.value === valueObj.value);
        this.setState({
            loading: true,
            statSelected: selectedObj
        });
        axios.get(selectedObj.path).then(response => {
            this.setState({
                currentStatArray: response.data,
                loading: false
            });
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

        let songList;

        if (this.state.loading) {
            songList = <div>Loading...</div>
        } else {
            songList = this.state.currentStatArray.map((song, i) => {
                return <div className="single-song" key={i}>
                    <Link to={"/song/" + song.id}>{song.title}</Link> - {song.value}{showPercentSign() ? "%" : ""}
                </div>
            });
        }

        const chartOptions = {
            title: {
                text: "Songs",
            },
            colors: ["orange"],
            chart: {
                height: (this.state.currentStatArray.length * 20) + 100,
                type: "bar"
            },
            xAxis: {
                categories: this.state.loading? [] : this.state.currentStatArray.map(song => song.title)
            },
            yAxis: {
                title: {
                    text: null
                }
            },
            series: [{
                name: this.state.statSelected.text || "",
                data: this.state.loading? [] : this.state.currentStatArray.map(song => {
                    return {
                        y: song.value,
                        key: song.id
                    }
                })
            }],
            plotOptions: {
                series: {
                    cursor: 'pointer',
                    point: {
                        events: {
                            click: (event) => {
                                this.props.history.push(`/song/${event.point.key}`);
                            }
                        }
                    }
                }
            },
        };

        return (
            
            <section className="Stats">
                <h1>Statistics</h1>
                <div className="statistics">
                    {selectStatDropdown()}
                    {/* <div className="song-list">
                        {songList}
                    </div> */}
                </div>
                {this.state.statSelected ? <HighchartsReact
                    highcharts={Highcharts}
                    options={chartOptions}
                    immutable={true}
                /> : ""}
            </section>
        );
    }

}

export default Stats;