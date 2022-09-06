import { AxiosInstance } from 'axios';
import {
    CardPage,
    CardTypePage,
    ChangedImagePage,
    ExpansionPage,
    ImagePage,
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

    private readonly defaultPropParamsForImagePages: QueryParams = {
        prop: 'imageinfo',
        iiprop: 'url|mime',
    };

    constructor(private axios: AxiosInstance) {}

    async fetchAllExpansionPages(): Promise<ExpansionPage[]> {
        const params: QueryParams = {
            ...this.defaultParams,
            ...this.defaultCategoryMembersParams,
            gcmtitle: 'Category:Sets',
            gcmtype: 'page',
            prop: 'revisions',
            rvprop: 'content',
        };

        return await this.fetchPages(params, 'expansion');
    }

    async fetchAllCardPages(): Promise<CardPage[]> {
        const params: QueryParams = {
            ...this.defaultParams,
            ...this.defaultCategoryMembersParams,
            gcmtitle: 'Category:Cards',
            gcmtype: 'page',
            prop: 'info|revisions',
            inprop: 'url',
            rvprop: 'content',
        };

        return await this.fetchPages(params, 'card');
    }

    async fetchAllCardTypePages(): Promise<CardTypePage[]> {
        const params: QueryParams = {
            ...this.defaultParams,
            ...this.defaultCategoryMembersParams,
            gcmtitle: 'Category:Card types',
            gcmtype: 'page',
            prop: 'info|revisions',
            inprop: 'url',
            rvprop: 'content',
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

    async fetchRecentImageChanges(since: Date): Promise<ChangedImagePage[]> {
        const params: QueryParams = {
            ...this.defaultParams,
            generator: 'recentchanges',
            grcend: since.toISOString(),
            grctoponly: 'true',
            // 6 = 'File:'
            grcnamespace: '6',
            grclimit: 'max',
            prop: 'imageinfo|categories',
            iiprop: 'url|mime',
            clcategories: 'Category:Card art|Category:Card symbols',
            cllimit: 'max',
        };

        return await this.fetchPages(params, 'changed image');
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
