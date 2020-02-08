import { DominiontabsConverter } from './dominiontabs-converter.mjs';

const dominiontabsConverter = new DominiontabsConverter(
  'https://raw.githubusercontent.com/sumpfork/dominiontabs/master/card_db_src/cards_db.json',
  './output'
);

dominiontabsConverter.run();
console.log('Card data successfully converted!');
