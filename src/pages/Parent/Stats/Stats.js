import React, { Component } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Dropdown, Loader } from 'semantic-ui-react'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import { CSSTransitionGroup } from 'react-transition-group';

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
        // axios.get(selectedObj.path).then(response => {
        const params = {
            params: {
                stat: selectedObj.value
            }
        }
        axios.get("songs", params).then(response => {
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
                value: "times_played",
                path: "all_times_played"
            },
            {
                text: "Percentage of Shows",
                value: "percentage_played",
                path: "all_percentage_played"
            },
            {
                text: "First Set Openers",
                value: "first_set_openers",
                path: "all_set_openers/1"
            },
            {
                text: "Second Set Openers",
                value: "second_set_openers",
                path: "all_set_openers/2"
            },
            {
                text: "First Set Closers",
                value: "first_set_closers",
                path: "all_set_closers/1"
            },
            {
                text: "Second Set Closers",
                value: "second_set_closers",
                path: "all_set_closers/2"
            },
            {
                text: "Encore Appearances",
                value: "encore_appearances",
                path: "all_encore_appearances"
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

        // let songList;

        // if (this.state.loading) {
        //     songList = <div>Loading...</div>
        // } else {
        //     songList = this.state.currentStatArray.map((song, i) => {
        //         return <div className="single-song" key={i}>
        //             <Link to={"/song/" + song.id}>{song.title}</Link> - {song.value}{showPercentSign() ? "%" : ""}
        //         </div>
        //     });
        // }

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

        let getChart = () => {
            let chart = ""
            if (this.state.statSelected) {
                if (this.state.loading) {
                    chart = <Loader active>Loading</Loader>;
                } else {
                    chart = 
                        <HighchartsReact
                            highcharts={Highcharts}
                            options={chartOptions}
                            immutable={true}
                        />;
                }
            }
            return chart;
        }

        return (
            
            <section className="Stats">
                <h1>Statistics</h1>
                <div className="statistics">
                    {selectStatDropdown()}
                </div>
                {getChart()}
            </section>
        );
    }

}

export default Stats;