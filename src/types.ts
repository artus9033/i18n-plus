type TranslationNode =
	| string
	| {
			[key: string]: string | TranslationNode;
	  };

// generic helper that enriches a translation dictionary type T by adding optional pluralization suffixes to each key
export type Translation<LocaleKeys> = LocaleKeys extends string
	? LocaleKeys
	: LocaleKeys extends TranslationNode
	? {
			[key in keyof LocaleKeys]: Translation<LocaleKeys[key]>;
	  }
	: never;
