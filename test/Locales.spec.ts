import _ from "lodash";

import { Locales, getLocaleFullName } from "../src";

describe("src/Locales", function () {
	describe("Locales - general", function () {
		test("should be an Object", function () {
			expect(_.isObject(Locales)).toBeTruthy();
		});
	});

	describe("#getLocaleFullName", function () {
		test("should return 'English' for 'en'", function () {
			expect(getLocaleFullName("en")).toStrictEqual("English");
		});

		test("should return 'Polski' for 'pl'", function () {
			expect(getLocaleFullName("pl")).toStrictEqual("Polski");
		});
	});
});
