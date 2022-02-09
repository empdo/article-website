import React, {useEffect} from 'react';
import firebase from 'firebase';
import './app.scss';
import {Link, Route, BrowserRouter, Switch, Redirect} from 'react-router-dom';
import SignUp from './components/signUp/SignUp';
import SignIn from './components/signIn/SignIn';
import Articles from './components/Articles/Articles';
import NotFound from './components/notFound/NotFound';
import ArticlePreview from './components/article/read/ArticlePreview';
import WriteArticle from './components/article/write/WriteArticle';
import contentManager from './ContentManager';
import Home from './components/home/Home';
import Contact from './components/contact/Contact';

export interface AppProps {}

export interface AppState {
    user: firebase.User | null;
    isAdmin: boolean | undefined;
}

const LogOut: React.FC = () => {
    useEffect(() => {
        firebase.auth().signOut();
    }, []);
    return (
        <>
            Logging out...
            <Redirect to='/' />
        </>
    );
};

class App extends React.Component<AppProps, AppState> {
    constructor(props: AppProps) {
        super(props);

        this.handleAuth = this.handleAuth.bind(this);

        this.state = {
            user: firebase.auth().currentUser,
            isAdmin: contentManager.isAdmin,
        };

        this.NavBar = this.NavBar.bind(this);
    }

    handleAuth(user: firebase.User | null) {
        this.setState({user: user});
        this.setState({isAdmin: contentManager.isAdmin})
    }

    componentDidMount() {
        contentManager.addListener('auth', this.handleAuth);
    }
 
    componentWillUnmount() {
        contentManager.removeListener('auth', this.handleAuth);
        contentManager.destroy();
    }

    NavBar(): JSX.Element {
        return (
            <nav>
                <Link to='/'><strong>In</strong>-sight</Link>
                {this.state.user ? <Link to='/logout'>logout</Link> : <Link to='/login'>login</Link>}
                <Link to='/contact'>contact me</Link>
                <Link to='/articles'>articles</Link>
                {this.state.isAdmin && <Link to='/write'>write</Link>}
            </nav>
        );
    }

    Footer(): JSX.Element {
        return ( 
            <div className="footer">
                <div>
                    <Link to='/contact'>contact me</Link>
                    <br/>
                    <Link to='/articles'>articles</Link>
                </div>
                <p>In-sight © 2021</p>  
            </div>
        )
    }

    render() {
        return (
            <BrowserRouter>
                <this.NavBar />
                <div className='app'>
                    <Switch>
                        <Route exact path='/' component={Home}/>
                        <Route exact path='/Articles' component={Articles} />
                        <Route path='/signin'>
                            <Redirect to='/login' />
                        </Route>
                        <Route path='/view/:id' component={ArticlePreview} />
                        <Route path={["/write", "/write/:id"]} exact component={WriteArticle} />
                        <Route path='/login' component={SignIn} />
                        <Route path='/logout' component={LogOut} />
                        <Route path='/signUp' component={SignUp} />
                        <Route path='/contact' component={Contact} />

                        <Route path='/' component={NotFound} />
                    </Switch>
                </div>
                <hr/>
                <this.Footer/>
            </BrowserRouter>
        );
    }
}

export default App;
