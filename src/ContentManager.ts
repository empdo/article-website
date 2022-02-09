import {Article, ArticleContent, ModifiedArticle, UserDoc} from './interfaces';
import firebase from 'firebase';
import EventEmitter from 'events';


class ContentManager extends EventEmitter {
    private unsubs: (firebase.Unsubscribe | undefined)[] = [];
    public articles: Article[] = [];
    public userDocument?: UserDoc;
    public authenticated: boolean;
    public isAdmin?: boolean;

    constructor() {
        super();

        if (!firebase.apps.length) {
            firebase.initializeApp({
               apiKey: "",
                authDomain: "",
                projectId: "",
                storageBucket: "",
                messagingSenderId: "",
                appId: "",
                measurementId: ""
            });
        } else {
            firebase.app();
        }

        this.authenticated = !!firebase.auth().currentUser;
        this.unsubs.push(firebase.auth().onAuthStateChanged(this.handleAuthChanged.bind(this)));
        this.unsubs.push(firebase.firestore().collection('articles').onSnapshot(this.handleContentChanged.bind(this)));

        (window as any).contentManager = this;
    }

    public destroy() {
        this.unsubs.forEach(unsub => unsub?.());
        this.removeAllListeners();
    }

    private async handleAuthChanged(user: firebase.User | null) {
        this.authenticated = !!user;

        if (user !== null) {

            let doc = firebase.firestore().collection('users').doc(user.uid);

            doc.get().then(doc => {
                if(!doc.exists) {
                    firebase.firestore().collection('users').doc(user.uid).set(
                        {
                            purchasedArticles: []
                        },
                        {merge: true}
                    );
                }
                this.userDocument = doc.data() as UserDoc;
                this.isAdmin = this.userDocument?.role === 'admin';
                
                this.handleContentChanged();
                this.emit('auth', user);
            })

        } else {
            this.userDocument = undefined;
            this.isAdmin = undefined;

            this.emit('auth', user);
            await this.handleContentChanged();
        }
    }

    private async handleContentChanged() {
        const db = firebase.firestore();
        const articleDocs = (await db.collection('articles').get()).docs;
        const articles: Article[] | ModifiedArticle[] = articleDocs.map(doc => doc.data() as Article);
        await Promise.all(
            articleDocs.map(async (doc, index) => {

                const purchased = this.userDocument?.purchasedArticles.includes(doc.id);
                articles[index].purchased = purchased;
                articles[index].id = doc.id;

                if (purchased || this.isAdmin) {
                    articles[index].data = await (await doc.ref.collection('full').doc('content').get()).data()?.data;
                    let draft: ArticleContent | undefined = ((await doc.ref.collection('draft').doc('content').get()).data() as ArticleContent | undefined);
                    if (draft) {
                        (articles[index] as ModifiedArticle).draft = draft;
                    }
                }
            })
        );

        this.articles = articles;
        this.emit('article', articles);
    }

    public addListener(event: 'auth', listener: (user: firebase.User | null) => void): this;
    public addListener(event: 'article', listener: (article: Article[]) => void): this;
    public addListener(event: string, listener: (...args: any[]) => void): this {
        return super.addListener(event, listener);
    }

    async modifyArticle(id: string, description: string, title: string, data: string) {
        let article = firebase.firestore().collection('articles').doc(id);

        await article.update({description: description, title: title});
        await article.collection('full').doc('content').update({data: data});
        console.log('updated article!');
    }

    async createArticle(description: string, title: string, data: string) {
        let article = firebase.firestore().collection('articles').doc();

        await article.set({
            description: description,
            title: title
        });

        await article.collection('full').doc('content').set({data: data});
    }

    async saveArticle(id: string, description: string, title: string, data: string) {
        let article = firebase.firestore().collection('articles').doc(id).collection('draft').doc("content");
        
        await article.set({
            description: description,
            title: title,
            data: data
        });

        console.log("Saved article to draft");
    }

    async removeArticle(id: string) {
        let article = firebase.firestore().collection('articles').doc(id);

        if(id !== "") {
            article.delete().then(() => {
                console.log("Removed article!");
            });
        }
    }

    async publishArticle(id?: string) {

        if (!id) {return} 
        let article = firebase.firestore().collection('articles').doc(id);
        let draft = (await article.collection("draft").doc("content").get()).data();

        await article.update({
            description: draft?.description,
            title: draft?.title
        });
        
        await article.collection('full').doc('content').update({data: draft?.data});
        console.log("published article");

    }
}

const contentManager = new ContentManager();

export default contentManager;
