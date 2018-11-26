import { optional, GET } from '@src/optional';
import { resolveTypes } from 'resolve-types';

describe("optional", () => {
    describe('shallow', () => {
        it('should resolve an existing value', () => {
            interface Test { a?: string }

            function test(): Test | undefined {
                return { a: 'test' };
            }
            const obj = test();
            const result = optional(obj).a[GET]();

            expect(result).toBe('test');
        });

        it('should resolve an undefined for an undefined value', () => {
            interface Test { a?: string }

            function test(): Test | undefined {
                return;
            }
            const obj = test();
            const result = optional(obj).a[GET]();

            expect(result).toBeUndefined();
        });

        it('should resolve an undefined for an undefined property', () => {
            interface Test { a?: string }

            function test(): Test | undefined {
                return { };
            }
            const obj = test();
            const result = optional(obj).a[GET]();

            expect(result).toBeUndefined();
        });
    });

    describe('two level', () => {
        it('should resolve the value for a non-nullable property', () => {
            interface Test { a?: { b?: string } }

            function test(): Test | undefined {
                return { a: { b: 'test' } };
            }
            const obj = test();
            const result = optional(obj).a.b[GET]();

            expect(result).toEqual('test');
        });

        it('should resolve an undefined for an undefined value', () => {
            interface Test { a?: { b?: string } }

            function test(): Test | undefined {
                return;
            }
            const obj = test();
            const result = optional(obj).a.b[GET]();

            expect(result).toBeUndefined();
        });

        it('should resolve an undefined for an undefined 1st-level property', () => {
            interface Test { a?: { b?: string } }

            function test(): Test | undefined {
                return {};
            }
            const obj = test();
            const result = optional(obj).a.b[GET]();

            expect(result).toBeUndefined();
        });

        it('should resolve an undefined for an undefined 2nd-level property', () => {
            interface Test { a?: { b?: string } }

            function test(): Test | undefined {
                return { a: {} };
            }
            const obj = test();
            const result = optional(obj).a.b[GET]();

            expect(result).toBeUndefined();
        });
    });
});
