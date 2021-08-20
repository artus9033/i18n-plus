#!/usr/bin/env node

const yaml = require("yaml");
const fs = require("fs");
const path = require("path");
const chokidar = require("chokidar");
const JSON5 = require("json5");
const { Signale } = require("signale");
const _ = require("lodash");

const signale = new Signale({
	// standard loggers should write to `process.stderr`
	stream: process.stderr,
	// `error` & 'fatal' should write to `process.stderr`
	types: {
		error: {
			stream: [process.stderr],
		},
		fatal: {
			stream: [process.stderr],
		},
	},
});

const yargs = require("yargs/yargs");
const { hideBin } = require("yargs/helpers");

yargs(hideBin(process.argv))
	.scriptName("compileI18n")
	.usage("compileKeys [args]")
	.example(
		"compileKeys i18n/keys/index.yaml i18n/LocaleKeys.ts",
		"Compiles keys defined in entrypoint i18n/keys/index.yaml and outputs the bundle to i18n/LocaleKeys.ts (once)"
	)
	.example(
		"compileKeys i18n/keys/index.yaml i18n/LocaleKeys.ts --dev",
		"Compiles keys defined in entrypoint i18n/keys/index.yaml and outputs the bundle to i18n/LocaleKeys.ts, watching for file changes within the input yaml file parent directory (i18n/keys)"
	)
	.command(
		"compileKeys <input> <output>",
		"compile I18n yaml files to importable TS bundle",
		(yargs) => {
			yargs
				.positional("input", {
					describe: "root YAML input file path",
					type: "string",
					demandOption: true,
				})
				.positional("output", {
					describe: "output TS bundle file path",
					type: "string",
					demandOption: true,
				});
		},
		(args) => {
			const inputYamlFilePath = path.resolve(args.input),
				outputTsFilePath = path.join(args.output),
				outputTsFileParentDir = path.dirname(outputTsFilePath);

			if (!inputYamlFilePath.endsWith(".yaml")) {
				const parts = inputYamlFilePath.split(".");

				signale.fatal(
					`The input file has to end with '.yaml' extension (passed file ends with extension: ${
						parts.length > 1 ? parts[parts.length - 1] : "<no extension>"
					})!`
				);

				process.exit(1);
			}

			if (!fs.existsSync(inputYamlFilePath)) {
				signale.fatal(`The input file '${inputYamlFilePath}' does not exist!`);

				process.exit(2);
			}

			if (!outputTsFilePath.endsWith(".ts") && !outputTsFilePath.endsWith(".tsx")) {
				const parts = outputTsFilePath.split(".");

				signale.fatal(
					`The output file has to end with '.ts' or '.tsx' extension (passed file ends with extension: ${
						parts.length > 1 ? parts[parts.length - 1] : "<no extension>"
					})!`
				);

				process.exit(3);
			}

			if (!fs.existsSync(outputTsFileParentDir)) {
				signale.debug(
					`Creating output directory for output TS file: '${outputTsFileParentDir}'`
				);

				fs.mkdir(outputTsFileParentDir, {
					recursive: true,
				});
			}

			function isObject(value) {
				return value !== null && typeof value === "object" && !(value instanceof Date);
			}

			function deepMap(obj, recPath = "") {
				Object.keys(obj).forEach(function (key) {
					let path = `${recPath.length ? recPath + "." : ""}${key}`;

					if (isObject(obj[key])) {
						if (Array.isArray(obj[key])) {
							let map = {};

							for (let item of obj[key]) {
								Object.assign(
									map,
									typeof item === "object" ? item : { [item]: null }
								);
							}

							obj[key] = map;
						}

						deepMap(obj[key], path);
					} else if (obj[key] === null) {
						obj[key] = path;
					} else {
						const items = obj[key].split(" ");

						obj[key] = {};

						for (let item of items) {
							obj[key][item] = `${path}.${item}`;
						}
					}
				});
			}

			/** Loads yaml, replacing !include(<path>) blocks with actual files' contents */
			function modifiedYamlLoader(filePath) {
				let filePaths = [filePath];

				return [
					fs
						.readFileSync(filePath, "utf8")
						.replace(
							/^(\ *)(?:((?:\-\ ?)?[_a-zA-Z][_a-zA-Z0-9]*:\ +))?(\!include\(([\.\w\/]+)\))$/gm,
							function (
								match,
								group1,
								group2,
								group3,
								group4,
								matchOffset,
								input_string
							) {
								// group1 are the (optional) leading whitespaces (so as to detect indentation length)
								// group2 is the property name, group3 is the full !include(...) expression
								// and group4 is the inside of the include expression ('...' from the above)

								// only advance by one indentation level if the include is a value of a mapped key
								let offset = group1?.length ?? 0,
									additionalOffset = group2 === undefined ? 0 : 4;

								let group2WithFallback = group2 ?? "";

								let [replacementContents, nextFilePaths] = modifiedYamlLoader(
									path.join(path.dirname(filePath), group4)
								);

								replacementContents = replacementContents.replace(
									/^/gm,
									" ".repeat(offset + additionalOffset)
								);

								filePaths.push(...nextFilePaths);

								return `${group2WithFallback}\n${replacementContents}`;
							}
						),
					filePaths,
				];
			}

			function recompileI18nKeys() {
				try {
					const [contents, filePaths] = modifiedYamlLoader(inputYamlFilePath);

					let doc = yaml.parse(contents);

					deepMap(doc);

					fs.writeFileSync(
						outputTsFilePath,
						`/** DO NOT EDIT THIS FILE - it is auto-generated by the i18n-plus script from .yaml files */\n/** Generated on ${new Date().toISOString()} */\nexport const LocaleKeys = ${JSON5.stringify(
							doc,
							null,
							4
						)};\n\nexport default LocaleKeys;\n`
					);

					signale.success("I18n keys compiled successfully!");

					return filePaths;
				} catch (error) {
					console.log();
					signale.error(
						`Could not compile i18n keys (file: '${inputYamlFilePath}'):\n`,
						error
					);
					console.log();

					return false;
				}
			}

			let compilationTimeout = null;

			function triggerDelayedCompilation(callback) {
				if (compilationTimeout != null) {
					clearTimeout(compilationTimeout);
				}

				compilationTimeout = setTimeout(function () {
					compilationTimeout = null;

					callback(recompileI18nKeys());
				}, 500);
			}

			if (args.d) {
				const initialSourceFilePathsOrFalse = recompileI18nKeys();

				let watchedFiles = Array.from(
					new Set(initialSourceFilePathsOrFalse || [args.input])
				); // prevent duplicates & cycles

				let watcher = chokidar.watch(watchedFiles).on("change", (event) => {
					signale.info(`File change detected: ${event}`);

					triggerDelayedCompilation((newSourceFilePathsOrFalse) => {
						if (newSourceFilePathsOrFalse) {
							const obsoleteFiles = _.difference(
									watchedFiles,
									newSourceFilePathsOrFalse
								),
								newFiles = _.difference(newSourceFilePathsOrFalse, watchedFiles),
								dependencyTreeChanged = newFiles.length || obsoleteFiles.length;

							if (dependencyTreeChanged) {
								console.log();
							}

							for (let obsoleteFile of obsoleteFiles) {
								signale.debug(
									`Obsolete file removed from watched dependency tree: ${obsoleteFile}`
								);

								watcher.unwatch(obsoleteFile);
							}

							for (let newFile of newFiles) {
								signale.debug(
									`New file added to watched dependency tree: ${newFile}`
								);

								watcher.add(newFile);
							}

							watchedFiles = Array.from(new Set(newSourceFilePathsOrFalse)); // prevent duplicates & cycles

							if (dependencyTreeChanged) {
								signale.debug("New dependency tree:", watchedFiles);
								console.log();
							}
						}
					});
				});
			} else {
				// build just once
				const initialSourceFilePathsOrFalse = recompileI18nKeys();

				// in non-dev, single-shot mode, return an error code if compilation fails
				if (initialSourceFilePathsOrFalse === false) {
					process.exit(4);
				}
			}
		}
	)
	.option("d", {
		alias: "dev",
		boolean: true,
		default: false,
	})
	.strict()
	.showHelpOnFail(true)
	.help("?")
	.alias("?", ["help", "h"])
	.demandCommand()
	.recommendCommands().argv;
