import { CardTypeBuilder } from './wiki-bot/builder/card-type-builder';
import { ExpansionCardsMapBuilder } from './wiki-bot/builder/expansion-cards-map-builder';
import { ImageBuilder } from './wiki-bot/builder/image-builder';
import { CardTranslationBuilder } from './wiki-bot/builder/card-translation-builder';
import { CardDtoBuilder } from './wiki-bot/builder/card-dto-builder';
import { ExpansionTranslationBuilder } from './wiki-bot/builder/expansion-translation-builder';
import { ExpansionBuilder } from './wiki-bot/builder/expansion-builder';
import axios from 'axios';
import { DominionizerWikiBot } from './wiki-bot/dominionizer-wiki-bot';
import { WikiClient } from './wiki-bot/wiki-client/wiki-client';
import { CardTypeTranslationBuilder } from './wiki-bot/builder/card-type-translation-builder';
import { CardDtoValidator, CardDtosValidator } from './wiki-bot/validation/card-dto-validators';
import { CardTranslationValidator } from './wiki-bot/validation/card-translation-validators';
import { CardTypeTranslationValidator } from './wiki-bot/validation/card-type-translation-validators';
import { CardTypeValidator, CardTypesValidator } from './wiki-bot/validation/card-type-validators';
import { ExpansionTranslationValidator } from './wiki-bot/validation/expansion-translation-validators';
import {
    ExpansionValidator,
    ExpansionsValidator,
} from './wiki-bot/validation/expansion-validators';
import { ImagesValidator } from './wiki-bot/validation/image-validators';
import { Command } from 'commander';
import { exec } from 'child_process';
import { exit } from 'process';
import { SplitPileDependencyBuilder } from './wiki-bot/builder/split-pile-dependency-builder';
import { promisify } from 'util';
import { SharpFactory } from './wiki-bot/builder/sharp-factory';

interface Options {
    skipImages: boolean;
    update: boolean;
}

async function bootstrap(): Promise<void> {
    const program = new Command()
        .option(
            '-u, --update',
            'updates a previous generation with the wiki changes since then',
            false,
        )
        .option(
            '--skip-images',
            'skips generation of images to speed up the process (mainly for local testing)',
            false,
        )
        .parse();
    const options: Options = program.opts();

    const axiosInstance = axios.create({
        baseURL: 'https://wiki.dominionstrategy.com/api.php',
        timeout: 60 * 1000,
    });
    const sharpFactory = new SharpFactory();

    const currentGenerationTime = new Date();
    const targetPath = '../../src';
    const wikiClient = new WikiClient(axiosInstance);
    const expansionBuilder = new ExpansionBuilder();
    const expansionTranlationBuilder = new ExpansionTranslationBuilder();
    const expansionCardsMapBuilder = new ExpansionCardsMapBuilder();
    const cardDtoBuilder = new CardDtoBuilder();
    const splitPileDependencyBuilder = new SplitPileDependencyBuilder();
    const cardTranslationBuilder = new CardTranslationBuilder();
    const cardTypeBuilder = new CardTypeBuilder();
    const cardTypeTranslationBuilder = new CardTypeTranslationBuilder(cardTranslationBuilder);
    const imageBuilder = new ImageBuilder(wikiClient, sharpFactory);
    const expansionValidator = new ExpansionValidator();
    const expansionsValidator = new ExpansionsValidator();
    const expansionTranslationValidator = new ExpansionTranslationValidator();
    const cardTypeValidator = new CardTypeValidator();
    const cardTypesValidator = new CardTypesValidator();
    const cardTypeTranslationValidator = new CardTypeTranslationValidator();
    const cardDtoValidator = new CardDtoValidator(targetPath);
    const cardDtosValidator = new CardDtosValidator();
    const cardTranslationValidator = new CardTranslationValidator();
    const imageValidator = new ImagesValidator();

    const bot = new DominionizerWikiBot(
        currentGenerationTime,
        targetPath,
        wikiClient,
        expansionBuilder,
        expansionTranlationBuilder,
        cardTypeBuilder,
        cardTypeTranslationBuilder,
        expansionCardsMapBuilder,
        cardDtoBuilder,
        splitPileDependencyBuilder,
        cardTranslationBuilder,
        imageBuilder,
        expansionValidator,
        expansionsValidator,
        expansionTranslationValidator,
        cardTypeValidator,
        cardTypesValidator,
        cardTypeTranslationValidator,
        cardDtoValidator,
        cardDtosValidator,
        cardTranslationValidator,
        imageValidator,
    );

    let successful: boolean;

    if (options.update) {
        successful = await bot.generateUpdate(options.skipImages);
    } else {
        successful = await bot.generateAll(options.skipImages);
    }

    // this is necessary so that we can wait for the end of the child process
    // otherwise the exit function in this file will kill the process before it is finished
    const execPromise = promisify(exec);
    const { stdout, stderr } = await execPromise('npm run prettier');
    console.log(stdout);
    console.log(stderr);

    exit(successful ? 0 : 1);
}

void bootstrap();
