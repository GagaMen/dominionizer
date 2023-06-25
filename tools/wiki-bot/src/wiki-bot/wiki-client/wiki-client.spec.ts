import { AxiosInstance, AxiosResponse } from 'axios';
import { WikiClient } from './wiki-client';
import {
    ExpansionPage,
    CardPage,
    QueryResult,
    QueryParams,
    ImagePage,
    CardTypePage,
    ChangedImagePage,
    ContentPage,
} from './api-models';

describe('WikiClient', () => {
    let wikiClient: WikiClient;
    let axiosSpy: jasmine.SpyObj<AxiosInstance>;
    const expansionPage: ExpansionPage = {
        pageid: 1,
        title: 'Expansion',
        revisions: [{ '*': 'wiki text of expansion' }],
    };
    const cardPage: CardPage = {
        pageid: 1,
        title: 'Card',
        fullurl: 'link/to/card',
        revisions: [{ '*': 'wiki text of card' }],
    };
    const cardTypePage: CardTypePage = {
        pageid: 1,
        title: 'Card Type',
        fullurl: 'https://wiki.dominionstrategy.com/index.php/Knight',
        revisions: [{ '*': 'wiki text of card type' }],
    };
    const imagePage: ImagePage = {
        pageid: 1,
        title: 'Image',
        imageinfo: [
            {
                url: 'link/to/image',
                mime: 'image/jpeg',
            },
        ],
    };
    const changedImagePage: ChangedImagePage = {
        pageid: 1,
        title: 'Changed Image',
        imageinfo: [
            {
                url: 'link/to/image',
                mime: 'image/jpeg',
            },
        ],
        categories: [{ title: 'Category:Card art' }],
    };
    const contentPage: ContentPage = {
        pageid: 1,
        title: 'Content',
        revisions: [{ '*': 'wiki text of any page' }],
    };

    beforeEach(() => {
        axiosSpy = jasmine.createSpyObj<AxiosInstance>('AxiosInstance', ['get']);
        axiosSpy.get.and.resolveTo({ data: [] });

        spyOn(console, 'log').and.stub();

        wikiClient = new WikiClient(axiosSpy);
    });

    describe('fetchAllExpansionPages', () => {
        const allExpansionPagesParams: QueryParams = {
            action: 'query',
            format: 'json',
            generator: 'categorymembers',
            gcmtitle: 'Category:Sets',
            gcmtype: 'page',
            gcmlimit: 'max',
            prop: 'revisions',
            rvprop: 'content',
        };

        it('should fetch all expansion pages correctly', async () => {
            await wikiClient.fetchAllExpansionPages();

            // eslint-disable-next-line @typescript-eslint/unbound-method
            expect(axiosSpy.get).toHaveBeenCalledWith('', { params: allExpansionPagesParams });
        });

        it('should return all expansion pages', async () => {
            const queryResult: QueryResult<ExpansionPage> = {
                query: {
                    pages: {
                        '1': expansionPage,
                        '2': expansionPage,
                    },
                },
            };
            const axiosResponse: AxiosResponse<QueryResult<ExpansionPage>> = {
                data: queryResult,
            } as AxiosResponse<QueryResult<ExpansionPage>>;
            axiosSpy.get.and.resolveTo(axiosResponse);
            const expected = [expansionPage, expansionPage];

            const actual = await wikiClient.fetchAllExpansionPages();

            expect(actual).toEqual(expected);
        });

        // case with continuation data can't happen in reality because amount of existing expansions
        // is to low
    });

    describe('fetchAllCardPages', () => {
        const allCardPagesParams: QueryParams = {
            action: 'query',
            format: 'json',
            generator: 'categorymembers',
            gcmtitle: 'Category:Cards',
            gcmtype: 'page',
            gcmlimit: 'max',
            prop: 'info|revisions',
            inprop: 'url',
            rvprop: 'content',
        };

        it('should fetch all card pages correctly', async () => {
            await wikiClient.fetchAllCardPages();

            // eslint-disable-next-line @typescript-eslint/unbound-method
            expect(axiosSpy.get).toHaveBeenCalledWith('', { params: allCardPagesParams });
        });

        it('with query result does not contain continuation data should return all card pages', async () => {
            const queryResult: QueryResult<CardPage> = {
                query: {
                    pages: {
                        '1': cardPage,
                        '2': cardPage,
                    },
                },
            };
            const axiosResponse: AxiosResponse<QueryResult<CardPage>> = {
                data: queryResult,
            } as AxiosResponse<QueryResult<CardPage>>;
            axiosSpy.get.and.resolveTo(axiosResponse);
            const expected = [cardPage, cardPage];

            const actual = await wikiClient.fetchAllCardPages();

            expect(actual).toEqual(expected);
        });

        it('with query result contains continuation data should continue fetching and return all card pages', async () => {
            const continueParamValue = 'continuation-data';
            const firstParams: QueryParams = { ...allCardPagesParams };
            const secondParams: QueryParams = {
                ...allCardPagesParams,
                gcmcontinue: continueParamValue,
            };
            const firstQueryResult: QueryResult<CardPage> = {
                'query-continue': {
                    categorymembers: {
                        gcmcontinue: continueParamValue,
                    },
                },
                query: {
                    pages: {
                        '1': cardPage,
                    },
                },
            };
            const secondQueryResult: QueryResult<CardPage> = {
                query: {
                    pages: {
                        '2': cardPage,
                    },
                },
            };
            const firstAxiosResponse: AxiosResponse<QueryResult<CardPage>> = {
                data: firstQueryResult,
            } as AxiosResponse<QueryResult<CardPage>>;
            const secondAxiosResponse: AxiosResponse<QueryResult<CardPage>> = {
                data: secondQueryResult,
            } as AxiosResponse<QueryResult<CardPage>>;
            axiosSpy.get.withArgs('', { params: firstParams }).and.resolveTo(firstAxiosResponse);
            axiosSpy.get.withArgs('', { params: secondParams }).and.resolveTo(secondAxiosResponse);
            const expected = [cardPage, cardPage];

            const actual = await wikiClient.fetchAllCardPages();

            expect(actual).toEqual(expected);
        });
    });

    describe('fetchAllCardTypePages', () => {
        const allCardTypePagesParams: QueryParams = {
            action: 'query',
            format: 'json',
            generator: 'categorymembers',
            gcmtitle: 'Category:Card types',
            gcmtype: 'page',
            gcmlimit: 'max',
            prop: 'info|revisions',
            inprop: 'url',
            rvprop: 'content',
        };

        it('should fetch all card type pages correctly', async () => {
            await wikiClient.fetchAllCardTypePages();

            // eslint-disable-next-line @typescript-eslint/unbound-method
            expect(axiosSpy.get).toHaveBeenCalledWith('', { params: allCardTypePagesParams });
        });

        it('should return all card type pages', async () => {
            const queryResult: QueryResult<CardTypePage> = {
                query: {
                    pages: {
                        '1': cardTypePage,
                        '2': cardTypePage,
                    },
                },
            };
            const axiosResponse: AxiosResponse<QueryResult<CardTypePage>> = {
                data: queryResult,
            } as AxiosResponse<QueryResult<CardTypePage>>;
            axiosSpy.get.and.resolveTo(axiosResponse);
            const expected = [cardTypePage, cardTypePage];

            const actual = await wikiClient.fetchAllCardTypePages();

            expect(actual).toEqual(expected);
        });

        // case with continuation data can't happen in reality because amount of existing card types
        // is to low
    });

    describe('fetchAllCardArtPages', () => {
        const allCardArtPagesParams: QueryParams = {
            action: 'query',
            format: 'json',
            generator: 'categorymembers',
            gcmtitle: 'Category:Card art',
            gcmtype: 'file',
            gcmlimit: 'max',
            prop: 'imageinfo',
            iiprop: 'url|mime',
        };

        it('should fetch all card art pages correctly', async () => {
            await wikiClient.fetchAllCardArtPages();

            // eslint-disable-next-line @typescript-eslint/unbound-method
            expect(axiosSpy.get).toHaveBeenCalledWith('', { params: allCardArtPagesParams });
        });

        it('with query result does not contain continuation data should return all card art pages', async () => {
            const queryResult: QueryResult<ImagePage> = {
                query: {
                    pages: {
                        '1': imagePage,
                        '2': imagePage,
                    },
                },
            };
            const axiosResponse: AxiosResponse<QueryResult<ImagePage>> = {
                data: queryResult,
            } as AxiosResponse<QueryResult<ImagePage>>;
            axiosSpy.get.and.resolveTo(axiosResponse);
            const expected = [imagePage, imagePage];

            const actual = await wikiClient.fetchAllCardArtPages();

            expect(actual).toEqual(expected);
        });

        it('with query result contains continuation data should continue fetching and return all card art pages', async () => {
            const continueParamValue = 'continuation-data';
            const firstParams: QueryParams = { ...allCardArtPagesParams };
            const secondParams: QueryParams = {
                ...allCardArtPagesParams,
                gcmcontinue: continueParamValue,
            };
            const firstQueryResult: QueryResult<ImagePage> = {
                'query-continue': {
                    categorymembers: {
                        gcmcontinue: continueParamValue,
                    },
                },
                query: {
                    pages: {
                        '1': imagePage,
                    },
                },
            };
            const secondQueryResult: QueryResult<ImagePage> = {
                query: {
                    pages: {
                        '2': imagePage,
                    },
                },
            };
            const firstAxiosResponse: AxiosResponse<QueryResult<ImagePage>> = {
                data: firstQueryResult,
            } as AxiosResponse<QueryResult<ImagePage>>;
            const secondAxiosResponse: AxiosResponse<QueryResult<ImagePage>> = {
                data: secondQueryResult,
            } as AxiosResponse<QueryResult<ImagePage>>;
            axiosSpy.get.withArgs('', { params: firstParams }).and.resolveTo(firstAxiosResponse);
            axiosSpy.get.withArgs('', { params: secondParams }).and.resolveTo(secondAxiosResponse);
            const expected = [imagePage, imagePage];

            const actual = await wikiClient.fetchAllCardArtPages();

            expect(actual).toEqual(expected);
        });
    });

    describe('fetchAllCardSymbolPages', () => {
        const allCardSymbolPagesParams: QueryParams = {
            action: 'query',
            format: 'json',
            generator: 'categorymembers',
            gcmtitle: 'Category:Card symbols',
            gcmtype: 'file',
            gcmlimit: 'max',
            prop: 'imageinfo',
            iiprop: 'url|mime',
        };

        it('should fetch all card symbol pages correctly', async () => {
            await wikiClient.fetchAllCardSymbolPages();

            // eslint-disable-next-line @typescript-eslint/unbound-method
            expect(axiosSpy.get).toHaveBeenCalledWith('', { params: allCardSymbolPagesParams });
        });

        it('should return all card symbol pages', async () => {
            const queryResult: QueryResult<ImagePage> = {
                query: {
                    pages: {
                        '1': imagePage,
                        '2': imagePage,
                    },
                },
            };
            const axiosResponse: AxiosResponse<QueryResult<ImagePage>> = {
                data: queryResult,
            } as AxiosResponse<QueryResult<ImagePage>>;
            axiosSpy.get.and.resolveTo(axiosResponse);
            const expected = [imagePage, imagePage];

            const actual = await wikiClient.fetchAllCardSymbolPages();

            expect(actual).toEqual(expected);
        });

        // case with continuation data can't happen in reality because amount of existing card symbols
        // is to low
    });

    describe('fetchRecentImageChanges', () => {
        const since = new Date('2021-03-10T00:00:00Z');
        const recentImageChangesParams: QueryParams = {
            action: 'query',
            format: 'json',
            generator: 'recentchanges',
            grcend: since.toISOString(),
            grcnamespace: '6',
            grclimit: 'max',
            prop: 'imageinfo|categories',
            iiprop: 'url|mime',
            clcategories: 'Category:Card art|Category:Card symbols',
            cllimit: 'max',
        };

        it('should fetch all changed image pages correctly', async () => {
            await wikiClient.fetchRecentImageChanges(since);

            // eslint-disable-next-line @typescript-eslint/unbound-method
            expect(axiosSpy.get).toHaveBeenCalledWith('', { params: recentImageChangesParams });
        });

        it('with query result does not contain continuation data should return all changed image pages', async () => {
            const queryResult: QueryResult<ChangedImagePage> = {
                // continuation data for file revisions should be ignored
                // we are only interested in the latest revision
                'query-continue': {
                    imageinfo: {},
                },
                query: {
                    pages: {
                        '1': changedImagePage,
                        '2': changedImagePage,
                    },
                },
            };
            const axiosResponse: AxiosResponse<QueryResult<ChangedImagePage>> = {
                data: queryResult,
            } as AxiosResponse<QueryResult<ChangedImagePage>>;
            axiosSpy.get.and.resolveTo(axiosResponse);
            const expected = [changedImagePage, changedImagePage];

            const actual = await wikiClient.fetchRecentImageChanges(since);

            expect(actual).toEqual(expected);
        });

        it('with query result contains continuation data should continue fetching and return all changed image pages', async () => {
            const continueParamValue = 'continuation-data';
            const firstParams: QueryParams = { ...recentImageChangesParams };
            const secondParams: QueryParams = {
                ...recentImageChangesParams,
                grcstart: continueParamValue,
            };
            const firstQueryResult: QueryResult<ChangedImagePage> = {
                'query-continue': {
                    recentchanges: {
                        grcstart: continueParamValue,
                    },
                },
                query: {
                    pages: {
                        '1': changedImagePage,
                    },
                },
            };
            const secondQueryResult: QueryResult<ChangedImagePage> = {
                query: {
                    pages: {
                        '2': changedImagePage,
                    },
                },
            };
            const firstAxiosResponse: AxiosResponse<QueryResult<ChangedImagePage>> = {
                data: firstQueryResult,
            } as AxiosResponse<QueryResult<ChangedImagePage>>;
            const secondAxiosResponse: AxiosResponse<QueryResult<ChangedImagePage>> = {
                data: secondQueryResult,
            } as AxiosResponse<QueryResult<ChangedImagePage>>;
            axiosSpy.get.withArgs('', { params: firstParams }).and.resolveTo(firstAxiosResponse);
            axiosSpy.get.withArgs('', { params: secondParams }).and.resolveTo(secondAxiosResponse);
            const expected = [changedImagePage, changedImagePage];

            const actual = await wikiClient.fetchRecentImageChanges(since);

            expect(actual).toEqual(expected);
        });
    });

    describe('fetchSingleContentPage', () => {
        const singlePageParams: QueryParams = {
            action: 'query',
            format: 'json',
            prop: 'revisions',
            rvprop: 'content',
        };

        it('should fetch and return single content page correctly', async () => {
            const title = 'Split pile';
            const params = {
                ...singlePageParams,
                titles: 'Split pile',
            };
            const queryResult: QueryResult<ContentPage> = {
                query: {
                    pages: {
                        '3247': contentPage,
                    },
                },
            };
            const axiosResponse: AxiosResponse<QueryResult<ContentPage>> = {
                data: queryResult,
            } as AxiosResponse<QueryResult<ContentPage>>;
            axiosSpy.get.withArgs('', { params: params }).and.resolveTo(axiosResponse);

            const actual = await wikiClient.fetchSingleContentPage(title);

            expect(actual).toEqual(contentPage);
        });
    });

    describe('fetchImage', () => {
        it('should fetch image correctly', async () => {
            const url = 'https://wiki.dominionstrategy.com/images/5/5e/Adventures_icon.png';
            const image: Buffer = {} as Buffer;
            const axiosResponse: AxiosResponse<Buffer> = {
                data: image,
            } as AxiosResponse<Buffer>;
            axiosSpy.get
                .withArgs(url, { responseType: 'arraybuffer' })
                .and.resolveTo(axiosResponse);

            const actual = await wikiClient.fetchImage(url);

            expect(actual).toBe(image);
        });
    });
});
