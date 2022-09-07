export interface QueryParams {
    [k: string]: string;
}

export interface QueryResult<TPage> {
    'query-continue'?: QueryContinuation;
    query: QueryResultContent<TPage>;
}

export interface QueryContinuation {
    [k: string]: { [k: string]: string };
}

export interface QueryResultContent<TPage> {
    pages: { [k: string]: TPage };
}

export interface Page {
    pageid: number;
    title: string;
}

export interface ContentPage extends Page {
    revisions: Revision[];
}

export type ExpansionPage = ContentPage;

export interface CardPage extends ContentPage {
    fullurl: string;
}

export interface CardTypePage extends ContentPage {
    fullurl: string;
}

export interface Revision {
    '*': WikiText;
}

export type WikiText = string;

export interface ImagePage extends Page {
    imageinfo: ImageInfo[];
}

export interface ImageInfo {
    url: string;
    mime: string;
}

export interface ChangedImagePage extends ImagePage {
    categories?: Category[];
}

export interface Category {
    title: string;
}
