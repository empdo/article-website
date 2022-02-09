import * as React from 'react';
import 'tinymce/tinymce';
import contentManager from '../../../ContentManager';
import DropDown, {DropDownItem} from '../../common/DropDown';
import {Article, ArticleContent} from '../../../interfaces';
import Loading from '../../common/Loading';
import {RouteComponentProps} from 'react-router-dom';
import './writeArticle.scss';
// import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
// import {EditorState} from 'draft-js';

import SunEditor from 'suneditor-react';
import SunEditorCore from 'suneditor/src/lib/core';
// import 'suneditor/dist/css/suneditor.min.css'; // Import Sun Editor's CSS File
import '../../../suneditor.scss';
import {
    align,
    font,
    fontColor,
    fontSize,
    formatBlock,
    hiliteColor,
    horizontalRule,
    lineHeight,
    list,
    paragraphStyle,
    table,
    template,
    textStyle,
    image,
    link
} from 'suneditor/src/plugins';

export interface WriteArticlePropsMatchParams {
    id?: string;
}

export interface WriteArticleProps extends RouteComponentProps<WriteArticlePropsMatchParams> {}

export interface WriteArticleState {
    articleTitles: string[];
    currentArticle: Partial<Article>;
}

class WriteArticle extends React.Component<WriteArticleProps, WriteArticleState> {
    editorRef: React.RefObject<SunEditorCore | null> = React.createRef();

    constructor(props: WriteArticleProps) {
        super(props);
        this.componentDidMount = this.componentDidMount.bind(this);
        this.handleContent = this.handleContent.bind(this);
        this.saveArticle = this.saveArticle.bind(this);
        this.changeDescription = this.changeDescription.bind(this);
        this.changeTitle = this.changeTitle.bind(this);
        this.state = {
            articleTitles: [],
            currentArticle: {}
        };
    }

    // static getDerivedStateFromProps(nextProps: WriteArticleProps, prevState: WriteArticleState): WriteArticleState {
    //     return {
    //         ...prevState,
    //         articleTitles: contentManager.articles.map(article => article.title),
    //         currentArticle: contentManager.articles.find(article => article.id === nextProps.match.params.id) || {}
    //     };
    // }

    getSunEditorInstance = (sunEditor: SunEditorCore) => {
        // TODO: Fix this for real.
        (this.editorRef.current as any) = sunEditor;
    };

    handleChange(content: string) {
        console.log('OnChange: ', content);
    }

    handleContent() {
        console.log(this.props.match.params.id);
        
        this.setState({
            articleTitles: contentManager.articles.map(article => "draft" in article ? article.draft.title : article.title),
            currentArticle: contentManager.articles.find(article => article.id === this.props.match.params.id) || {}
        });

        this.editorRef.current?.setContents(this.state.currentArticle.data || '');
    }

    updatePublish() {}

    saveArticle(e: React.FormEvent) {
        e.preventDefault();

        let currentArticle = this.state.currentArticle;
        let content = this.editorRef.current?.getContents(true) || '';
        if (currentArticle) {
            if (currentArticle.id) {
                contentManager.saveArticle(
                    currentArticle.id,
                    currentArticle.description || '',
                    currentArticle.title || '',
                    content
                );
            } else {
                contentManager.createArticle(currentArticle.description || '', currentArticle.title || '', content);
            }
        }
    }

    changeTitle(e: React.ChangeEvent<HTMLInputElement>) {
        if (this.state.currentArticle) {
            this.setState({currentArticle: {...this.state.currentArticle, title: e.target.value}});
        }
    }

    changeDescription(e: React.ChangeEvent<HTMLTextAreaElement>) {
        if (this.state.currentArticle) {
            this.setState({currentArticle: {...this.state.currentArticle, description: e.target.value}});
        }
    }

    componentDidMount() {
        contentManager.addListener('article', this.handleContent);
    }

