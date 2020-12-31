import React, { Component } from 'react';
import { Button, Form, Input, Message } from 'semantic-ui-react'
import { Link } from 'react-router-dom';
import axios from 'axios';

import './SignUp.scss';

class SignUp extends Component {
    state = {
        success: false,
        signUpData: {
            email: "",
            password: "",
            confirmPassword: ""
        }
    }

    handleChange(event) {
        const name = event.target.name;
        const value = event.target.value;
        let signUpData = this.state.signUpData;
        signUpData[name] = value;

        this.setState({
            signUpData: signUpData
        });
    }

    validateForm() {
        return (
            this.state.signUpData.email.length > 0 &&
            this.state.signUpData.password.length > 0 &&
            this.state.signUpData.password === this.state.signUpData.confirmPassword
        )
    }

    handleSignUp() {
        axios.post("users", this.state.signUpData)
            .then(response => {
                this.setState({
                    success: true
                });
            });
    }

    render() {    
        return (
            <section className="SignUp">
                <Form success={this.state.success}>
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
                    <Form.Field>
                        <Input
                            name='confirmPassword'
                            label='Confirm Password'
                            type='password'
                            onChange={this.handleChange.bind(this)}
                        />
                    </Form.Field>
                    <Message
                        success
                        header='Form Completed'
                        content="You're all signed up for the newsletter"
                    />
                    <Button 
                        disabled={!this.validateForm()}
                        onClick={this.handleSignUp.bind(this)}
                    >Sign Up</Button>
                    <br/>
                    <Link to={"/login"}>Log in</Link>
                </Form>

            </section>
        );
    }
}

export default SignUp;