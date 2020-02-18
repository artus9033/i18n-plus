require("@babel/register");

const fromLocales = require("./src/Locales");

module.exports = {
	Locales: fromLocales.Locales,
	getLocaleFullName: fromLocales.getLocaleFullName,
	LocaleHelper: require("./src/LocaleHelper").LocaleHelper
};
