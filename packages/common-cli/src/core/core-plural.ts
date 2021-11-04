
import pluralize from 'pluralize';

pluralize.addIrregularRule('middleware', 'middleware');
pluralize.addIrregularRule('partOfSpeech', 'partsOfSpeech');

export const pluralizer = pluralize;
