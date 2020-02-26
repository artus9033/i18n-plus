import _ from "lodash";

import Locales, { getLocaleFullName } from "./Locales";

/**
 * Key class used for rendering translated, conjugated & interpolated strings; see trans
 */
export class LocaleHelper {
	/**
	 * @constructor
	 * @param {string} localeKey locale codename taken from {@link Locales}, specifies as the default (current) language to use for loading translation templates
	 * @param {Object} localeValues object with all translation keys values as names for properties, the values of which are templates to be formatted
	 * @param {string} [fallbackLocale = Locales.en] locale codename taken from {@link Locales}, used as a fallback locale if a translation template is not found for the current locale set; use {@link LocaleHelper#setFallbackLocale} to change this at runtime
	 */
	constructor(localeKey, localeValues, fallbackLocale = Locales.en) {
		/**
		 * Current locale used for choosing translations
		 * @type {string}
		 */
		this.locale = localeKey;

		/**
		 * Dictionary with templates of translations as values of properties with keys as names, grouped as values of properties with locale codenames as names
		 * @type {Object}
		 */
		this.localeValues = localeValues;

		/**
		 * Current fallback locale used for choosing translations when they are not defined for the current locale set
		 * @type {string}
		 */
		this.fallbackLocale = fallbackLocale;
	}

	/**
	 * Inserts newPart inside str at a given index
	 * @param {string} str the string to insert another string into
	 * @param {number} index the index at which to insert the other string
	 * @param {string} newPart the other string to be inserted
	 */
	static _injectString(str, index, newPart) {
		return str.slice(0, index) + newPart + str.slice(index);
	}

	/**
	 * Deletes a range from startIndex to endIndex from str
	 * @param {string} str the string to delete a range from
	 * @param {number} startIndex the index from which to start deleting characters
	 * @param {number} endIndex the index at which to stop deleting characters
	 */
	static _cutString(str, startIndex, endIndex) {
		return str.slice(0, startIndex) + str.slice(endIndex);
	}

	/**
	 * Function which renders an interpolated & conjugated translation in the current language (see {@link LocaleHelper#locale} and {@link LocaleHelper#setLocale}).
	 * If a translation template is not found for the given key in {@link LocaleHelper#localeValues} with the current locale set, it is looked up under the {@link LocaleHelper#fallbackLocale} locale
	 * @param {string} key translation key to be used for looking up strings in {@link LocaleHelper#localeValues}
	 * @param {Object} [interpolationParams = {}] dictionary with all variables used for interpolating translations
	 * @returns {string} the interpolated string
	 */
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
				_.isString(keyValuePair[1])
					? keyValuePair[1]
					: String(
							keyValuePair[1].toString ? keyValuePair[1].toString() : keyValuePair[1]
					  )
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

			template = LocaleHelper._injectString(
				LocaleHelper._cutString(
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

	/**
	 * Returns the full name of the current locale (@see LocaleHelper#locale )
	 * @returns {string} full name of the current locale
	 */
	getLanguageName() {
		return getLocaleFullName(this.locale);
	}

	/**
	 * Sets a new locale for translations
	 * @param {string} locale new locale codename, taken from {@link Locales}
	 * @returns {LocaleHelper} this instance of {@link LocaleHelper}, useful for chaining
	 */
	setLocale(locale) {
		this.locale = locale;

		return this;
	}

	/**
	 * Sets a new fallback locale for translations
	 * @param {string} locale new fallback locale codename, taken from {@link Locales}
	 * @returns {LocaleHelper} this instance of {@link LocaleHelper}, useful for chaining
	 */
	setFallbackLocale(locale) {
		this.fallbackLocale = locale;

		return this;
	}

	/**
	 * Returns the current locale codename
	 * @see getLocaleFullName
	 * @see LocaleHelper#locale
	 * @returns {string} current locale codename
	 */
	getLocale() {
		return this.locale;
	}

	/**
	 * Returns the current fallback locale codename
	 * @see getLocaleFullName
	 * @see LocaleHelper#fallbackLocale
	 * @returns {string} current fallback locale codename
	 */
	getFallbackLocale() {
		return this.fallbackLocale;
	}
}

export default LocaleHelper;
