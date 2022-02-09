import * as React from 'react';
import {RouteComponentProps} from 'react-router-dom';
import {Article} from '../../../interfaces';
import contentManager from '../../../ContentManager';
import Loader from '../../common/Loading';
import PurchaseCard from '../../common/PurchaseCard';
import './ArticlePreview.scss';
import '../../../suneditor.scss';

export interface ArticlePreviewPropsMatchParams {
    id: string;
}

export interface ArticlePreviewProps extends RouteComponentProps<ArticlePreviewPropsMatchParams> {}

export interface ArticlePreviewState {
    article?: Article;
}

class ArticlePreview extends React.Component<ArticlePreviewProps, ArticlePreviewState> {
    constructor(props: ArticlePreviewProps) {
        super(props);
        this.getArticle = this.getArticle.bind(this);
        this.state = {};
    }

    getArticle() {
        console.log(JSON.parse(JSON.stringify(contentManager.articles)));
        const article = contentManager.articles.find(article => article.id === this.props.match.params.id);

        console.log(article);

        this.setState({article: {title: article?.title || "", data: article?.data || "", description: article?.description || ""} as Article});
    }

    componentDidMount() {
        this.getArticle();
        contentManager.addListener('article', this.getArticle);
    }

    componentWillUnmount() {
        contentManager.removeListener('article', this.getArticle);
    }

    render() {
        if (this.state.article) {
            let {data, description} = this.state.article;
            return (
                <main className='article'>
                    <div>
                        <h1>{this.state.article?.title}</h1>
                        <p id="description">{description}</p>
                    </div>
                    {data && <div className="content sun-editor-editable" dangerouslySetInnerHTML={{__html: data}}></div>}
                    <p>{data ? "Purchased" : <PurchaseCard />}</p>
                </main>
            );
        } else {
            return <Loader></Loader>;
        }
    }
}

export default ArticlePreview;