    componentWillUnmount() {
        contentManager.removeListener('article', this.handleContent);
    }
    render() {
        let showEditor: boolean =
            (!!this.state.currentArticle || !this.props.match.params.id) && contentManager.authenticated;

        if (!contentManager.isAdmin && showEditor) {
            return (
                <>
                    <h1>Access denied</h1>
                    <p>Only admins can write new articles</p>
                </>
            );
        }

        let dropDownItems: DropDownItem[] = contentManager.articles.map(article => ({
            text: article.title,
            callback: async () => {
                await this.props.history.push('/write/' + article.id);
                this.handleContent();
            }
        }));

        let articleContent = ("draft" in this.state.currentArticle ? this.state.currentArticle.draft : this.state.currentArticle) as Partial<ArticleContent>;

        return (
            <>
                <div className='sunEditor-container'>
                    {showEditor ? (
                        <>
                            <SunEditor
                                autoFocus={true}
                                lang='en'
                                setOptions={{
                                    showPathLabel: false,
                                    minHeight: '50vh',
                                    maxHeight: '50vh',
                                    placeholder: 'Your text here',
                                    plugins: [
                                        align,
                                        font,
                                        fontColor,
                                        fontSize,
                                        formatBlock,
                                        hiliteColor,
                                        horizontalRule,
                                        lineHeight,
                                        list,
                                        paragraphStyle,
                                        table,
                                        template,
                                        textStyle,
                                        image,
                                        link
                                    ],
                                    buttonList: [
                                        ['undo', 'redo'],
                                        ['font', 'fontSize', 'formatBlock'],
                                        ['paragraphStyle'],
                                        ['bold', 'underline', 'italic', 'strike', 'subscript', 'superscript'],
                                        ['fontColor', 'hiliteColor'],
                                        ['removeFormat'],
                                        '/', // Line break
                                        ['outdent', 'indent'],
                                        ['align', 'horizontalRule', 'list', 'lineHeight'],
                                        ['table', 'link', 'image']
                                    ],
                                    formats: ['p', 'div', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
                                    font: [
                                        'Arial',
                                        'Calibri',
                                        'Comic Sans',
                                        'Courier',
                                        'Garamond',
                                        'Georgia',
                                        'Impact',
                                        'Lucida Console',
                                        'Palatino Linotype',
                                        'Segoe UI',
                                        'Tahoma',
                                        'Times New Roman',
                                        'Trebuchet MS'
                                    ]
                                }}
                                onChange={this.handleChange}
                                getSunEditorInstance={this.getSunEditorInstance}
                                //                    defaultValue= {this.currentArticle ? this.currentArticle.data : "<p>Your text here...</p>"}
                                defaultValue={articleContent.data}
                            />
                            <div className='info-container'>
                                <div>
                                <button
                                    id="new-article-button"
                                    onClick={async () => {
                                        await this.props.history.push('/write');
                                        this.handleContent();
                                    }}>
                                    +
                                </button>
                                <DropDown options={dropDownItems}>Modify existing</DropDown>
                                </div>
                                <form>
                                    <input
                                        type='text'
                                        placeholder='Title'
                                        defaultValue={articleContent.title}
                                        onChange={this.changeTitle}
                                    />
                                    <textarea
                                        name='text'
                                        rows={10}
                                        cols={23}
                                        placeholder='Description'
                                        defaultValue={articleContent.description}
                                        onChange={this.changeDescription}
                                    />
                                </form>
                                <div>
                                    <button onClick={this.saveArticle}>Save draft</button>
                                    <button
                                        onClick={e => {
                                            e.preventDefault();
                                            contentManager.publishArticle(this.state.currentArticle.id || '');
                                        }}>
                                        Publish
                                    </button>
                                    
                                    {this.state.currentArticle.id &&

                                    <div onClick={
                                        e => {
                                            e.preventDefault();
                                            contentManager.removeArticle(this.state.currentArticle.id || "");
                                        }
                                    } id="remove-article-button"><img alt="trashcan" src="https://img.icons8.com/windows/32/000000/delete.png"/></div> }
                                </div>
                            </div>
                        </>
                    ) : (
                        <Loading />
                    )}
                </div>
            </>
        );
    }
}

export default WriteArticle;
