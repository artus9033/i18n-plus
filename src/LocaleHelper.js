import _ from "lodash";

import Locales, { getLocaleFullName } from "./Locales";

export class LocaleHelper {
	constructor(localeKey, localeValues, fallbackLocale = Locales.en) {
		this.locale = localeKey;
		this.localeValues = localeValues;
		this.fallbackLocale = fallbackLocale;
	}

	static _injectString(str, index, newPart) {
		return str.slice(0, index) + newPart + str.slice(index);
	}

	static _cutString(str, startIndex, endIndex) {
		return str.slice(0, startIndex) + str.slice(endIndex);
	}

	trans(key, interpolationParams = {}) {
		let template = String(key);

		let templateLookup = this.localeValues[this.locale][key];
		if (templateLookup) {
			template = templateLookup;
		} else {
			templateLookup = this.localeValues[this.fallbackLocale][key];

			if (templateLookup) template = templateLookup;
		}

		Object.entries(interpolationParams).forEach(keyValuePair => {
			template = template.replace(
				new RegExp(":" + keyValuePair[0], "g"),
				_.isString(keyValuePair[1]) ? keyValuePair[1] : String(keyValuePair[1].toString())
			);
		});

		let malteseManyTest = (variable, variableString) => {
			let ending = Number(variableString.slice(-2));

			return ending >= 11 && ending <= 99;
		};

		// 'zero', 'one' & 'other' are obligatory to be specified; usually, all you will need is them
		// for Polish & Slovenian, you also want to specify 'two'
		// for Polish & Czech, you also want to specify 'few'
		// for Maltese, you also want to specify 'many'
		let pluralChoice = (variable, variableString, dictRules) => {
			// inspired by: https://developer.android.com/guide/topics/resources/string-resource.html#Plurals
			switch (variable) {
				case 0:
					return dictRules.zero;

				case 1:
					return dictRules.one;

				default:
					// I. the 'one' case
					if (variableString.endsWith(1)) {
						if (this.locale == Locales.ru) {
							if (variable.endsWith(11)) {
								return dictRules.other;
							}
						}
						return dictRules.one ? dictRules.one : dictRules.other;
					}
					// II. the 'two' case
					else if (
						(this.locale == Locales.sk || this.locale == Locales.pl) &&
						variableString.endsWith("2")
					) {
						return dictRules.two ? dictRules.two : dictRules.other;
					}
					// III. the 'few' case
					else if (
						// a) Polish: ending with 2, 3 or 4 but not 12, 13, nor 14
						(this.locale == Locales.pl &&
							(variableString.endsWith("2") ||
								variableString.endsWith("3") ||
								variableString.endsWith("4")) &&
							variable != 12 &&
							variable != 13 &&
							variable != 14) ||
						// b) Czech: ending with 2, 3 or 4
						(this.locale == Locales.cz &&
							(variableString.endsWith("2") ||
								variableString.endsWith("3") ||
								variableString.endsWith("4")))
					) {
						return dictRules.few ? dictRules.few : dictRules.other;
					}
					// IV. the 'many' case
					else if (
						this.locale == Locales.mt &&
						malteseManyTest(variable, variableString)
					) {
						return dictRules.many ? dictRules.many : dictRules.other;
					}
					// V. the 'other' case
					else {
						return dictRules.other;
					}
			}
		};

		let matches;
		let pluralChoiceRegExp = /\:\[\s*?([^,]*)\s*?\,\s*?(\{[^}]*\})\s*?\]/gm;
		while ((matches = pluralChoiceRegExp.exec(template))) {
			let [fullMatch, key, dictRules] = matches;

			dictRules = eval(`(${dictRules})`);

			let variable = interpolationParams[key];

			template = this._injectString(
				this._cutString(
					template,
					pluralChoiceRegExp.lastIndex - fullMatch.length,
					pluralChoiceRegExp.lastIndex
				),
				pluralChoiceRegExp.lastIndex - fullMatch.length,
				pluralChoice(variable, String(variable), dictRules)
			);

			pluralChoiceRegExp.lastIndex -= fullMatch.length;
		}

		return template;
	}

	getLanguageName() {
		return getLocaleFullName(this.locale);
	}

	setLocale(locale) {
		this.locale = locale;

		return this;
	}

	setFallbackLocale(locale) {
		this.fallbackLocale = locale;

		return this;
	}

	getLocale() {
		return this.locale;
	}

	getFallbackLocale() {
		return this.fallbackLocale;
	}
}

export default LocaleHelper;
