import { Expansion } from './../../../../src/app/models/expansion';
import { ExpansionBuilder } from './builder/expansion-builder';
import { DominionizerWikiBot } from './dominionizer-wiki-bot';
import { ExpansionPage } from './wiki-client/api-models';
import { WikiClient } from './wiki-client/wiki-client';
import * as Fs from 'fs/promises';

describe('DominionizerWikiBot', () => {
    let dominionizerWikiBot: DominionizerWikiBot;
    let wikiClientSpy: jasmine.SpyObj<WikiClient>;
    let expansionBuilderSpy: jasmine.SpyObj<ExpansionBuilder>;
    let writeFileSpy: jasmine.Spy;

    beforeEach(() => {
        wikiClientSpy = jasmine.createSpyObj<WikiClient>('WikiClient', ['fetchAllExpansionPages']);
        expansionBuilderSpy = jasmine.createSpyObj<ExpansionBuilder>('ExpansionBuilder', ['build']);
        writeFileSpy = spyOn(Fs, 'writeFile');

        dominionizerWikiBot = new DominionizerWikiBot(wikiClientSpy, expansionBuilderSpy);
    });

    describe('generateAll', () => {
        // generate expansion translations
        // generate expansion card maps
        // generate cards
        // generate card translations
        // generate card symbols
        // generate card art

        it('should generate expansions', async () => {
            const expansionPages: ExpansionPage[] = [
                { pageid: 1 } as ExpansionPage,
                { pageid: 2 } as ExpansionPage,
            ];
            const expansions: Expansion[] = [{ id: 1 } as Expansion, { id: 2 } as Expansion];
            wikiClientSpy.fetchAllExpansionPages.and.resolveTo(expansionPages);
            expansionBuilderSpy.build.withArgs(expansionPages[0]).and.returnValue([expansions[0]]);
            expansionBuilderSpy.build.withArgs(expansionPages[1]).and.returnValue([expansions[1]]);

            await dominionizerWikiBot.generateAll();

            expect(writeFileSpy).toHaveBeenCalledWith(
                'expansions.json',
                JSON.stringify(expansions),
            );
        });
    });
});
