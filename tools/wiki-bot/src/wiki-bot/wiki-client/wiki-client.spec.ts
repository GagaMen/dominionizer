import { AxiosInstance, AxiosResponse } from 'axios';
import { WikiClient } from './wiki-client';
import {
    QueryResult,
    QueryParams,
    ImagePage,
    ChangedImagePage,
    ContentPage,
    CargoEdition,
    CargoCard,
    CargoCardType,
} from './api-models';

describe('WikiClient', () => {
    let wikiClient: WikiClient;
    let axiosSpy: jasmine.SpyObj<AxiosInstance>;
    let fetchSpy: jasmine.Spy<typeof fetch>;
    const edition: CargoEdition = {
        Id: '1',
        Edition: '1',
        Expansion: 'Base',
        Icon: 'base_icon.png',
    };
    const card: CargoCard = {
        Id: '3043',
        Name: 'Ronin',
        Expansion: 'Rising Sun',
        Purpose: 'Kingdom Pile',
        CostCoin: '5',
        CostPotion: '0',
        CostDebt: '',
        CostExtra: '',
        Art: 'RoninArt.jpg',
        Illustrator: 'Marco Primo',
        Edition: '1',
        Types: 'Action-Shadow',
    };
    const cardType: CargoCardType = {
        Id: '124',
        Name: 'Boon',
        Scope: 'Landscape',
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
    let url: URL;
    let authenticationHeaderValue: string;
    let pageLimit: number;

    beforeEach(() => {
        axiosSpy = jasmine.createSpyObj<AxiosInstance>('AxiosInstance', ['get']);
        axiosSpy.get.and.resolveTo({ data: [] });
        fetchSpy = spyOn(globalThis, 'fetch').and.resolveTo({
            json: () =>
                Promise.resolve({
                    cargoquery: [],
                }),
        } as Response);

        spyOn(console, 'log').and.stub();

        const baseUrl = 'https://dominion.wiki/api.php';
        url = new URL(baseUrl);
        url.searchParams.append('format', 'json');

        authenticationHeaderValue = 'secret-dominionizer-wiki-bot-token';
        pageLimit = 2;

        wikiClient = new WikiClient(axiosSpy, baseUrl, authenticationHeaderValue, pageLimit);
    });

    describe('fetchAllEditions', () => {
        beforeEach(() => {
            url.searchParams.append('action', 'cargoquery');
        });

        it('should fetch all editions correctly', async () => {
            url.searchParams.append('tables', 'Editions');
            url.searchParams.append('fields', '_ID=Id,Expansion,Edition,Icon');

            await wikiClient.fetchAllEditions();

            expect(fetchSpy).toHaveBeenCalledWith(url, {
                headers: {
                    'Dominion-Wiki-Client': authenticationHeaderValue,
                },
            });
        });

        it('should return all editions', async () => {
            fetchSpy.and.resolveTo({
                json: () =>
                    Promise.resolve({
                        cargoquery: [{ title: edition }],
                    }),
            } as Response);
            const expected = [edition];

            const actual = await wikiClient.fetchAllEditions();

            expect(actual).toEqual(expected);
        });

        // case with paging can't happen in reality because amount of existing expansions is to low
    });

    describe('fetchAllCards', () => {
        beforeEach(() => {
            url.searchParams.append('action', 'cargoquery');
        });

        it('should fetch all cards correctly', async () => {
            url.searchParams.append('tables', 'Components');
            url.searchParams.append(
                'fields',
                '_ID=Id,Name,Expansion,Purpose,Cost_Coin=CostCoin,Cost_Potion=CostPotion,Cost_Debt=CostDebt,Cost_Extra=CostExtra,Art,Illustrator,Edition,Types',
            );

            await wikiClient.fetchAllCards();

            expect(fetchSpy).toHaveBeenCalledWith(url, {
                headers: {
                    'Dominion-Wiki-Client': authenticationHeaderValue,
                },
            });
        });

        it('with query result is not paged should return all cards', async () => {
            fetchSpy.and.resolveTo({
                json: () =>
                    Promise.resolve({
                        cargoquery: [{ title: card }],
                    }),
            } as Response);
            const expected = [card];

            const actual = await wikiClient.fetchAllCards();

            expect(actual).toEqual(expected);
        });

        it('with query result is paged return all cards', async () => {
            fetchSpy.and.returnValues(
                Promise.resolve({
                    json: () =>
                        Promise.resolve({
                            cargoquery: [{ title: card }, { title: card }],
                        }),
                } as Response),
                Promise.resolve({
                    json: () =>
                        Promise.resolve({
                            cargoquery: [{ title: card }],
                        }),
                } as Response),
            );
            const expected = [card, card, card];

            const actual = await wikiClient.fetchAllCards();

            expect(actual).toEqual(expected);
            expect(fetchSpy).toHaveBeenCalledTimes(2);
        });
    });

    describe('fetchAllCardTypes', () => {
        beforeEach(() => {
            url.searchParams.append('action', 'cargoquery');
        });

        it('should fetch all card types correctly', async () => {
            url.searchParams.append('tables', 'Types');
            url.searchParams.append('fields', '_ID=Id,Name,Scope');

            await wikiClient.fetchAllCardTypes();

            expect(fetchSpy).toHaveBeenCalledWith(url, {
                headers: {
                    'Dominion-Wiki-Client': authenticationHeaderValue,
                },
            });
        });

        it('should return all card types', async () => {
            fetchSpy.and.resolveTo({
                json: () =>
                    Promise.resolve({
                        cargoquery: [{ title: cardType }],
                    }),
            } as Response);
            const expected = [cardType];

            const actual = await wikiClient.fetchAllCardTypes();

            expect(actual).toEqual(expected);
        });

        // case with paging can't happen in reality because amount of existing card types is to low
    });

    describe('fetchAllCardArtPages', () => {
        beforeEach(() => {
            url.searchParams.append('action', 'query');
            url.searchParams.append('generator', 'categorymembers');
            url.searchParams.append('gcmlimit', 'max');
            url.searchParams.append('gcmtitle', 'Category:Card art');
            url.searchParams.append('gcmtype', 'file');
            url.searchParams.append('prop', 'imageinfo');
            url.searchParams.append('iiprop', 'url|mime');
        });

        it('should fetch all card art pages correctly', async () => {
            await wikiClient.fetchAllCardArtPages();

            expect(fetchSpy).toHaveBeenCalledWith(url);
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
            fetchSpy.and.resolveTo({ json: () => Promise.resolve(queryResult) } as Response);
            const expected = [imagePage, imagePage];

            const actual = await wikiClient.fetchAllCardArtPages();

            expect(actual).toEqual(expected);
        });

        it('with query result contains continuation data should continue fetching and return all card art pages', async () => {
            const firstUrl: URL = url;
            const secondUrl: URL = new URL(url);
            secondUrl.searchParams.append('gcmcontinue', 'continuation-data');
            const firstQueryResult: QueryResult<ImagePage> = {
                'query-continue': {
                    categorymembers: {
                        gcmcontinue: 'continuation-data',
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
            fetchSpy
                .withArgs(firstUrl)
                .and.resolveTo({ json: () => Promise.resolve(firstQueryResult) } as Response);
            fetchSpy
                .withArgs(secondUrl)
                .and.resolveTo({ json: () => Promise.resolve(secondQueryResult) } as Response);
            const expected = [imagePage, imagePage];

            const actual = await wikiClient.fetchAllCardArtPages();

            expect(actual).toEqual(expected);
        });
    });

    describe('fetchAllCardSymbolPages', () => {
        beforeEach(() => {
            url.searchParams.append('action', 'query');
            url.searchParams.append('generator', 'categorymembers');
            url.searchParams.append('gcmlimit', 'max');
            url.searchParams.append('gcmtitle', 'Category:Card symbols');
            url.searchParams.append('gcmtype', 'file');
            url.searchParams.append('prop', 'imageinfo');
            url.searchParams.append('iiprop', 'url|mime');
        });

        it('should fetch all card symbol pages correctly', async () => {
            await wikiClient.fetchAllCardSymbolPages();

            expect(fetchSpy).toHaveBeenCalledWith(url);
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
            fetchSpy.and.resolveTo({ json: () => Promise.resolve(queryResult) } as Response);
            const expected = [imagePage, imagePage];

            const actual = await wikiClient.fetchAllCardSymbolPages();

            expect(actual).toEqual(expected);
        });

        // case with continuation data can't happen in reality because amount of existing card symbols
        // is to low
    });

    describe('fetchRecentImageChanges', () => {
        const since = new Date('2021-03-10T00:00:00Z');
        beforeEach(() => {
            url.searchParams.append('action', 'query');
            url.searchParams.append('generator', 'recentchanges');
            url.searchParams.append('grcend', since.toISOString());
            url.searchParams.append('grcnamespace', '6');
            url.searchParams.append('grclimit', 'max');
            url.searchParams.append('prop', 'imageinfo|categories');
            url.searchParams.append('iiprop', 'url|mime');
            url.searchParams.append('clcategories', 'Category:Card art|Category:Card symbols');
            url.searchParams.append('cllimit', 'max');
        });

        it('should fetch all changed image pages correctly', async () => {
            await wikiClient.fetchRecentImageChanges(since);

            expect(fetchSpy).toHaveBeenCalledWith(url);
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
            fetchSpy.and.resolveTo({ json: () => Promise.resolve(queryResult) } as Response);
            const expected = [changedImagePage, changedImagePage];

            const actual = await wikiClient.fetchRecentImageChanges(since);

            expect(actual).toEqual(expected);
        });

        it('with query result contains continuation data should continue fetching and return all changed image pages', async () => {
            const firstUrl: URL = url;
            const secondUrl: URL = new URL(url);
            secondUrl.searchParams.append('grcstart', 'continuation-data');
            const firstQueryResult: QueryResult<ChangedImagePage> = {
                'query-continue': {
                    recentchanges: {
                        grcstart: 'continuation-data',
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
            fetchSpy
                .withArgs(firstUrl)
                .and.resolveTo({ json: () => Promise.resolve(firstQueryResult) } as Response);
            fetchSpy
                .withArgs(secondUrl)
                .and.resolveTo({ json: () => Promise.resolve(secondQueryResult) } as Response);
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
            const imageArrayBuffer: ArrayBuffer = new ArrayBuffer(1);
            const imageBuffer: Buffer = Buffer.from(imageArrayBuffer);
            fetchSpy.withArgs(url, { headers: { responseType: 'arraybuffer' } }).and.resolveTo({
                arrayBuffer: () => Promise.resolve(imageArrayBuffer),
            } as Response);

            const actual = await wikiClient.fetchImage(url);

            expect(actual).toEqual(imageBuffer);
        });
    });
});
