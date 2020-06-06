import { assert } from 'chai';

import { NO_ADDITIONAL_NODES_PRESET } from '../../../../../src/options/presets/NoCustomNodes';

import { IdentifierNamesGenerator } from '../../../../../src/enums/generators/identifier-names-generators/IdentifierNamesGenerator';

import { readFileAsString } from '../../../../helpers/readFileAsString';

import { JavaScriptObfuscator } from '../../../../../src/JavaScriptObfuscatorFacade';

describe('ManglePropertiesTransformer', () => {
    describe('transformNode', () => {
        describe('Hexadecimal identifier names generator', () => {
            describe('Variant #1: base properties mangle', () => {
                const property1RegExp: RegExp = /'(_0x[a-f0-9]{4,6})': *0x1/;
                const property2RegExp: RegExp = /'(_0x[a-f0-9]{4,6})': *0x2/;
                const property3RegExp: RegExp = /\['(_0x[a-f0-9]{4,6})']: *0x3/;
                const property4RegExp: RegExp = /\[hawk]: *0x4/;


                let obfuscatedCode: string;

                before(() => {
                    const code: string = readFileAsString(__dirname + '/fixtures/base.js');

                    obfuscatedCode = JavaScriptObfuscator.obfuscate(
                        code,
                        {
                            ...NO_ADDITIONAL_NODES_PRESET,
                            mangleProperties: true,
                            identifierNamesGenerator: IdentifierNamesGenerator.HexadecimalIdentifierNamesGenerator
                        }
                    ).getObfuscatedCode();
                });

                it('Match #1: should mangle property', () => {
                    assert.match(obfuscatedCode, property1RegExp);
                });

                it('Match #2: should mangle property', () => {
                    assert.match(obfuscatedCode, property2RegExp);
                });

                it('Match #3: should mangle property', () => {
                    assert.match(obfuscatedCode, property3RegExp);
                });

                it('Match #4: should mangle property', () => {
                    assert.match(obfuscatedCode, property4RegExp);
                });
            });
        });

        describe('Mangled identifier names generator', () => {
            describe('Variant #1: base properties mangle', () => {
                const property1RegExp: RegExp = /'a': *0x1/;
                const property2RegExp: RegExp = /'b': *0x2/;
                const property3RegExp: RegExp = /\['c']: *0x3/;
                const property4RegExp: RegExp = /\[hawk]: *0x4/;


                let obfuscatedCode: string;

                before(() => {
                    const code: string = readFileAsString(__dirname + '/fixtures/base.js');

                    obfuscatedCode = JavaScriptObfuscator.obfuscate(
                        code,
                        {
                            ...NO_ADDITIONAL_NODES_PRESET,
                            mangleProperties: true,
                            identifierNamesGenerator: IdentifierNamesGenerator.MangledIdentifierNamesGenerator
                        }
                    ).getObfuscatedCode();
                });

                it('Match #1: should mangle property', () => {
                    assert.match(obfuscatedCode, property1RegExp);
                });

                it('Match #2: should mangle property', () => {
                    assert.match(obfuscatedCode, property2RegExp);
                });

                it('Match #3: should mangle property', () => {
                    assert.match(obfuscatedCode, property3RegExp);
                });

                it('Match #4: should mangle property', () => {
                    assert.match(obfuscatedCode, property4RegExp);
                });
            });

            describe('Variant #2: base properties mangle with rename globals', () => {
                const variable1RegExp: RegExp = /const d *= *'hawk'/;
                const variable2RegExp: RegExp = /const e *= *{/;
                const property1RegExp: RegExp = /'a': *0x1/;
                const property2RegExp: RegExp = /'b': *0x2/;
                const property3RegExp: RegExp = /\['c']: *0x3/;
                const property4RegExp: RegExp = /\[d]: *0x4/;


                let obfuscatedCode: string;

                before(() => {
                    const code: string = readFileAsString(__dirname + '/fixtures/base.js');

                    obfuscatedCode = JavaScriptObfuscator.obfuscate(
                        code,
                        {
                            ...NO_ADDITIONAL_NODES_PRESET,
                            mangleProperties: true,
                            identifierNamesGenerator: IdentifierNamesGenerator.MangledIdentifierNamesGenerator,
                            renameGlobals: true
                        }
                    ).getObfuscatedCode();
                });

                it('Match #1: should rename variable name', () => {
                    assert.match(obfuscatedCode, variable1RegExp);
                });

                it('Match #2: should rename variable name', () => {
                    assert.match(obfuscatedCode, variable2RegExp);
                });

                it('Match #3: should mangle property', () => {
                    assert.match(obfuscatedCode, property1RegExp);
                });

                it('Match #4: should mangle property', () => {
                    assert.match(obfuscatedCode, property2RegExp);
                });

                it('Match #5: should mangle property', () => {
                    assert.match(obfuscatedCode, property3RegExp);
                });

                it('Match #6: should mangle property', () => {
                    assert.match(obfuscatedCode, property4RegExp);
                });
            });

            describe('Variant #3: properties mangle of nested objects', () => {
                const regExp: RegExp = new RegExp('' +
                    'const foo *= *{' +
                        '\'a\': *{' +
                            '\'b\': *0x1' +
                        '}' +
                    '};' +
                    'const bar *= *foo\\[\'a\']\\[\'b\'];' +
                '');

                let obfuscatedCode: string;

                before(() => {
                    const code: string = readFileAsString(__dirname + '/fixtures/nested-objects.js');

                    obfuscatedCode = JavaScriptObfuscator.obfuscate(
                        code,
                        {
                            ...NO_ADDITIONAL_NODES_PRESET,
                            mangleProperties: true,
                            identifierNamesGenerator: IdentifierNamesGenerator.MangledIdentifierNamesGenerator
                        }
                    ).getObfuscatedCode();
                });

                it('Should mangle property', () => {
                    assert.match(obfuscatedCode, regExp);
                });
            });

            describe('Variant #4: properties mangle of rest element', () => {
                const regExp: RegExp = new RegExp('' +
                    'const foo *= *{' +
                        '\'a\': *0x1' +
                    '};' +
                    'const \\{a: *bar} *= *foo;' +
                    'const baz *= *bar;' +
                '');

                let obfuscatedCode: string;

                before(() => {
                    const code: string = readFileAsString(__dirname + '/fixtures/rest-element.js');

                    obfuscatedCode = JavaScriptObfuscator.obfuscate(
                        code,
                        {
                            ...NO_ADDITIONAL_NODES_PRESET,
                            mangleProperties: true,
                            identifierNamesGenerator: IdentifierNamesGenerator.MangledIdentifierNamesGenerator
                        }
                    ).getObfuscatedCode();
                });

                it('Should mangle property', () => {
                    assert.match(obfuscatedCode, regExp);
                });
            });

            describe('Variant #5: reserved dom properties', () => {
                const regExp: RegExp = new RegExp('' +
                    'const foo *= *{' +
                        '\'a\': *0x1,' +
                        '\'join\': *0x2,' +
                        '\'b\': *0x3,' +
                        '\'c\': *0x4' +
                    '};' +
                    'const baz *= *foo\\[\'a\'] *\\+ *foo\\[\'join\'] *\\+ *foo\\[\'b\'] *\\+ *foo\\[\'c\'];' +
                '');

                let obfuscatedCode: string;

                before(() => {
                    const code: string = readFileAsString(__dirname + '/fixtures/reserved-properties.js');

                    obfuscatedCode = JavaScriptObfuscator.obfuscate(
                        code,
                        {
                            ...NO_ADDITIONAL_NODES_PRESET,
                            mangleProperties: true,
                            identifierNamesGenerator: IdentifierNamesGenerator.MangledIdentifierNamesGenerator
                        }
                    ).getObfuscatedCode();
                });

                it('Should mangle non-reserved properties', () => {
                    assert.match(obfuscatedCode, regExp);
                });
            });

            describe('Variant #6: reserved names properties', () => {
                const regExp: RegExp = new RegExp('' +
                    'const foo *= *{' +
                        '\'a\': *0x1,' +
                        '\'join\': *0x2,' +
                        '\'reserved\': *0x3,' +
                        '\'private_\': *0x4' +
                    '};' +
                    'const baz *= *foo\\[\'a\'] *\\+ *foo\\[\'join\'] *\\+ *foo\\[\'reserved\'] *\\+ *foo\\[\'private_\'];' +
                '');

                let obfuscatedCode: string;

                before(() => {
                    const code: string = readFileAsString(__dirname + '/fixtures/reserved-properties.js');

                    obfuscatedCode = JavaScriptObfuscator.obfuscate(
                        code,
                        {
                            ...NO_ADDITIONAL_NODES_PRESET,
                            mangleProperties: true,
                            identifierNamesGenerator: IdentifierNamesGenerator.MangledIdentifierNamesGenerator,
                            reservedNames: ['^reserved$', '_$']
                        }
                    ).getObfuscatedCode();
                });

                it('Should mangle non-reserved properties', () => {
                    assert.match(obfuscatedCode, regExp);
                });
            });

            describe('Variant #7: class methods', () => {
                const regExp: RegExp = new RegExp('' +
                    'class Foo *{' +
                        '\\[\'a\'] *\\(\\) *{}' +
                    '}' +
                    'const foo *= *new Foo\\(\\);' +
                    'foo\\[\'a\']\\(\\);' +
                '');

                let obfuscatedCode: string;

                before(() => {
                    const code: string = readFileAsString(__dirname + '/fixtures/class-methods.js');

                    obfuscatedCode = JavaScriptObfuscator.obfuscate(
                        code,
                        {
                            ...NO_ADDITIONAL_NODES_PRESET,
                            mangleProperties: true,
                            identifierNamesGenerator: IdentifierNamesGenerator.MangledIdentifierNamesGenerator,
                            reservedNames: ['^reserved$', '_$']
                        }
                    ).getObfuscatedCode();
                });

                it('Should mangle class method name', () => {
                    assert.match(obfuscatedCode, regExp);
                });
            });
        });
    });
});