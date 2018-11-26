import { resolveTypes, setOptions } from 'resolve-types';
import { optional, GET } from '../optional';

import tsConfig from '../../tsconfig.json';

import path from 'path';
import { CompilerOptions } from 'typescript';

setOptions({
    ...tsConfig.compilerOptions as unknown as CompilerOptions,
    baseUrl: path.resolve(__dirname, '..', '..'),
    paths: { '@src/*': [path.resolve(__dirname, '..', '*')]},
}, true);

describe('optional', () => {
    describe('shallow', () => {
        it('should resolve as non-nullable for a non-nullable property', () => {
            const code = `
            import { optional, GET } from '@src/optional';

            interface Test { a: string }

            function test(): Test {
                return { a: 'test' };
            }            
            const obj = test();
            const result = optional(obj).a[GET]();

            type __1 = typeof result;
            `;

            const { types: { __1 }, diagnostics } = resolveTypes(code);

            expect(diagnostics).toHaveLength(0);
            expect(__1).toEqual('string');
        });

        it('should resolve an undefined for an undefined value', () => {
            const code = `
            import { optional, GET } from '@src/optional';

            interface Test { a: string }

            function test(): Test | undefined {
                return { a: 'test' };
            }            
            const obj = test();
            const result = optional(obj).a[GET]();

            type __1 = typeof result;
            `;

            const { types: { __1 }, diagnostics } = resolveTypes(code);

            expect(diagnostics).toHaveLength(0);
            expect(__1).toEqual('string | undefined');
        });

        it('should resolve an undefined for an undefined property', () => {
            const code = `
            import { optional, GET } from '@src/optional';

            interface Test { a?: string }

            function test(): Test {
                return { a: 'test' };
            }            
            const obj = test();
            const result = optional(obj).a[GET]();

            type __1 = typeof result;
            `;

            const { types: { __1 }, diagnostics } = resolveTypes(code);

            expect(diagnostics).toHaveLength(0);
            expect(__1).toEqual('string | undefined');
        });
    });

    describe('two level', () => {
        it('should resolve as non-nullable for a non-nullable property', () => {
            const code = `
            import { optional, GET } from '@src/optional';

            interface Test { a: { b: string } }

            function test(): Test {
                return { a: { b: 'test' } };
            }            
            const obj = test();
            const result = optional(obj).a.b[GET]();

            type __1 = typeof result;
            `;

            const { types: { __1 }, diagnostics } = resolveTypes(code);

            expect(diagnostics).toHaveLength(0);
            expect(__1).toEqual('string');
        });

        it('should resolve an undefined for an undefined value', () => {
            const code = `
            import { optional, GET } from '@src/optional';

            interface Test { a: { b: string } }

            function test(): Test | undefined {
                return { a: { b: 'test' } };
            }            
            const obj = test();
            const result = optional(obj).a.b[GET]();

            type __1 = typeof result;
            `;

            const { types: { __1 }, diagnostics } = resolveTypes(code);

            expect(diagnostics).toHaveLength(0);
            expect(__1).toEqual('string | undefined');
        });

        it('should resolve an undefined for an undefined 1st-level property', () => {
            const code = `
            import { optional, GET } from '@src/optional';

            interface Test { a?: { b: string } }

            function test(): Test {
                return { a: { b: 'test' } };
            }            
            const obj = test();
            const result = optional(obj).a.b[GET]();

            type __1 = typeof result;
            `;

            const { types: { __1 }, diagnostics } = resolveTypes(code);

            expect(diagnostics).toHaveLength(0);
            expect(__1).toEqual('string | undefined');
        });

        it('should resolve an undefined for an undefined 2nd-level property', () => {
            const code = `
            import { optional, GET } from '@src/optional';

            interface Test { a: { b?: string } }

            function test(): Test {
                return { a: { b: 'test' } };
            }            
            const obj = test();
            const result = optional(obj).a.b[GET]();

            type __1 = typeof result;
            `;

            const { types: { __1 }, diagnostics } = resolveTypes(code);

            expect(diagnostics).toHaveLength(0);
            expect(__1).toEqual('string | undefined');
        });
    });
});

