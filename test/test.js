import assert from "assert";
import _ from "lodash";

import { Locales, getLocaleFullName, LocaleHelper } from "../dist";
import LocaleValues from "./LocaleValues";
import LocaleKeys from "./LocaleKeys";

describe("src/Locales", function() {
	describe("#Locales", function() {
		it("should be an Object", function() {
			assert(_.isObject(Locales));
		});
	});

	describe("#getLocaleFullName", function() {
		it("should return 'English' for 'en'", function() {
			assert.equal("English", getLocaleFullName("en"));
		});

		it("should return 'Polski' for 'pl'", function() {
			assert.equal("Polski", getLocaleFullName("pl"));
		});
	});
});

describe("src/LocaleHelper", function() {
	describe("#_injectString", function() {
		let part1 = "abc",
			part2 = "ghi",
			text = part1 + part2,
			str = "def";

		it("should properly prepend", function() {
			assert.equal(str + text, LocaleHelper._injectString(text, 0, str));
		});

		it("should properly append", function() {
			assert.equal(text + str, LocaleHelper._injectString(text, text.length, str));
		});

		it("should properly inject", function() {
			assert.equal(part1 + str + part2, LocaleHelper._injectString(text, part1.length, str));
		});
	});

	describe("#_cutString", function() {
		let part1 = "abc",
			part2 = "def",
			part3 = "ghi",
			text = part1 + part2 + part3;

		it("should properly cut from left", function() {
			assert.equal(part2 + part3, LocaleHelper._cutString(text, 0, part1.length));
		});

		it("should properly cut from right", function() {
			assert.equal(
				part1 + part2,
				LocaleHelper._cutString(text, text.length - part3.length, text.length)
			);
		});

		it("should properly cut from inside", function() {
			assert.equal(
				part1 + part3,
				LocaleHelper._cutString(text, part1.length, part1.length + part2.length)
			);
		});
	});

	describe("#getLanguageName", function() {
		it("should return 'English' for 'en'", function() {
			assert.equal(new LocaleHelper(Locales.en, LocaleValues).getLanguageName(), "English");
		});

		it("should return 'Polski' for 'pl'", function() {
			assert.equal(new LocaleHelper(Locales.pl, LocaleValues).getLanguageName(), "Polski");
		});
	});

	describe("#setLocale", function() {
		let localeHelper = new LocaleHelper(Locales.en, LocaleValues);

		it("should return itself", function() {
			assert.equal(localeHelper.setLocale(Locales.pl), localeHelper);
		});

		it("should change the locale", function() {
			assert.equal(localeHelper.locale, Locales.pl);
		});
	});

	describe("#setFallbackLocale", function() {
		let localeHelper = new LocaleHelper(Locales.en, LocaleValues);

		it("should return itself", function() {
			assert.equal(localeHelper.setFallbackLocale(Locales.pl), localeHelper);
		});

		it("should change the fallback locale", function() {
			assert.equal(localeHelper.fallbackLocale, Locales.pl);
		});
	});

	describe("#getLocale", function() {
		let localeHelper = new LocaleHelper(Locales.en, LocaleValues);

		it("should return the proper locale", function() {
			assert.equal(localeHelper.getLocale(), Locales.en);
		});

		it("should return the proper locale after #setLocale", function() {
			localeHelper.setLocale(Locales.pl);
			assert.equal(localeHelper.getLocale(), Locales.pl);
		});
	});

	describe("#getFallbackLocale", function() {
		let localeHelper = new LocaleHelper(Locales.en, LocaleValues, Locales.pl);

		it("should return the proper locale", function() {
			assert.equal(localeHelper.getFallbackLocale(), Locales.pl);
		});

		it("should return the proper locale after #setFallbackLocale", function() {
			localeHelper.setFallbackLocale(Locales.es);
			assert.equal(localeHelper.getFallbackLocale(), Locales.es);
		});
	});

	describe("#trans", function() {
		let localeHelper = new LocaleHelper(Locales.en, LocaleValues);
		let dict = { var1: "test dictionary val", var2: 3, var3: "some rubbish", var4: 5 };

		it("should not alter a non-formatted, raw text", function() {
			assert.equal(
				LocaleValues[Locales.en][LocaleKeys.simple.raw],
				localeHelper.trans(LocaleKeys.simple.raw, dict)
			);
		});

		it("should format a single variable without raw text", function() {
			assert.equal(
				LocaleValues[Locales.en][LocaleKeys.simple.raw].replace(":var1", dict.var1),
				localeHelper.trans(LocaleKeys.simple.raw, dict)
			);
		});

		it("should format two variables without raw text", function() {
			assert.equal(
				LocaleValues[Locales.en][LocaleKeys.simple.twoVars]
					.replace(":var1", dict.var1)
					.replace(":var2", dict.var2),
				localeHelper.trans(LocaleKeys.simple.twoVars, dict)
			);
		});

		it("should format a single variable with raw text", function() {
			assert.equal(
				LocaleValues[Locales.en][LocaleKeys.simple.oneVarWithRaw].replace(
					":var1",
					dict.var1
				),
				localeHelper.trans(LocaleKeys.simple.oneVarWithRaw, dict)
			);
		});

		it("should format three variables with raw text", function() {
			assert.equal(
				LocaleValues[Locales.en][LocaleKeys.simple.threeVarsWithRaw]
					.replace(":var1", dict.var1)
					.replace(":var2", dict.var2)
					.replace(":var3", dict.var3),
				localeHelper.trans(LocaleKeys.simple.threeVarsWithRaw, dict)
			);
		});

		it("should conjugate a single variable", function() {
			assert.equal("cats", localeHelper.trans(LocaleKeys.advanced.conjugateOne, dict));
		});

		it("should conjugate a single variable & interpolate a variable, with raw text", function() {
			assert.equal(
				`${String(dict.var2)} cats`,
				localeHelper.trans(LocaleKeys.advanced.conjugateOneAndInterpolate, dict)
			);
		});

		it("should conjugate two variables", function() {
			assert.equal(
				`cats and hours`,
				localeHelper.trans(LocaleKeys.advanced.conjugateTwo, dict)
			);
		});

		it("should conjugate two variables & interpolate two variables, with raw text", function() {
			assert.equal(
				`${String(dict.var2)} cats have been sleeping for ${String(dict.var4)} hours`,
				localeHelper.trans(LocaleKeys.advanced.conjugateTwoAndInterpolate, dict)
			);
		});
	});
});
