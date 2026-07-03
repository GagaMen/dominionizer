import { CardTypeBuilder } from './wiki-bot/builder/card-type-builder';
import { ImageBuilder } from './wiki-bot/builder/image-builder';
import { CardTranslationBuilder } from './wiki-bot/builder/card-translation-builder';
import { CardDtoBuilder } from './wiki-bot/builder/card-dto-builder';
import { EditionTranslationBuilder } from './wiki-bot/builder/edition-translation-builder';
import { EditionBuilder } from './wiki-bot/builder/edition-builder';
import { DominionizerWikiBot } from './wiki-bot/dominionizer-wiki-bot';
import { WikiClient } from './wiki-bot/wiki-client/wiki-client';
import { CardTypeTranslationBuilder } from './wiki-bot/builder/card-type-translation-builder';
import { CardDtoValidator } from './wiki-bot/validation/card-dto-validators';
import { CardTranslationValidator } from './wiki-bot/validation/card-translation-validators';
import { CardTypeTranslationValidator } from './wiki-bot/validation/card-type-translation-validators';
import { CardTypeValidator } from './wiki-bot/validation/card-type-validators';
import { EditionTranslationValidator } from './wiki-bot/validation/edition-translation-validators';
import { EditionValidator } from './wiki-bot/validation/edition-validators';
import { ImagesValidator } from './wiki-bot/validation/image-validators';
import { Command } from 'commander';
import { exec } from 'child_process';
import { exit } from 'process';
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

    const sharpFactory = new SharpFactory();

    const currentGenerationTime = new Date();
    const targetPath = '../../src';
    const wikiClient = new WikiClient('https://wiki.dominionstrategy.com/api.php', '', 500);
    const editionBuilder = new EditionBuilder();
    const editionTranslationBuilder = new EditionTranslationBuilder();
    const cardDtoBuilder = new CardDtoBuilder();
    const cardTranslationBuilder = new CardTranslationBuilder();
    const cardTypeBuilder = new CardTypeBuilder();
    const cardTypeTranslationBuilder = new CardTypeTranslationBuilder(cardTranslationBuilder);
    const imageBuilder = new ImageBuilder(wikiClient, sharpFactory);
    const editionValidator = new EditionValidator();
    const editionTranslationValidator = new EditionTranslationValidator();
    const cardTypeValidator = new CardTypeValidator();
    const cardTypeTranslationValidator = new CardTypeTranslationValidator();
    const cardDtoValidator = new CardDtoValidator(targetPath);
    const cardTranslationValidator = new CardTranslationValidator();
    const imageValidator = new ImagesValidator();

    const bot = new DominionizerWikiBot(
        currentGenerationTime,
        targetPath,
        wikiClient,
        editionBuilder,
        editionTranslationBuilder,
        cardTypeBuilder,
        cardTypeTranslationBuilder,
        cardDtoBuilder,
        cardTranslationBuilder,
        imageBuilder,
        editionValidator,
        editionTranslationValidator,
        cardTypeValidator,
        cardTypeTranslationValidator,
        cardDtoValidator,
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
