import React, { Component } from 'react';
import axios from 'axios';
import { Button, Confirm } from 'semantic-ui-react'
import { useHistory, Redirect } from 'react-router-dom';
import ConfirmDialog from 'components/ConfirmDialog/ConfirmDialog';

import "./DeleteButton.css";

class DeleteButton extends Component {
    state = {
        open: false
    }

    show = () => this.setState({ open: !this.state.open });
    close = () => this.setState({ open: false });

    handleDelete = () => {
        axios.delete("/shows/" + this.props.id).then( () => {
            this.close();
            this.props.history.push("/shows");
        });
    }

    render() {
        return (
            <Button
                className="Delete"
                onClick={this.show} 
            >
                    Delete
                    <Confirm
                        open={this.state.open}
                        content="Are you sure you want to delete this show and all of its data?"
                        onConfirm={this.handleDelete}
                    />
            </Button>
        );
    }
}
export default DeleteButton;