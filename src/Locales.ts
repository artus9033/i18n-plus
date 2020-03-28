/**
 * list of all locale codenames
 * @type {object}
 */
export const Locales = {
	af: "af",
	ak: "ak",
	sq: "sq",
	am: "am",
	ar: "ar",
	hy: "hy",
	as: "as",
	asa: "asa",
	az: "az",
	bm: "bm",
	eu: "eu",
	be: "be",
	bem: "bem",
	bez: "bez",
	bn: "bn",
	bs: "bs",
	bg: "bg",
	my: "my",
	ca: "ca",
	tzm: "tzm",
	chr: "chr",
	cgg: "cgg",
	zh: "zh",
	kw: "kw",
	hr: "hr",
	cs: "cs",
	da: "da",
	nl: "nl",
	ebu: "ebu",
	en: "en",
	eo: "eo",
	et: "et",
	ee: "ee",
	fo: "fo",
	fil: "fil",
	fi: "fi",
	fr: "fr",
	ff: "ff",
	gl: "gl",
	lg: "lg",
	ka: "ka",
	de: "de",
	el: "el",
	gu: "gu",
	guz: "guz",
	ha: "ha",
	haw: "haw",
	he: "he",
	hi: "hi",
	hu: "hu",
	is: "is",
	ig: "ig",
	id: "id",
	ga: "ga",
	it: "it",
	ja: "ja",
	kea: "kea",
	kab: "kab",
	kl: "kl",
	kln: "kln",
	kam: "kam",
	kn: "kn",
	kk: "kk",
	km: "km",
	ki: "ki",
	rw: "rw",
	kok: "kok",
	ko: "ko",
	khq: "khq",
	ses: "ses",
	lag: "lag",
	lv: "lv",
	lt: "lt",
	luo: "luo",
	luy: "luy",
	mk: "mk",
	jmc: "jmc",
	kde: "kde",
	mg: "mg",
	ms: "ms",
	ml: "ml",
	mt: "mt",
	gv: "gv",
	mr: "mr",
	mas: "mas",
	mer: "mer",
	mfe: "mfe",
	naq: "naq",
	ne: "ne",
	nd: "nd",
	nb: "nb",
	nn: "nn",
	nyn: "nyn",
	or: "or",
	om: "om",
	ps: "ps",
	fa: "fa",
	pl: "pl",
	pt: "pt",
	pa: "pa",
	ro: "ro",
	rm: "rm",
	rof: "rof",
	ru: "ru",
	rwk: "rwk",
	saq: "saq",
	sg: "sg",
	seh: "seh",
	sr: "sr",
	sn: "sn",
	ii: "ii",
	si: "si",
	sk: "sk",
	sl: "sl",
	xog: "xog",
	so: "so",
	es: "es",
	sw: "sw",
	sv: "sv",
	gsw: "gsw",
	shi: "shi",
	dav: "dav",
	ta: "ta",
	te: "te",
	teo: "teo",
	th: "th",
	bo: "bo",
	ti: "ti",
	to: "to",
	tr: "tr",
	uk: "uk",
	ur: "ur",
	uz: "uz",
	vi: "vi",
	vun: "vun",
	cy: "cy",
	yo: "yo",
	zu: "zu"
};

/**
 * Return the full name of a given locale codename
 * @param {string} locale locale codename to return the full name of, taken from Locales
 */
