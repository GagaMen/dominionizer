import { AxiosInstance } from 'axios';
import {
    CardPage,
    CardTypePage,
    ExpansionPage,
    ImagePage,
    Page,
    QueryParams,
    QueryResult,
} from './api-models';

export class WikiClient {
    private readonly defaultParams: QueryParams = {
        action: 'query',
        format: 'json',
    };

    private readonly defaultCategoryMembersParams: QueryParams = {
        generator: 'categorymembers',
        gcmlimit: 'max',
    };

    private readonly defaultPropParamsForExpansionPages: QueryParams = {
        prop: 'revisions',
        rvprop: 'content',
    };

    private readonly defaultPropParamsForCardPages: QueryParams = {
        prop: 'info|revisions',
        inprop: 'url',
        rvprop: 'content',
    };

    private readonly defaultPropParamsForCardTypePages: QueryParams = {
        prop: 'info|revisions',
        inprop: 'url',
        rvprop: 'content',
    };

    private readonly defaultPropParamsForImagePages: QueryParams = {
        prop: 'imageinfo',
        iiprop: 'url|mime',
    };

    private readonly pageIdsLimit: number = 50;

    constructor(private axios: AxiosInstance) {}

    async fetchAllExpansionPages(): Promise<ExpansionPage[]> {
        const params: QueryParams = {
            ...this.defaultParams,
            ...this.defaultCategoryMembersParams,
            gcmtitle: 'Category:Sets',
            gcmtype: 'page',
            ...this.defaultPropParamsForExpansionPages,
        };

        return await this.fetchPages(params, 'expansion');
    }

    async fetchAllCardPages(): Promise<CardPage[]> {
        const params: QueryParams = {
            ...this.defaultParams,
            ...this.defaultCategoryMembersParams,
            gcmtitle: 'Category:Cards',
            gcmtype: 'page',
            ...this.defaultPropParamsForCardPages,
        };

        return await this.fetchPages(params, 'card');
    }

    async fetchAllCardTypePages(): Promise<CardTypePage[]> {
        const params: QueryParams = {
            ...this.defaultParams,
            ...this.defaultCategoryMembersParams,
            gcmtitle: 'Category:Card types',
            gcmtype: 'page',
            ...this.defaultPropParamsForCardTypePages,
        };

        return await this.fetchPages(params, 'card type');
    }

    async fetchAllCardArtPages(): Promise<ImagePage[]> {
        const params: QueryParams = {
            ...this.defaultParams,
            ...this.defaultCategoryMembersParams,
            gcmtitle: 'Category:Card art',
            gcmtype: 'file',
            ...this.defaultPropParamsForImagePages,
        };

        return await this.fetchPages(params, 'card art');
    }

    async fetchAllCardSymbolPages(): Promise<ImagePage[]> {
        const params: QueryParams = {
            ...this.defaultParams,
            ...this.defaultCategoryMembersParams,
            gcmtitle: 'Category:Card symbols',
            gcmtype: 'file',
            ...this.defaultPropParamsForImagePages,
        };

        return await this.fetchPages(params, 'card symbol');
    }

    async fetchRecentChanges(since: string): Promise<Page[]> {
        const params: QueryParams = {
            ...this.defaultParams,
            generator: 'recentchanges',
            grcend: since,
            grctoponly: 'true',
            // 0 = main namespace, 6 = 'File:'
            grcnamespace: '0|6',
            // 'grclimit' multiplied with 'clcategories' amount should not exceed 'cllimit'.
            // Otherwise it is theoretical possible that not all categories are fetched
            // and the current implementation can't handle continuation information other
            // than for 'generator'.
            grclimit: '100',
            prop: 'categories',
            clcategories:
                'Category:Sets|Category:Cards|Category:Card types|Category:Card art|Category:Card symbols',
            // max = 500
            cllimit: 'max',
        };

        return await this.fetchPages(params);
    }

    async fetchMultipleExpansionPages(pageIds: number[]): Promise<ExpansionPage[]> {
        const params: QueryParams = {
            ...this.defaultParams,
            ...this.defaultPropParamsForExpansionPages,
        };

        return await this.fetchMultiplePages(pageIds, params);
    }

    async fetchMultipleCardPages(pageIds: number[]): Promise<CardPage[]> {
        const params: QueryParams = {
            ...this.defaultParams,
            ...this.defaultPropParamsForCardPages,
        };

        return await this.fetchMultiplePages(pageIds, params);
    }

    async fetchMultipleImagePages(pageIds: number[]): Promise<ImagePage[]> {
        const params: QueryParams = {
            ...this.defaultParams,
            ...this.defaultPropParamsForImagePages,
        };

        return await this.fetchMultiplePages(pageIds, params);
    }

    private async fetchMultiplePages<TPage>(
        pageIds: number[],
        params: QueryParams,
    ): Promise<TPage[]> {
        let pages: TPage[] = [];

        for (let i = 0; i < pageIds.length / this.pageIdsLimit; i++) {
            const startIndex = i * this.pageIdsLimit;
            const endIndex = startIndex + this.pageIdsLimit;
            params.pageids = pageIds.slice(startIndex, endIndex).join('|');
            pages = pages.concat(await this.fetchPages(params));
        }

        return pages;
    }

    private async fetchPages<TPage>(
        params: QueryParams,
        logWithPageType?: string,
    ): Promise<TPage[]> {
        let continueQuerying = true;
        let pages: TPage[] = [];

        if (logWithPageType !== undefined) {
            console.log(`Fetching ${logWithPageType} pages...`);
        }

        while (continueQuerying) {
            const response = await this.axios.get<QueryResult<TPage> | []>('', {
                params: params,
            });
            const queryResult = response.data;

            if (Array.isArray(queryResult)) {
                continueQuerying = false;
                continue;
            }

            pages = pages.concat(Object.values(queryResult.query.pages));

            if (!queryResult['query-continue']) {
                continueQuerying = false;
                continue;
            }

            const continueParam = queryResult['query-continue'][params.generator];
            const continueParamKey = Object.keys(continueParam)[0];
            const continueParamValue = Object.values(continueParam)[0];

            params[continueParamKey] = continueParamValue;
        }

        return pages;
    }

    async fetchImage(url: string): Promise<Buffer> {
        return (await this.axios.get<Buffer>(url, { responseType: 'arraybuffer' })).data;
    }
}
