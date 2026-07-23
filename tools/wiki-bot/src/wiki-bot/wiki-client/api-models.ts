export type QueryParams = Record<string, string>;

export interface QueryResult<TPage> {
    continue?: QueryContinuation;
    query?: QueryResultContent<TPage>;
}

export type QueryContinuation = Record<string, string>;

export interface QueryResultContent<TPage> {
    pages: Record<string, TPage>;
}

export interface Page {
    pageid: number;
    title: string;
}

export type ExpansionPage = Page & {
    revisions: Revision[];
};

export interface CargoEdition {
    Id: string;
    PageId: string;
    Expansion: string;
    Edition: string;
    Icon: string;
}

export interface CargoCard {
    Id: string;
    PageId: string;
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

export interface CardPage extends Page {
    fullurl: string;
    revisions: Revision[];
}

export interface CardTypePage extends Page {
    fullurl: string;
    revisions: Revision[];
}

export interface Revision {
    slots: {
        main: {
            '*': WikiText;
        };
    };
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
