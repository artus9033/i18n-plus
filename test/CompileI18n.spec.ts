import childProcess from "child_process";
import fs from "fs";
import path from "path";

import _ from "lodash";
import ts from "typescript";

function resolvePathFromProjectRoot(...parts: string[]): string {
	return path.resolve(path.dirname(__filename), "..", ...parts);
}

const testDataTmpDirectoryPath = resolvePathFromProjectRoot("test", "data", "tmp");

function expectArrayStrictlyContaining<T>(actual: Array<T>, expected: Array<T>) {
	expect(new Set(actual)).toEqual(new Set(expected));
}

beforeAll(() => {
	if (fs.existsSync(testDataTmpDirectoryPath)) {
		console.log(
			`Cleaning temporary output directory ${testDataTmpDirectoryPath} before running tests...`
		);

		fs.rmSync(testDataTmpDirectoryPath, { recursive: true });
	}

	fs.mkdirSync(testDataTmpDirectoryPath);
});

describe("scripts/cli.js", function () {
	function genSubprocessRunner(
		assertExpectations: (
			error: childProcess.ExecFileException,
			stdout: string,
			stderr: string
		) => void,
		args: string[] = []
	) {
		return (done: jest.DoneCallback) => {
			childProcess.execFile(
				"node",
				[resolvePathFromProjectRoot("scripts", "cli.js"), "compileKeys", ...args],
				(error, stdout, stderr) => {
					try {
						assertExpectations(error, stdout, stderr);

						done();
					} catch (error) {
						// pass expect() failures to done
						done(error);
					}
				}
			);
		};
	}

	describe("Basic 'compileKeys' command functioning", function () {
		test(
			"provides help text when 'compileKeys' run without arguments & finishes with error code 1",
			genSubprocessRunner((error, _stdout, stderr) => {
				expect(error.code).toStrictEqual(1); // no arguments passed should result in code 1 (error)
				expect(stderr.includes("compileI18n compileKeys <input> <output>")).toStrictEqual(
					true
				); // check for help heading (in stderr)
			})
		);

		test(
			"provides help text when 'compileKeys' run with --help switch & finishes without an error code, code 0",
			genSubprocessRunner(
				(error, stdout, _stderr) => {
					expect(error).toBeNull(); // help switch should result no error
					expect(
						stdout.includes("compileI18n compileKeys <input> <output>")
					).toStrictEqual(true); // check for help heading (in stdout)
				},
				["--help"]
			)
		);

		test(
			"refuses to run for input with invalid file extension",
			genSubprocessRunner(
				(error, _stdout, stderr) => {
					expect(error.code).toStrictEqual(1); // invalid input extension error code is 1
					expect(
						stderr.includes("The input file has to end with '.yaml' extension")
					).toStrictEqual(true);
				},
				["in.bad", "out.ts"]
			)
		);

		test(
			"refuses to run for inexistent input with valid file extension",
			genSubprocessRunner(
				(error, _stdout, stderr) => {
					expect(error.code).toStrictEqual(2); // inexistent input file error code is 2
					expect(stderr.includes("does not exist")).toStrictEqual(true);
				},
				["404.yaml", "out.ts"]
			)
		);

		test(
			"refuses to run for output with invalid file extension",
			genSubprocessRunner(
				(error, _stdout, stderr) => {
					expect(error.code).toStrictEqual(3); // inexistent input file error code is 3
					expect(
						stderr.includes("The output file has to end with '.ts' or '.tsx' extension")
					).toStrictEqual(true);
				},
				["test/data/keys/abAttrsTest.yaml", "test/data/tmp/out.bad"]
			)
		);
	});

	describe("Translation key dictionaries compilation ('compileKeys')", function () {
		test(
			"fails to compile a file with syntax errors",
			genSubprocessRunner(
				(error, _stdout, stderr) => {
					expect(error.code).toStrictEqual(4); // compilation error in non-dev-mode code is 4
					expect(stderr.includes("Could not compile i18n keys")).toStrictEqual(true);
					expect(stderr.includes("YAMLSyntaxError")).toStrictEqual(true); // ensure that's related to YAML syntax errors
					expect(stderr.includes("ENOENT")).toStrictEqual(false); // ensure that's not related to inexistent files
				},
				["test/data/keys/bad/syntaxError.yaml", "test/data/tmp/void.ts"]
			)
		);

		test(
			"fails to compile a file with inexistent !include() references",
			genSubprocessRunner(
				(error, _stdout, stderr) => {
					expect(error.code).toStrictEqual(4); // compilation error in non-dev-mode code is 4
					expect(stderr.includes("Could not compile i18n keys")).toStrictEqual(true);
					expect(stderr.includes("YAMLSyntaxError")).toStrictEqual(false); // ensure that's not related to YAML syntax errors
					expect(stderr.includes("ENOENT")).toStrictEqual(true); // ensure that's related to inexistent files
				},
				["test/data/keys/bad/includeInexistentError.yaml", "test/data/tmp/void.ts"]
			)
		);

		test("compiles a simple flat-file dictionary properly to valid TypeScript with proper attributes", (done) => {
			const rawOutputPathArg = "test/data/tmp/abAttrsTest.ts",
				outputPath = resolvePathFromProjectRoot(...rawOutputPathArg.split("/"));

			return genSubprocessRunner(() => {
				let rawTS = fs.readFileSync(outputPath).toString(),
					transpiledJS = ts.transpile(rawTS),
					evaluatedJS = eval(transpiledJS);

				expect(_.isObject(evaluatedJS)).toStrictEqual(true);
				expectArrayStrictlyContaining(Object.getOwnPropertyNames(evaluatedJS), ["keys"]);
				expectArrayStrictlyContaining(Object.getOwnPropertyNames(evaluatedJS.keys), [
					"a",
					"b",
				]);
				expect(evaluatedJS.keys.a).toStrictEqual("keys.a");
				expect(evaluatedJS.keys.b).toStrictEqual("keys.b");
			}, ["test/data/keys/abAttrsTest.yaml", rawOutputPathArg])(done);
		});

		test("compiles a complex multi-file dictionary properly to valid TypeScript with proper attributes", (done) => {
			const rawOutputPathArg = "test/data/tmp/complex.ts",
				outputPath = resolvePathFromProjectRoot(...rawOutputPathArg.split("/"));

			return genSubprocessRunner(() => {
				let rawTS = fs.readFileSync(outputPath).toString(),
					transpiledJS = ts.transpile(rawTS),
					evaluatedJS = eval(transpiledJS);

				expect(_.isObject(evaluatedJS)).toStrictEqual(true);
				expectArrayStrictlyContaining(Object.getOwnPropertyNames(evaluatedJS), [
					"simple",
					"advanced",
				]);

				// just partial checks here, as there are many attributes which may change in future development
				expect(
					Object.getOwnPropertyNames(evaluatedJS.simple).includes("raw")
				).toStrictEqual(true);
				expect(evaluatedJS.simple.raw).toStrictEqual("simple.raw");

				expect(
					Object.getOwnPropertyNames(evaluatedJS.advanced).includes("conjugateOne")
				).toStrictEqual(true);
				expect(evaluatedJS.advanced.conjugateOne).toStrictEqual("advanced.conjugateOne");
			}, ["test/data/keys/complex/index.yaml", rawOutputPathArg])(done);
		});
	});
});

afterAll(() => {
	console.log(
		`Cleaning temporary output directory ${testDataTmpDirectoryPath} after running tests...`
	);

	fs.rmSync(testDataTmpDirectoryPath, { recursive: true });
});
