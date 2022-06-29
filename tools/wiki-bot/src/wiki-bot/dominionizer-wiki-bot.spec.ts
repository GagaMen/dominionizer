import { ExpansionTranslationBuilder } from './builder/expansion-translation-builder';
import { Expansion, ExpansionTranslation } from './../../../../src/app/models/expansion';
import { ExpansionBuilder } from './builder/expansion-builder';
import { DominionizerWikiBot } from './dominionizer-wiki-bot';
import { ExpansionPage } from './wiki-client/api-models';
import { WikiClient } from './wiki-client/wiki-client';
import * as Fs from 'fs/promises';

fdescribe('DominionizerWikiBot', () => {
    let dominionizerWikiBot: DominionizerWikiBot;
    let wikiClientSpy: jasmine.SpyObj<WikiClient>;
    let expansionBuilderSpy: jasmine.SpyObj<ExpansionBuilder>;
    let expansionTranslationBuilderSpy: jasmine.SpyObj<ExpansionTranslationBuilder>;
    let writeFileSpy: jasmine.Spy;

    beforeEach(() => {
        wikiClientSpy = jasmine.createSpyObj<WikiClient>('WikiClient', ['fetchAllExpansionPages']);
        expansionBuilderSpy = jasmine.createSpyObj<ExpansionBuilder>('ExpansionBuilder', ['build']);

        expansionTranslationBuilderSpy = jasmine.createSpyObj<ExpansionTranslationBuilder>(
            'ExpansionTranslationBuilder',
            ['build'],
        );
        expansionTranslationBuilderSpy.build.and.returnValue(new Map());

        writeFileSpy = spyOn(Fs, 'writeFile');

        dominionizerWikiBot = new DominionizerWikiBot(
            wikiClientSpy,
            expansionBuilderSpy,
            expansionTranslationBuilderSpy,
        );
    });

    describe('generateAll', () => {
        // generate expansion card maps
        // generate cards
        // generate card translations
        // generate card symbols
        // generate card art
        // success logging for each step
        // error handling for builders (log and continue)

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

        it('should generate expansion translations', async () => {
            const expansionPages: ExpansionPage[] = [
                { pageid: 1 } as ExpansionPage,
                { pageid: 2 } as ExpansionPage,
            ];
            const firstExpansionTranslations: Map<string, ExpansionTranslation> = new Map([
                ['German', { id: 1, name: 'german title' }],
                ['French', { id: 1, name: 'french title' }],
            ]);
            const secondExpansionTranslations: Map<string, ExpansionTranslation> = new Map([
                ['German', { id: 2, name: 'german title' }],
                ['French', { id: 2, name: 'french title' }],
            ]);
            const germanTranslations: ExpansionTranslation[] = [
                { id: 1, name: 'german title' },
                { id: 2, name: 'german title' },
            ];
            const frenchTranslations: ExpansionTranslation[] = [
                { id: 1, name: 'french title' },
                { id: 2, name: 'french title' },
            ];
            wikiClientSpy.fetchAllExpansionPages.and.resolveTo(expansionPages);
            expansionTranslationBuilderSpy.build
                .withArgs(expansionPages[0])
                .and.returnValue(firstExpansionTranslations);
            expansionTranslationBuilderSpy.build
                .withArgs(expansionPages[1])
                .and.returnValue(secondExpansionTranslations);

            await dominionizerWikiBot.generateAll();

            expect(writeFileSpy).toHaveBeenCalledWith(
                'expansions.german.json',
                JSON.stringify(germanTranslations),
            );
            expect(writeFileSpy).toHaveBeenCalledWith(
                'expansions.french.json',
                JSON.stringify(frenchTranslations),
            );
        });
    });
});
