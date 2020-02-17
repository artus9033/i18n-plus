import LocaleKeys from "./LocaleKeys";
import Locales from "../src/Locales";

export const LocaleValues = {
	[Locales.en]: {
		// LocaleKeys.simple
		[LocaleKeys.simple.raw]: "abcdef 1@Y^%$ ()_1",
		[LocaleKeys.simple.oneVar]: ":var1",
		[LocaleKeys.simple.twoVars]: ":var1:var2",
		[LocaleKeys.simple.oneVarWithRaw]: "The weather is :var1 windy",
		[LocaleKeys.simple.threeVarsWithRaw]: "All :var1 belong to :var2, except :var3!",
		// LocaleKeys.advanced
		[LocaleKeys.advanced.conjugateOne]: ":[var2, { zero: 'cats', one: 'cat', other: 'cats' }]",
		[LocaleKeys.advanced.conjugateOneAndInterpolate]:
			":var2 :[var2, { zero: 'cats', one: 'cat', other: 'cats' }]",
		[LocaleKeys.advanced.conjugateTwo]:
			":[var2, { zero: 'cats', one: 'cat', other: 'cats' }] and :[var4, { zero: 'hours', one: 'hour', other: 'hours' }]",
		[LocaleKeys.advanced.conjugateTwoAndInterpolate]:
			":var2 :[var2, { zero: 'cats', one: 'cat', other: 'cats' }] have been sleeping for :var4 :[var4, { zero: 'hours', one: 'hour', other: 'hours' }]"
	},
	[Locales.pl]: {
		// LocaleKeys.simple
		[LocaleKeys.simple.raw]: "abcdef 1@Y^%$ ()_1",
		[LocaleKeys.simple.oneVar]: ":var1",
		[LocaleKeys.simple.twoVars]: ":var1:var2",
		[LocaleKeys.simple.oneVarWithRaw]: "Pogoda jest :var1 wietrzna",
		[LocaleKeys.simple.threeVarsWithRaw]:
			"Wszystkie :var1 należą do :var2, za wyjątkiem :var3!",
		// LocaleKeys.advanced
		[LocaleKeys.advanced.conjugateOne]:
			":[var2, { zero: 'kotów', one: 'kot', few: 'koty', other: 'kotów' }]",
		[LocaleKeys.advanced.conjugateOneAndInterpolate]:
			":var2 :[var2, { zero: 'kotów', one: 'kot', few: 'koty', other: 'kotów' }]",
		[LocaleKeys.advanced.conjugateTwo]:
			":[var2, { zero: 'kotów', one: 'kot', few: 'koty', other: 'kotów' }] i :[var4, { zero: 'godzin', one: 'godzina', few: 'godziny', other: 'godzin' }]",
		[LocaleKeys.advanced.conjugateTwoAndInterpolate]:
			":var2 :[var2, { zero: 'kotów', one: 'kot', few: 'koty', other: 'kotów' }] spały przez :var4 :[var4, { zero: 'godzin', one: 'godzina', few: 'godziny', other: 'godzin' }]"
	}
};

export default LocaleValues;
