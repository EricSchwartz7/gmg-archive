import React, { Component } from 'react';
import { Button, Form, Input, Message } from 'semantic-ui-react'
import { Redirect } from 'react-router-dom';

import './LogIn.scss';

class LogIn extends Component {
    state = {
        success: false,
        invalidLogIn: false,
        email: "",
        password: ""
    }

    handleChange (event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        this.setState({
            [name]: value
        });
    }

    handleLogIn() {
        let credentials = {
            email: this.state.email,
            password: this.state.password
        }
        this.props.handleLogIn(credentials).then(function() {
            this.setState({
                success: true,
                invalidLogIn: false
            });
            window.setTimeout(() => {
                this.props.history.push("/shows");
            }, 2000);
        }.bind(this)).catch(() => {
            this.setState({
                success: false,
                invalidLogIn: true
            });
        })
    }

    validateForm() {
        return (
            this.state.email.length > 0 &&
            this.state.password.length > 0
        )
    }

    render() {    
        return (
            <section className="LogIn">
                <Form success={this.state.success} error={this.state.invalidLogIn}>
                    <Form.Field>
                        <Input
                            name='email'
                            label='Email'
                            type='email'
                            placeholder='joe@schmoe.com' 
                            onChange={this.handleChange.bind(this)}
                        />
                    </Form.Field>
                    <Form.Field>
                        <Input
                            name='password'
                            label='Password'
                            type='password'
                            onChange={this.handleChange.bind(this)}
                        />
                    </Form.Field>
                    <Message
                        success
                        header="Wepa!"
                        content="You have successfully logged in."
                    />
                    <Message
                        error
                        header="Uh oh."
                        content="You email or password is incorrect."
                    />
                    <Button 
                        onClick={this.handleLogIn.bind(this)}
                        disabled={!this.validateForm()}
                    >Log In</Button>
                    <br/>
                    {/* <Link to={"/signup"}>Sign Up</Link> */}
                </Form>

            </section>
        );
    }
}

export default LogIn;