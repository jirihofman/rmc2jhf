import React from 'react';
import ReactDOM from 'react-dom';
import Main from './Main';
import i18next from 'i18next';
import localization from './localization';

i18next.init({
	lng: 'cs', // zatim jen cs a bez moznosti zmeny
	resources: localization,
	interpolation: { escapeValue: false }  // React already does escaping
});

ReactDOM.render(
	<Main />,
	document.getElementById('root')
);
