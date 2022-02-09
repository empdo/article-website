import * as React from 'react';
import AuthForm, {Actions} from '../common/AuthForm';

export interface SignInProps {}

export interface SignInState {}

class SignIn extends React.Component<SignInProps, SignInState> {
    constructor(props: SignInProps) {
        super(props);
        this.state = {};
    }
    render() {
        return <AuthForm action={Actions.signIn} />;
    }
}

export default SignIn;
