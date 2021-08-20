import { LocaleHelper, Locales } from "../src";
import LocaleKeys from "./data/LocaleKeys";
import LocaleValues from "./data/LocaleValues";

describe("src/LocaleHelper", function () {
	describe("#_injectString", function () {
		let part1 = "abc",
			part2 = "ghi",
			text = part1 + part2,
			str = "def";

		test("should properly prepend", function () {
			expect(LocaleHelper._injectString(text, 0, str)).toStrictEqual(str + text);
		});

		test("should properly append", function () {
			expect(LocaleHelper._injectString(text, text.length, str)).toStrictEqual(text + str);
		});

		test("should properly inject", function () {
			expect(LocaleHelper._injectString(text, part1.length, str)).toStrictEqual(
				part1 + str + part2
			);
		});
	});

	describe("#_cutString", function () {
		let part1 = "abc",
			part2 = "def",
			part3 = "ghi",
			text = part1 + part2 + part3;

		test("should properly cut from left", function () {
			expect(LocaleHelper._cutString(text, 0, part1.length)).toStrictEqual(part2 + part3);
		});

		test("should properly cut from right", function () {
			expect(
				LocaleHelper._cutString(text, text.length - part3.length, text.length)
			).toStrictEqual(part1 + part2);
		});

		test("should properly cut from inside", function () {
			expect(
				LocaleHelper._cutString(text, part1.length, part1.length + part2.length)
			).toStrictEqual(part1 + part3);
		});
	});

	describe("#getLanguageName", function () {
		test("should return 'English' for 'en'", function () {
			expect(new LocaleHelper(Locales.en, LocaleValues).getLanguageName()).toStrictEqual(
				"English"
			);
		});

		test("should return 'Polski' for 'pl'", function () {
			expect(new LocaleHelper(Locales.pl, LocaleValues).getLanguageName()).toStrictEqual(
				"Polski"
			);
		});
	});

	describe("#setLocale", function () {
		let localeHelper = new LocaleHelper(Locales.en, LocaleValues);

		test("should return itself", function () {
			expect(localeHelper).toStrictEqual(localeHelper.setLocale(Locales.pl));
		});

		test("should change the locale", function () {
			expect(localeHelper["locale"]).toStrictEqual(Locales.pl); // for the sake of this test, we need to access the private field 'locale'
		});
	});

	describe("#setFallbackLocale", function () {
		let localeHelper = new LocaleHelper(Locales.en, LocaleValues);

		test("should return itself", function () {
			expect(localeHelper).toStrictEqual(localeHelper.setFallbackLocale(Locales.pl));
		});

		test("should change the fallback locale", function () {
			expect(localeHelper["fallbackLocale"]).toStrictEqual(Locales.pl); // for the sake of this test, we need to access the private field 'fallbackLocale'
		});
	});

	describe("#getLocale", function () {
		let localeHelper = new LocaleHelper(Locales.en, LocaleValues);

		test("should return the proper locale", function () {
			expect(Locales.en).toStrictEqual(localeHelper.getLocale());
		});

		test("should return the proper locale after #setLocale", function () {
			localeHelper.setLocale(Locales.pl);
			expect(Locales.pl).toStrictEqual(localeHelper.getLocale());
		});
	});

	describe("#getFallbackLocale", function () {
		let localeHelper = new LocaleHelper(Locales.en, LocaleValues, Locales.pl);

		test("should return the proper locale", function () {
			expect(Locales.pl).toStrictEqual(localeHelper.getFallbackLocale());
		});

		test("should return the proper locale after #setFallbackLocale", function () {
			localeHelper.setFallbackLocale(Locales.es);
			expect(Locales.es).toStrictEqual(localeHelper.getFallbackLocale());
		});
	});

	describe("#trans", function () {
		let localeHelper = new LocaleHelper(Locales.en, LocaleValues);
		let dict = { var1: "test dictionary val", var2: 3, var3: "some rubbish", var4: 5 };

		test("should not alter a non-formatted, raw text", function () {
			expect(localeHelper.trans(LocaleKeys.simple.raw, dict)).toStrictEqual(
				LocaleValues[Locales.en][LocaleKeys.simple.raw]
			);
		});

		test("should format a single variable without raw text", function () {
			expect(localeHelper.trans(LocaleKeys.simple.raw, dict)).toStrictEqual(
				LocaleValues[Locales.en][LocaleKeys.simple.raw].replace(":var1", dict.var1)
			);
		});

		test("should format two variables without raw text", function () {
			expect(localeHelper.trans(LocaleKeys.simple.twoVars, dict)).toStrictEqual(
				LocaleValues[Locales.en][LocaleKeys.simple.twoVars]
					.replace(":var1", dict.var1)
					.replace(":var2", String(dict.var2))
			);
		});

		test("should format a single variable with raw text", function () {
			expect(localeHelper.trans(LocaleKeys.simple.oneVarWithRaw, dict)).toStrictEqual(
				LocaleValues[Locales.en][LocaleKeys.simple.oneVarWithRaw].replace(
					":var1",
					dict.var1
				)
			);
		});

		test("should format three variables with raw text", function () {
			expect(localeHelper.trans(LocaleKeys.simple.threeVarsWithRaw, dict)).toStrictEqual(
				LocaleValues[Locales.en][LocaleKeys.simple.threeVarsWithRaw]
					.replace(":var1", dict.var1)
					.replace(":var2", String(dict.var2))
					.replace(":var3", dict.var3)
			);
		});

		test("should conjugate a single variable", function () {
			expect(localeHelper.trans(LocaleKeys.advanced.conjugateOne, dict)).toStrictEqual(
				"cats"
			);
		});

		test("should conjugate a single variable & interpolate a variable, with raw text", function () {
			expect(
				localeHelper.trans(LocaleKeys.advanced.conjugateOneAndInterpolate, dict)
			).toStrictEqual(`${String(dict.var2)} cats`);
		});

		test("should conjugate two variables", function () {
			expect(localeHelper.trans(LocaleKeys.advanced.conjugateTwo, dict)).toStrictEqual(
				`cats and hours`
			);
		});

		test("should conjugate two variables & interpolate two variables, with raw text", function () {
			expect(
				localeHelper.trans(LocaleKeys.advanced.conjugateTwoAndInterpolate, dict)
			).toStrictEqual(
				`${String(dict.var2)} cats have been sleeping for ${String(dict.var4)} hours`
			);
		});
	});
});
