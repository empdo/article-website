import * as React from 'react';
import firebase from 'firebase/app';
import {RouteComponentProps, withRouter} from 'react-router';
import 'firebase/auth';
import {Link} from 'react-router-dom';
import "./AuthForm.scss";

export interface AuthFormProps extends RouteComponentProps {
    action: Actions;
}

export enum Actions {
    signUp = 'sign up',
    signIn = 'sign in'
}

export interface AuthFormState {
    password: string;
    email: string;
    errorMsg?: string;
}

class AuthForm extends React.Component<AuthFormProps, AuthFormState> {
    constructor(props: AuthFormProps) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.googleAuth = this.googleAuth.bind(this);
        this.state = {
            email: '',
            password: ''
        };
    }

    googleAuth(): JSX.Element {
        const googleAuthProvider = new firebase.auth.GoogleAuthProvider();

        return (
            <div>
                <button
                    onClick={() => {
                        firebase.auth().signInWithPopup(googleAuthProvider);
                        this.props.history.push('/');
                    }}>
                    Sign in with google
                </button>
            </div>
        );
    }

    async handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        // Stops form from reloading page on submit
        e.preventDefault();
        e.currentTarget.reset();

        const firebaseAuth = firebase.auth();
        let user: firebase.auth.UserCredential | undefined;
        try {
            switch (this.props.action) {
                case Actions.signIn:
                    user = await firebaseAuth.signInWithEmailAndPassword(this.state.email, this.state.password);
                    break;
                case Actions.signUp:
                    user = await firebaseAuth.createUserWithEmailAndPassword(this.state.email, this.state.password);
                    break;
            }
        } catch (error) {
            switch (error.code) {
                case 'auth/wrong-password':
                    this.setState({errorMsg: 'Incorrect password. Try again.'});
                    break;

                case 'auth/user-not-found':
                    this.setState({errorMsg: 'Incorrect email. Try again.'});
                    break;
                case 'auth/email-already-in-use':
                    this.setState({errorMsg: 'Email already in use. Try again.'});
                    break;
                default:
                    this.setState({errorMsg: error.message});
                    break;
            }

            console.error(error);
            return;
        }

        this.setState({errorMsg: undefined});
        console.log('user', user);

        this.props.history.push('/');
    }

    render() {
        return (
            <div className="form-container">
                <form onSubmit={this.handleSubmit}>
                    <input onChange={e => this.setState({email: e.currentTarget.value})} placeholder='email' />
                    <input
                        onChange={e => this.setState({password: e.currentTarget.value})}
                        placeholder='Password'
                        type='password'
                        />
                    <button type='submit'>{this.props.action}</button>
                    <span className='error'>{this.state.errorMsg}</span>
                    {this.props.action === Actions.signIn && <> <p>or</p> <this.googleAuth /> </>}

                    {this.props.action === Actions.signIn && (
                        <p>
                            Don't have an account yet? <Link to='/signup'>Sign up</Link>
                        </p>
                    )}
                    {this.props.action === Actions.signUp && (
                        <p>
                            Already have an account? <Link to='/login'>Log in</Link>
                        </p>
                    )}
                </form>
            </div>
        );
    }
}

export default withRouter(AuthForm);