export function getLocaleFullName(locale) {
	switch (locale) {
		case "af":
			return "Afrikaans";
		case "ak":
			return "Akan";
		case "sq":
			return "Albanian";
		case "am":
			return "Amharic";
		case "ar":
			return "Arabic";
		case "hy":
			return "Armenian";
		case "as":
			return "Assamese";
		case "asa":
			return "Asu";
		case "az":
			return "Azerbaijani";
		case "bm":
			return "Bambara";
		case "eu":
			return "Basque";
		case "be":
			return "Belarusian";
		case "bem":
			return "Bemba";
		case "bez":
			return "Bena";
		case "bn":
			return "Bengali";
		case "bs":
			return "Bosnian";
		case "bg":
			return "Bulgarian";
		case "my":
			return "Burmese";
		case "ca":
			return "Catalan";
		case "tzm":
			return "Central Morocco Tamazight";
		case "chr":
			return "Cherokee";
		case "cgg":
			return "Chiga";
		case "zh":
			return "Chinese";
		case "kw":
			return "Cornish";
		case "hr":
			return "Croatian";
		case "cs":
			return "Czech";
		case "da":
			return "Danish";
		case "nl":
			return "Dutch";
		case "ebu":
			return "Embu";
		case "en":
			return "English";
		case "eo":
			return "Esperanto";
		case "et":
			return "Estonian";
		case "ee":
			return "Ewe";
		case "fo":
			return "Faroese";
		case "fil":
			return "Filipino";
		case "fi":
			return "Finnish";
		case "fr":
			return "French";
		case "ff":
			return "Fulah";
		case "gl":
			return "Galician";
		case "lg":
			return "Ganda";
		case "ka":
			return "Georgian";
		case "de":
			return "German";
		case "el":
			return "Greek";
		case "gu":
			return "Gujarati";
		case "guz":
			return "Gusii";
		case "ha":
			return "Hausa";
		case "haw":
			return "Hawaiian";
		case "he":
			return "Hebrew";
		case "hi":
			return "Hindi";
		case "hu":
			return "Hungarian";
		case "is":
			return "Icelandic";
		case "ig":
			return "Igbo";
		case "id":
			return "Indonesian";
		case "ga":
			return "Irish";
		case "it":
			return "Italian";
		case "ja":
			return "Japanese";
		case "kea":
			return "Kabuverdianu";
		case "kab":
			return "Kabyle";
		case "kl":
			return "Kalaallisut";
		case "kln":
			return "Kalenjin";
		case "kam":
			return "Kamba";
		case "kn":
			return "Kannada";
		case "kk":
			return "Kazakh";
		case "km":
			return "Khmer";
		case "ki":
			return "Kikuyu";
		case "rw":
			return "Kinyarwanda";
		case "kok":
			return "Konkani";
		case "ko":
			return "Korean";
		case "khq":
			return "Koyra Chiini";
		case "ses":
			return "Koyraboro Senni";
		case "lag":
			return "Langi";
		case "lv":
			return "Latvian";
		case "lt":
			return "Lithuanian";
		case "luo":
			return "Luo";
		case "luy":
			return "Luyia";
		case "mk":
			return "Macedonian";
		case "jmc":
			return "Machame";
		case "kde":
			return "Makonde";
		case "mg":
			return "Malagasy";
		case "ms":
			return "Malay";
		case "ml":
			return "Malayalam";
		case "mt":
			return "Maltese";
		case "gv":
			return "Manx";
		case "mr":
			return "Marathi";
		case "mas":
			return "Masai";
		case "mer":
			return "Meru";
		case "mfe":
			return "Morisyen";
		case "naq":
			return "Nama";
		case "ne":
			return "Nepali";
		case "nd":
			return "North Ndebele";
		case "nb":
			return "Norwegian Bokmål";
		case "nn":
			return "Norwegian Nynorsk";
		case "nyn":
			return "Nyankole";
		case "or":
			return "Oriya";
		case "om":
			return "Oromo";
		case "ps":
			return "Pashto";
		case "fa":
			return "Persian";
		case "pl":
			return "Polski";
		case "pt":
			return "Portuguese";
		case "pa":
			return "Punjabi";
		case "ro":
			return "Romanian";
		case "rm":
			return "Romansh";
		case "rof":
			return "Rombo";
		case "ru":
			return "Russian";
		case "rwk":
			return "Rwa";
		case "saq":
			return "Samburu";
		case "sg":
			return "Sango";
		case "seh":
			return "Sena";
		case "sr":
			return "Serbian";
		case "sn":
			return "Shona";
		case "ii":
			return "Sichuan Yi";
		case "si":
			return "Sinhala";
		case "sk":
			return "Slovak";
		case "sl":
			return "Slovenian";
		case "xog":
			return "Soga";
		case "so":
			return "Somali";
		case "es":
			return "Spanish";
		case "sw":
			return "Swahili";
		case "sv":
			return "Swedish";
		case "gsw":
			return "Swiss German";
		case "shi":
			return "Tachelhit";
		case "dav":
			return "Taita";
		case "ta":
			return "Tamil";
		case "te":
			return "Telugu";
		case "teo":
			return "Teso";
		case "th":
			return "Thai";
		case "bo":
			return "Tibetan";
		case "ti":
			return "Tigrinya";
		case "to":
			return "Tonga";
		case "tr":
			return "Turkish";
		case "uk":
			return "Ukrainian";
		case "ur":
			return "Urdu";
		case "uz":
			return "Uzbek";
		case "vi":
			return "Vietnamese";
		case "vun":
			return "Vunjo";
		case "cy":
			return "Welsh";
		case "yo":
			return "Yoruba";
		case "zu":
			return "Zulu";
		default:
			return "???";
	}
}

export default Locales;