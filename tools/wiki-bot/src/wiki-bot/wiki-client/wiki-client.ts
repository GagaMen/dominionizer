import { AxiosInstance } from 'axios';
import {
    CargoCard,
    CardPage,
    CardTypePage,
    CargoResponse,
    ChangedImagePage,
    ContentPage,
    CargoEdition,
    ExpansionPage,
    ImagePage,
    QueryParams,
    QueryResult,
    CargoCardType,
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

    constructor(
        private axios: AxiosInstance,
        private readonly baseUrl: string,
        private readonly authenticationHeaderValue: string,
        private readonly pageLimit: number,
    ) {}

    async fetchAllEditions(): Promise<CargoEdition[]> {
        const params: QueryParams = {
            action: 'cargoquery',
            format: 'json',
            tables: 'Editions',
            fields: '_ID=Id,Expansion,Edition,Icon',
        };

        return await this.fetchData(params);
    }

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

    async fetchAllCards(): Promise<CargoCard[]> {
        const params: QueryParams = {
            action: 'cargoquery',
            format: 'json',
            tables: 'Components',
            fields: '_ID=Id,Name,Expansion,Purpose,Cost_Coin=CostCoin,Cost_Potion=CostPotion,Cost_Debt=CostDebt,Cost_Extra=CostExtra,Art,Illustrator,Edition,Types',
        };

        return await this.fetchData(params);
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

    async fetchAllCardTypes(): Promise<CargoCardType[]> {
        const params: QueryParams = {
            action: 'cargoquery',
            format: 'json',
            tables: 'Types',
            fields: '_ID=Id,Name,Scope',
        };

        return await this.fetchData(params);
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

    // TODO(refactor/rewrite-wiki-bot): migrate from axios to fetch - rest stays the same
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

    // TODO(refactor/rewrite-wiki-bot): migrate from axios to fetch - rest stays the same
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

    // TODO(refactor/rewrite-wiki-bot): migrate from axios to fetch - rest stays the same
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

    private async fetchData<T>(params: QueryParams): Promise<T[]> {
        const requestUrl = new URL(this.baseUrl);

        const dataItems = [];
        let dataItemCount;
        do {
            for (const [key, value] of Object.entries(params)) {
                requestUrl.searchParams.append(key, value);
            }

            const response = await fetch(requestUrl, {
                headers: {
                    'Dominion-Wiki-Client': this.authenticationHeaderValue,
                },
            });
            const body: CargoResponse<T> = await response.json();

            const pageDataItems = body.cargoquery.map((cargoQueryItem) => cargoQueryItem.title);
            dataItems.push(...pageDataItems);

            dataItemCount = pageDataItems.length;
        } while (dataItemCount === this.pageLimit);

        return dataItems;
    }

    // TODO(refactor/rewrite-wiki-bot): migrate from axios to fetch - rest stays the same
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

    // TODO(refactor/rewrite-wiki-bot): method should be obsolete
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

    // TODO(refactor/rewrite-wiki-bot): migrate from axios to fetch - rest stays the same
    async fetchImage(url: string): Promise<Buffer> {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return (await this.axios.get<Buffer>(url, { responseType: 'arraybuffer' })).data;
    }
}
