# i18n-plus

[![GitHub issues](https://img.shields.io/github/issues/artus9033/i18n-plus?style=flat-square)](https://github.com/artus9033/i18n-plus/issues)
[![GitHub forks](https://img.shields.io/github/forks/artus9033/i18n-plus?style=flat-square)](https://github.com/artus9033/i18n-plus/network)
[![GitHub stars](https://img.shields.io/github/stars/artus9033/i18n-plus?style=flat-square)](https://github.com/artus9033/i18n-plus/stargazers)
[![GitHub license](https://img.shields.io/github/license/artus9033/i18n-plus?style=flat-square)](https://github.com/artus9033/i18n-plus/blob/master/LICENSE)

A node.js package providing i18n with variable interpolation & conjugation of words with respect to quantifiers, supporting all languages' conjugation rules.

## Features

-   Translating strings using user-defined dictionaries (key-value system)
-   Interpolation of strings with variables
-   User-defined conjugation (e.g. for pluralization, grammatical case conjugation, etc.) with respect to the quantity, passed in as a variable

## Documentation

You can read the full documentation with examples at https://artus9033.github.io/i18n-plus/

## Simple usage in a brief

The key function is `trans(key, interpolationParams = {})`

There are two specifiers available for you to use:

1. Interpolation syntax `:variableName` - simply replaces all such fields with the corresponding values supplied as Object properties in the second argument of `trans` call
2. Conjugation syntax `:[quantityVarName, { zero: 'values', one: 'value', other: 'values' } ]` -

```javascript
import Locales from "i18n-plus/Locales";
import LocaleHelper from "i18n-plus/LocaleHelper";

// these will be the keys used in the dictionary to identify texts
const localeKeys = {
	home: { welcome: "home.welcome" }
};

// this is the actual dictionary
const localeValues = {
	[Locales.en]: {
		[localeKeys.home.welcome]:
			"Welcome, :user! You have :[messages, { zero: 'messages', one: 'message', other: 'messages' }]"
	}
};

let localeHelper = new LocaleHelper(localeKeys, localeValues);

// here, you can do whatever you want with the translated & interpolated text, e.g. send it with an HTTP response, render it as a React or HTML component, log it to the console, etc.

let welcomeMessage = localeHelper.trans(localeKeys.home.welcome, {
	user: "Elon Musk",
	messages: 5
});
```

## Running tests

You can run all tests using `npm run test`

## Compiling documentation

This project uses `jsdoc` to compile documentation to HTML files to `docs` directory. You can run the process with `npm run genDocs`.
