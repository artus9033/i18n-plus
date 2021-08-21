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
-   Strongly typed with TypeScript
-   Transpilation of YAML-defined translation key dictionaries into statically-typed, importable TypeScript code
-   Supports splitting key dictionaries into multiple files with `!include()` directives

---

## Documentation

You can read the full documentation with examples [there](https://artus9033.github.io/i18n-plus/).

---

## Usage

### Basic usage in a brief

The key function provided is `trans(key, interpolationParams = {})`

There are two specifiers available for use:

1. Interpolation syntax `:variableName` - simply replaces all such fields with the corresponding values supplied as Object properties in the second argument of `trans` call
2. Conjugation syntax `:[quantityVarName, { zero: 'values', one: 'value', other: 'values' } ]` -

```javascript
import { Locales, LocaleHelper } from "i18n-plus";

// these will be the keys used in the dictionary to identify texts
const localeKeys = {
	home: { welcome: "home.welcome" },
};

// this is the actual dictionary
const localeValues = {
	[Locales.en]: {
		[localeKeys.home.welcome]:
			"Welcome, :user! You have :[messages, { zero: 'messages', one: 'message', other: 'messages' }]",
	},
};

let localeHelper = new LocaleHelper(localeKeys, localeValues);

// here, you can do whatever you want with the translated & interpolated text, e.g. send it with an HTTP response, render it as a React or HTML component, log it to the console, etc.

let welcomeMessage = localeHelper.trans(localeKeys.home.welcome, {
	user: "Elon Musk",
	messages: 5,
});
```

### Advanced usage - defining

What makes this library special is the integrated CLI that enables developers to define their translation keys in a ligthweight, clean manner, by placing them in YAML with support for additional directives.

Considering the above example:

```javascript
const localeKeys = {
	home: { welcome: "home.welcome" },
};
```

can be re-written as:

```yaml
home:
    - welcome
```

which is transpiled by the CLI to just the TS code above which can be imported right into the actual project code. To do so, the project supports two scenarios:

-   single-time compilation, e.g. in a buildscript: `i18n-plus compileKeys keys/entrypoint.yaml i18n/LocaleKeys.ts`, which would compile `keys/entrypoint.yaml` into TS and output the bundle to `i18n/LocaleKeys.ts`
-   development compilation with watching, e.g. in a development script, which does the same as the above scenario, but also watches for changes in all files referenced by the entrypoint and the entrypoint itself, recompiling & rebuilding file dependency tree on file changes. The command is the same, all that is needed is just appending the `--dev` (or short `-d`) switch: `i18n-plus compileKeys keys/entrypoint.yaml i18n/LocaleKeys.ts --dev`

You can easily access the documentation of the tool by running `i18n-plus -?`, `i18n-plus -h`, or just failing to provide a valid command syntax, which will trigger help automatically and describe the problem on the bottom, e.g. running `i18n-plus compileKeys keys/entrypoint.yaml` (please note the missing output path) will print the following:

```bash
compileI18n compileKeys <input> <output>

compile I18n yaml files to importable TS bundle

Positionals:
  input   root YAML input file path                          [string] [required]
  output  output TS bundle file path                         [string] [required]

Options:
      --version   Show version number                                  [boolean]
  -d, --dev                                           [boolean] [default: false]
  -?, -h, --help  Show help                                            [boolean]

Not enough non-option arguments: got 1, need at least 2
```

Moreover, for the sake of larger projects, keys can be split into multiple files. Consider the example:

```javascript
const localeKeys = {
	home: {
		welcome: "home.welcome",
		mainPanel: {
			text1: "home.mainPanel.text1",
			text2: "home.mainPanel.text2",
		},
	},
	login: {
		heading: "login.heading",
		buttons: {
			signIn: "login.buttons.signIn",
			register: "login.buttons.register",
		},
	},
};
```

To simplify the definition and maintain readability, the structure can be split into three files:

_entrypoint.yaml_

```yaml
home: !include(./home.yaml)
login: !include(./login.yaml)
```

_home.yaml_

```yaml
- welcome
- mainPanel:
      - text1
      - text2
```

_login.yaml_

```yaml
- heading
- buttons:
      - signIn
      - register
```

---

## Compatibility

TS files generated by the CLI with `compileKeys` are compatible with [react-i18next](https://react.i18next.com/).

---

## Unit tests

This project uses `jest` accompanied by `ts-jest` for unit testing. You can run all tests using `npm test`.

## Documentation

This project uses `jsdoc` to compile documentation to HTML files to `docs` directory. You can run the process with `npm run genDocs`. The docs will be written to `docs/i18n-plus/X.X.X`, and the only manual requirement is to put a proper entry to line $10$ in `docs/index.html`: `const VERSIONS = [..., "X.X.X"];`.

## Changelog

The changelog is available on [github](https://github.com/artus9033/i18n-plus/blob/master/CHANGELOG.md) and is auto-generated by `auto-changelog`, available as a script: `npm run changelog`.
