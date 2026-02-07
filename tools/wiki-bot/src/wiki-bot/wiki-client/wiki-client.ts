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

// TODO(refactor/rewrite-wiki-bot): remove obsolete methods at end of migration
export class WikiClient {
    private readonly defaultParams: QueryParams = {
        format: 'json',
        action: 'query',
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
            format: 'json',
            action: 'cargoquery',
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
            format: 'json',
            action: 'cargoquery',
            tables: 'Components',
            fields: '_ID=Id,_pageID=PageId,Name,Expansion,Purpose,Cost_Coin=CostCoin,Cost_Potion=CostPotion,Cost_Debt=CostDebt,Cost_Extra=CostExtra,Art,Illustrator,Edition,Types',
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
            format: 'json',
            action: 'cargoquery',
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
            const url = new URL(this.baseUrl);
            for (const [key, value] of Object.entries(params)) {
                url.searchParams.append(key, value);
            }

            const response = await fetch(url);
            const queryResult = await response.json();

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
            const continueParamValue: string = Object.values(continueParam)[0] as string;

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
        return Buffer.from(
            await (await fetch(url, { headers: { responseType: 'arraybuffer' } })).arrayBuffer(),
        );
    }
}
