import { AxiosInstance } from 'axios';
import {
    CardPage,
    CardTypePage,
    ChangedImagePage,
    ContentPage,
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

            if (Array.isArray(queryResult) || queryResult.query === undefined) {
                continueQuerying = false;
                continue;
            }

            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
            pages = pages.concat(Object.values<TPage>(queryResult.query.pages));

            const continueParam = queryResult['query-continue']?.[params['generator']];
            if (continueParam === undefined) {
                continueQuerying = false;
                continue;
            }

            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
            const continueParamKey: string = Object.keys(continueParam)[0];
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
            const continueParamValue: string = Object.values(continueParam)[0];

            params[continueParamKey] = continueParamValue;
        }

        return pages;
    }

    async fetchSingleContentPage(title: string): Promise<ContentPage | undefined> {
        const params: QueryParams = {
            ...this.defaultParams,
            prop: 'revisions',
            rvprop: 'content',
            titles: title,
        };

        const response = await this.axios.get<QueryResult<ContentPage>>('', {
            params: params,
        });

        if (response.data.query === undefined) {
            return undefined;
        }

        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        return Object.values<ContentPage>(response.data.query.pages)[0];
    }

    async fetchImage(url: string): Promise<Buffer> {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return (await this.axios.get<Buffer>(url, { responseType: 'arraybuffer' })).data;
    }
}
