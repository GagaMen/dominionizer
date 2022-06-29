import { ExpansionTranslationBuilder } from './wiki-bot/builder/expansion-translation-builder';
import { ExpansionBuilder } from './wiki-bot/builder/expansion-builder';
import axios from 'axios';
import { DominionizerWikiBot } from './wiki-bot/dominionizer-wiki-bot';
import { WikiClient } from './wiki-bot/wiki-client/wiki-client';

const axiosInstance = axios.create({});
const wikiClient = new WikiClient(axiosInstance);
const expansionBuilder = new ExpansionBuilder();
const expansionTranlationBuilder = new ExpansionTranslationBuilder();
const bot = new DominionizerWikiBot(wikiClient, expansionBuilder, expansionTranlationBuilder);
