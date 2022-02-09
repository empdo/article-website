import firebase from 'firebase';

export interface ArticleContent {
    title: string;
    data: string;
    description: string;
}

export interface BaseArticle extends ArticleContent {
    id: string;
    purchased?: boolean;
}

export interface ModifiedArticle extends BaseArticle {
    draft: ArticleContent;
}

export type Article = BaseArticle | ModifiedArticle;

export interface UserDoc extends Partial<firebase.firestore.DocumentSnapshot<firebase.firestore.DocumentData>> {
    purchasedArticles: string[];
    role?: string;
}
