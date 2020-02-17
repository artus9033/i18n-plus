import LocaleKeys from "./LocaleKeys";
import Locales from "../src/Locales";

export const LocaleValues = {
	[Locales.en]: {
		// LocaleKeys.simple
		[LocaleKeys.simple.raw]: "abcdef 1@Y^%$ ()_1",
		[LocaleKeys.simple.oneVar]: ":var1",
		[LocaleKeys.simple.twoVars]: ":var1:var2",
		[LocaleKeys.simple.oneVarWithRaw]: "The weather is :var1 windy",
		[LocaleKeys.simple.threeVarsWithRaw]: "All :var1 belong to :var2, except :var3!"
	},
	[Locales.pl]: {}
};

export default LocaleValues;
