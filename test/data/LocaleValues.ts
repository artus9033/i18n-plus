import { Locales, Translation } from "../../src";
import LocaleKeys from "./LocaleKeys";

export const LocaleValues = {
	[Locales.en]: {
		simple: {
			raw: "abcdef 1@Y^%$ ()_1",
			oneVar: ":var1",
			twoVars: ":var1:var2",
			oneVarWithRaw: "The weather is :var1 windy",
			threeVarsWithRaw: "All :var1 belong to :var2, except :var3!",
		},
		advanced: {
			conjugateOne: ":[var2, { zero: 'cats', one: 'cat', other: 'cats' }]",
			conjugateOneAndInterpolate:
				":var2 :[var2, { zero: 'cats', one: 'cat', other: 'cats' }]",
			conjugateTwo:
				":[var2, { zero: 'cats', one: 'cat', other: 'cats' }] and :[var4, { zero: 'hours', one: 'hour', other: 'hours' }]",
			conjugateTwoAndInterpolate:
				":var2 :[var2, { zero: 'cats', one: 'cat', other: 'cats' }] have been sleeping for :var4 :[var4, { zero: 'hours', one: 'hour', other: 'hours' }]",
		},
	} as Translation<typeof LocaleKeys>,
	[Locales.pl]: {
		simple: {
			raw: "abcdef 1@Y^%$ ()_1",
			oneVar: ":var1",
			twoVars: ":var1:var2",
			oneVarWithRaw: "Pogoda jest :var1 wietrzna",
			threeVarsWithRaw: "Wszystkie :var1 należą do :var2, za wyjątkiem :var3!",
		},
		advanced: {
			conjugateOne: ":[var2, { zero: 'kotów', one: 'kot', few: 'koty', other: 'kotów' }]",
			conjugateOneAndInterpolate:
				":var2 :[var2, { zero: 'kotów', one: 'kot', few: 'koty', other: 'kotów' }]",
			conjugateTwo:
				":[var2, { zero: 'kotów', one: 'kot', few: 'koty', other: 'kotów' }] i :[var4, { zero: 'godzin', one: 'godzina', few: 'godziny', other: 'godzin' }]",
			conjugateTwoAndInterpolate:
				":var2 :[var2, { zero: 'kotów', one: 'kot', few: 'koty', other: 'kotów' }] spały przez :var4 :[var4, { zero: 'godzin', one: 'godzina', few: 'godziny', other: 'godzin' }]",
		},
	} as Translation<typeof LocaleKeys>,
};

export default LocaleValues;
