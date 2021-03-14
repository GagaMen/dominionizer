import { AxiosInstance, AxiosResponse } from 'axios';
import { WikiClient } from './wiki-client';
import { ExpansionPage, CardPage, QueryResult, QueryParams, ImagePage, Page } from './api-models';

describe('WikiClient', () => {
    let wikiClient: WikiClient;
    let axiosSpy: jasmine.SpyObj<AxiosInstance>;
    const page: Page = {
        pageid: 1,
        title: 'Page',
    };
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

    function createPages<TPage>(pageIds: number[], page: TPage): { [k: string]: TPage } {
        return pageIds.reduce((pages: { [k: string]: TPage }, pageId: number) => {
            pages[pageId.toString()] = page;
            return pages;
        }, {});
    }

    beforeEach(() => {
        axiosSpy = jasmine.createSpyObj<AxiosInstance>('AxiosInstance', ['get']);
        axiosSpy.get.and.resolveTo({ data: [] });

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

    describe('fetchRecentChanges', () => {
        const since = '2021-03-10T00:00:00Z';
        const recentChangesParams: QueryParams = {
            action: 'query',
            format: 'json',
            generator: 'recentchanges',
            grcend: since,
            grctoponly: 'true',
            grclimit: 'max',
        };

        it('should fetch all pages correctly', async () => {
            await wikiClient.fetchRecentChanges(since);

            // eslint-disable-next-line @typescript-eslint/unbound-method
            expect(axiosSpy.get).toHaveBeenCalledWith('', { params: recentChangesParams });
        });

        it('with query result does not contain continuation data should return all pages', async () => {
            const queryResult: QueryResult<Page> = {
                query: {
                    pages: {
                        '1': page,
                        '2': page,
                    },
                },
            };
            const axiosResponse: AxiosResponse<QueryResult<Page>> = {
                data: queryResult,
            } as AxiosResponse<QueryResult<Page>>;
            axiosSpy.get.and.resolveTo(axiosResponse);
            const expected = [page, page];

            const actual = await wikiClient.fetchRecentChanges(since);

            expect(actual).toEqual(expected);
        });

        it('with query result contains continuation data should continue fetching and return all pages', async () => {
            const continueParamValue = 'continuation-data';
            const firstParams: QueryParams = { ...recentChangesParams };
            const secondParams: QueryParams = {
                ...recentChangesParams,
                grcstart: continueParamValue,
            };
            const firstQueryResult: QueryResult<Page> = {
                'query-continue': {
                    recentchanges: {
                        grcstart: continueParamValue,
                    },
                },
                query: {
                    pages: {
                        '1': page,
                    },
                },
            };
            const secondQueryResult: QueryResult<Page> = {
                query: {
                    pages: {
                        '2': page,
                    },
                },
            };
            const firstAxiosResponse: AxiosResponse<QueryResult<Page>> = {
                data: firstQueryResult,
            } as AxiosResponse<QueryResult<Page>>;
            const secondAxiosResponse: AxiosResponse<QueryResult<Page>> = {
                data: secondQueryResult,
            } as AxiosResponse<QueryResult<Page>>;
            axiosSpy.get.withArgs('', { params: firstParams }).and.resolveTo(firstAxiosResponse);
            axiosSpy.get.withArgs('', { params: secondParams }).and.resolveTo(secondAxiosResponse);
            const expected = [page, page];

            const actual = await wikiClient.fetchRecentChanges(since);

            expect(actual).toEqual(expected);
        });
    });

    describe('fetchMultipleExpansionPages', () => {
        const pageIds = [1, 2];
        const multipleExpansionPagesParams: QueryParams = {
            action: 'query',
            format: 'json',
            pageids: '1|2',
            prop: 'revisions',
            rvprop: 'content',
        };

        it('should fetch multiple expansion pages correctly', async () => {
            await wikiClient.fetchMultipleExpansionPages(pageIds);

            // eslint-disable-next-line @typescript-eslint/unbound-method
            expect(axiosSpy.get).toHaveBeenCalledWith('', { params: multipleExpansionPagesParams });
        });

        it('should return multiple expansion pages', async () => {
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

            const actual = await wikiClient.fetchMultipleExpansionPages(pageIds);

            expect(actual).toEqual(expected);
        });

        // case with pageIds array exceeds the limit per request can't happen in reality because amount
        // of existing expansions is to low
    });

    describe('fetchMultipleCardPages', () => {
        const pageIds = [1, 2];
        const multipleCardPagesParams: QueryParams = {
            action: 'query',
            format: 'json',
            pageids: '1|2',
            prop: 'info|revisions',
            inprop: 'url',
            rvprop: 'content',
        };

        it('should fetch multiple card pages correctly', async () => {
            await wikiClient.fetchMultipleCardPages(pageIds);

            // eslint-disable-next-line @typescript-eslint/unbound-method
            expect(axiosSpy.get).toHaveBeenCalledWith('', { params: multipleCardPagesParams });
        });

        it('should return all defined card pages', async () => {
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

            const actual = await wikiClient.fetchMultipleCardPages(pageIds);

            expect(actual).toEqual(expected);
        });

        it(
            'with pageIds array exceeds limit per request should request multiple times and return all ' +
                'defined card pages',
            async () => {
                const limit = 50;
                const pageIds = [...Array(limit + 1).keys()];
                const firstPageIds = pageIds.slice(0, limit);
                const secondPageIds = pageIds.slice(limit);
                const firstParams: QueryParams = {
                    ...multipleCardPagesParams,
                    pageids: firstPageIds.join('|'),
                };
                const secondParams: QueryParams = {
                    ...multipleCardPagesParams,
                    pageids: secondPageIds.join('|'),
                };
                const firstQueryResult: QueryResult<CardPage> = {
                    query: {
                        pages: createPages(firstPageIds, cardPage),
                    },
                };
                const secondQueryResult: QueryResult<CardPage> = {
                    query: {
                        pages: createPages(secondPageIds, cardPage),
                    },
                };
                const firstAxiosResponse: AxiosResponse<QueryResult<CardPage>> = {
                    data: firstQueryResult,
                } as AxiosResponse<QueryResult<CardPage>>;
                const secondAxiosResponse: AxiosResponse<QueryResult<CardPage>> = {
                    data: secondQueryResult,
                } as AxiosResponse<QueryResult<CardPage>>;
                axiosSpy.get
                    .withArgs('', { params: firstParams })
                    .and.resolveTo(firstAxiosResponse);
                axiosSpy.get
                    .withArgs('', { params: secondParams })
                    .and.resolveTo(secondAxiosResponse);
                const expected = Array.from(pageIds, () => cardPage);

                const actual = await wikiClient.fetchMultipleCardPages(pageIds);

                expect(actual).toEqual(expected);
            },
        );
    });

    describe('fetchMultipleImagePages', () => {
        const pageIds = [1, 2];
        const multipleImagePagesParams: QueryParams = {
            action: 'query',
            format: 'json',
            pageids: '1|2',
            prop: 'imageinfo',
            iiprop: 'url|mime',
        };

        it('should fetch multiple image pages correctly', async () => {
            await wikiClient.fetchMultipleImagePages(pageIds);

            // eslint-disable-next-line @typescript-eslint/unbound-method
            expect(axiosSpy.get).toHaveBeenCalledWith('', { params: multipleImagePagesParams });
        });

        it('should return all defined image pages', async () => {
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

            const actual = await wikiClient.fetchMultipleImagePages(pageIds);

            expect(actual).toEqual(expected);
        });

        it(
            'with pageIds array exceeds limit per request should request multiple times and return all ' +
                'defined image pages',
            async () => {
                const limit = 50;
                const pageIds = [...Array(limit + 1).keys()];
                const firstPageIds = pageIds.slice(0, limit);
                const secondPageIds = pageIds.slice(limit);
                const firstParams: QueryParams = {
                    ...multipleImagePagesParams,
                    pageids: firstPageIds.join('|'),
                };
                const secondParams: QueryParams = {
                    ...multipleImagePagesParams,
                    pageids: secondPageIds.join('|'),
                };
                const firstQueryResult: QueryResult<ImagePage> = {
                    query: {
                        pages: createPages(firstPageIds, imagePage),
                    },
                };
                const secondQueryResult: QueryResult<ImagePage> = {
                    query: {
                        pages: createPages(secondPageIds, imagePage),
                    },
                };
                const firstAxiosResponse: AxiosResponse<QueryResult<ImagePage>> = {
                    data: firstQueryResult,
                } as AxiosResponse<QueryResult<ImagePage>>;
                const secondAxiosResponse: AxiosResponse<QueryResult<ImagePage>> = {
                    data: secondQueryResult,
                } as AxiosResponse<QueryResult<ImagePage>>;
                axiosSpy.get
                    .withArgs('', { params: firstParams })
                    .and.resolveTo(firstAxiosResponse);
                axiosSpy.get
                    .withArgs('', { params: secondParams })
                    .and.resolveTo(secondAxiosResponse);
                const expected = Array.from(pageIds, () => imagePage);

                const actual = await wikiClient.fetchMultipleImagePages(pageIds);

                expect(actual).toEqual(expected);
            },
        );
    });
});