describe('resolve(optional)', () => {
    describe('shallow', () => {
        it('should resolve as non-nullable for a non-nullable property', () => {
            const code = `
            import { optional, resolve, GET } from '@src/optional';

            interface Test { a: string }

            function test(): Test {
                return { a: 'test' };
            }            
            const obj = test();
            const result = resolve(optional(obj).a);

            type __1 = typeof result;
            `;

            const { types: { __1 }, diagnostics } = resolveTypes(code);

            expect(diagnostics).toHaveLength(0);
            expect(__1).toEqual('string');
        });

        it('should resolve an undefined for an undefined value', () => {
            const code = `
            import { optional, resolve, GET } from '@src/optional';

            interface Test { a: string }

            function test(): Test | undefined {
                return { a: 'test' };
            }            
            const obj = test();
            const result = resolve(optional(obj).a);

            type __1 = typeof result;
            `;

            const { types: { __1 }, diagnostics } = resolveTypes(code);

            expect(diagnostics).toHaveLength(0);
            expect(__1).toEqual('string | undefined');
        });

        it('should resolve an undefined for an undefined property', () => {
            const code = `
            import { optional, resolve, GET } from '@src/optional';

            interface Test { a?: string }

            function test(): Test {
                return { a: 'test' };
            }            
            const obj = test();
            const result = resolve(optional(obj).a);

            type __1 = typeof result;
            `;

            const { types: { __1 }, diagnostics } = resolveTypes(code);

            expect(diagnostics).toHaveLength(0);
            expect(__1).toEqual('string | undefined');
        });

        it('should resolve as non-nullable for a non-nullable property with default', () => {
            const code = `
            import { optional, resolve, GET } from '@src/optional';

            interface Test { a: string }

            function test(): Test {
                return { a: 'test' };
            }            
            const obj = test();
            const result = resolve(optional(obj).a, 'test 2');

            type __1 = typeof result;
            `;

            const { types: { __1 }, diagnostics } = resolveTypes(code);

            expect(diagnostics).toHaveLength(0);
            expect(__1).toEqual('string');
        });

        it('should resolve as non-nullable for an undefined value with default', () => {
            const code = `
            import { optional, resolve, GET } from '@src/optional';

            interface Test { a: string }

            function test(): Test | undefined {
                return { a: 'test' };
            }            
            const obj = test();
            const result = resolve(optional(obj).a, 'test 2');

            type __1 = typeof result;
            `;

            const { types: { __1 }, diagnostics } = resolveTypes(code);

            expect(diagnostics).toHaveLength(0);
            expect(__1).toEqual('string');
        });

        it('should resolve as non-nullable for an undefined property with default', () => {
            const code = `
            import { optional, resolve, GET } from '@src/optional';

            interface Test { a?: string }

            function test(): Test {
                return { a: 'test' };
            }            
            const obj = test();
            const result = resolve(optional(obj).a, 'test 2');

            type __1 = typeof result;
            `;

            const { types: { __1 }, diagnostics } = resolveTypes(code);

            expect(diagnostics).toHaveLength(0);
            expect(__1).toEqual('string');
        });
    });

    describe('two level', () => {
        it('should resolve as non-nullable for a non-nullable property with default', () => {
            const code = `
            import { optional, resolve, GET } from '@src/optional';

            interface Test { a: { b: string } }

            function test(): Test {
                return { a: { b: 'test' } };
            }            
            const obj = test();
            const result = resolve(optional(obj).a.b, 'test 2');

            type __1 = typeof result;
            `;

            const { types: { __1 }, diagnostics } = resolveTypes(code);

            expect(diagnostics).toHaveLength(0);
            expect(__1).toEqual('string');
        });

        it('should resolve as non-nullable for an undefined value with default', () => {
            const code = `
            import { optional, resolve, GET } from '@src/optional';

            interface Test { a: { b: string } }

            function test(): Test | undefined {
                return { a: { b: 'test' } };
            }            
            const obj = test();
            const result = resolve(optional(obj).a.b, 'test 2');

            type __1 = typeof result;
            `;

            const { types: { __1 }, diagnostics } = resolveTypes(code);

            expect(diagnostics).toHaveLength(0);
            expect(__1).toEqual('string');
        });

        it('should resolve as non-nullable for an undefined 1st-level property with default', () => {
            const code = `
            import { optional, resolve, GET } from '@src/optional';

            interface Test { a?: { b: string } }

            function test(): Test {
                return { a: { b: 'test' } };
            }            
            const obj = test();
            const result = resolve(optional(obj).a.b, 'test 2');

            type __1 = typeof result;
            `;

            const { types: { __1 }, diagnostics } = resolveTypes(code);

            expect(diagnostics).toHaveLength(0);
            expect(__1).toEqual('string');
        });

        it('should resolve an undefined for an undefined 2nd-level property', () => {
            const code = `
            import { optional, resolve, GET } from '@src/optional';

            interface Test { a: { b?: string } }

            function test(): Test {
                return { a: { b: 'test' } };
            }            
            const obj = test();
            const result = resolve(optional(obj).a.b, 'test 2');

            type __1 = typeof result;
            `;

            const { types: { __1 }, diagnostics } = resolveTypes(code);

            expect(diagnostics).toHaveLength(0);
            expect(__1).toEqual('string');
        });
    });
});
