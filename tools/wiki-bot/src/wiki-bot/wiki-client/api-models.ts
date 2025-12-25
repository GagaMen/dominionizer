export type QueryParams = Record<string, string>;

export interface QueryResult<TPage> {
    'query-continue'?: QueryContinuation;
    query?: QueryResultContent<TPage>;
}

export type QueryContinuation = Record<string, Record<string, string>>;

export interface QueryResultContent<TPage> {
    pages: Record<string, TPage>;
}

export interface Page {
    pageid: number;
    title: string;
}

export interface ContentPage extends Page {
    revisions: Revision[];
}

export type ExpansionPage = ContentPage;

export interface CargoEdition {
    Id: string;
    Expansion: string;
    Edition: string;
    Icon: string;
}

export interface CargoCard {
    Id: string;
    Name: string;
    Expansion: string;
    Purpose: string;
    CostCoin: string;
    CostPotion: string;
    CostDebt: string;
    CostExtra: string;
    Art: string;
    Illustrator: string;
    Edition: string;
    Types: string;
}

export interface CargoCardType {
    Id: string;
    Name: string;
    Scope: string;
}

export interface CargoResponse<T> {
    cargoquery: {
        title: T;
    }[];
}

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
