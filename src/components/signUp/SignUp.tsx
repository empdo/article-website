import * as React from 'react';
import AuthForm, {Actions} from '../common/AuthForm';

export interface SignUpProps {
    
}
 
export interface SignUpState {
    
}
 
class SignUp extends React.Component<SignUpProps, SignUpState> {
    constructor(props: SignUpProps) {
        super(props);
        this.state = {};
    }
    render() { 
        return <AuthForm action={Actions.signUp} />;
    }
}

export default SignUp;