import * as React from 'react';
import firebase from 'firebase/app';
import {Link} from 'react-router-dom';
import './Articles.scss';

export interface HomeProps {}

export interface HomeState {
    articles?: firebase.firestore.QuerySnapshot<firebase.firestore.DocumentData>;
}

export interface Article {
    title: string;
    description: string;
    data: string;
}

class Home extends React.Component<HomeProps, HomeState> {
    constructor(props: HomeProps) {
        super(props);
        this.state = {};
    }

    async componentDidMount() {
        this.setState({articles: await firebase.firestore().collection('articles').get()});
    }

    renderArticles(): JSX.Element[] {
        let articleList = this.state.articles?.docs || [];

        return articleList?.map(rawArticle => {
            let articleData = rawArticle.data() as Article;
            return (
                <article key={rawArticle.id} className='card'>
                    <Link to={'/view/' + rawArticle.id}>
                        <h2>{articleData.title}</h2>
                        <p>{articleData.description}</p>
                    </Link>
                </article>
            );
        });
    }

    render() {
        return (
            <main className='al-container'>
                <div>
                    <h1>Articles:</h1>
                    <ul className='articles'>{this.renderArticles()}</ul>
                </div>
            </main>
        );
    }
}

export default Home;
