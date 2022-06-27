import { writeFile } from 'fs/promises';
import { Expansion } from './../../../../src/app/models/expansion';
import { ExpansionBuilder } from './builder/expansion-builder';
import { WikiClient } from './wiki-client/wiki-client';

export class DominionizerWikiBot {
    constructor(private wikiClient: WikiClient, private expansionBuilder: ExpansionBuilder) {}

    async generateAll(): Promise<void> {
        const expansionPages = await this.wikiClient.fetchAllExpansionPages();

        let expansions: Expansion[] = [];
        for (const expansionPage of expansionPages) {
            expansions = expansions.concat(this.expansionBuilder.build(expansionPage));
        }

        await writeFile('expansions.json', JSON.stringify(expansions));
    }
}
