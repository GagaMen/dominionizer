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

export interface ExpansionPage extends Page {
    revisions: Revision[];
}

export interface CardPage extends Page {
    fullurl: string;
    revisions: Revision[];
}

export interface CardTypePage extends Page {
    revisions: Revision[];
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
