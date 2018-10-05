import cs from '../cs';
import en from '../en';
import { keys, sortBy } from 'lodash';

let keysCs = sortBy(keys(cs.translation));
let keysEn = sortBy(keys(en.translation));

test('Localization: Comparing keys of CS vs EN resource strings. Should be the same', () => {
	expect(keysEn).toEqual(keysCs);
});
