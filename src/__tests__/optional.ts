import { optional, GET, resolve } from '@src/optional';

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

    describe('with default values', () => {
        it('should resolve an existing value', () => {
            interface Test { a?: string }

            function test(): Test | undefined {
                return { a: 'test' };
            }

            const expected = 'expected';

            const obj = test();
            const result = optional(obj).a[GET](expected);

            expect(result).toBe('test');
        });

        it('should resolve an the default for an undefined value', () => {
            interface Test { a?: string }

            function test(): Test | undefined {
                return;
            }

            const expected = 'expected';

            const obj = test();
            const result = optional(obj).a[GET](expected);

            expect(result).toBe(expected);
        });

        it('should resolve an undefined for an undefined property', () => {
            interface Test { a?: string }

            function test(): Test | undefined {
                return { };
            }

            const expected = 'expected';

            const obj = test();
            const result = optional(obj).a[GET](expected);

            expect(result).toBe(expected);
        });

        it('should resolve the value for a non-nullable property', () => {
            interface Test { a?: { b?: string } }

            function test(): Test | undefined {
                return { a: { b: 'test' } };
            }

            const expected = 'expected';
            const obj = test();
            const result = optional(obj).a.b[GET](expected);

            expect(result).toEqual('test');
        });

        it('should resolve an undefined for an undefined value', () => {
            interface Test { a?: { b?: string } }

            function test(): Test | undefined {
                return;
            }

            const expected = 'expected';
            const obj = test();
            const result = optional(obj).a.b[GET](expected);

            expect(result).toBe(expected);
        });

        it('should resolve an undefined for an undefined 1st-level property', () => {
            interface Test { a?: { b?: string } }

            function test(): Test | undefined {
                return {};
            }

            const expected = 'expected';
            const obj = test();
            const result = optional(obj).a.b[GET](expected);

            expect(result).toBe(expected);
        });

        it('should resolve an undefined for an undefined 2nd-level property', () => {
            interface Test { a?: { b?: string } }

            function test(): Test | undefined {
                return { a: {} };
            }

            const expected = 'expected';
            const obj = test();
            const result = optional(obj).a.b[GET](expected);

            expect(result).toBe(expected);
        });
    });

    describe('resolve helper', () => {
        it('should resolve an existing value', () => {
            interface Test { a?: string }

            function test(): Test | undefined {
                return { a: 'test' };
            }
            const obj = test();
            const result = resolve(optional(obj).a);

            expect(result).toBe('test');
        });

        it('should resolve an undefined for an undefined value', () => {
            interface Test { a?: string }

            function test(): Test | undefined {
                return;
            }
            const obj = test();
            const result = resolve(optional(obj).a);

            expect(result).toBeUndefined();
        });

        it('should resolve an existing value, even when provided a default', () => {
            interface Test { a?: string }

            function test(): Test | undefined {
                return { a: 'test' };
            }

            const expected = 'expected';
            const obj = test();
            const result = resolve(optional(obj).a, expected);

            expect(result).toBe('test');
        });

        it('should resolve an the default for an undefined value', () => {
            interface Test { a?: string }

            function test(): Test | undefined {
                return;
            }

            const expected = 'expected';

            const obj = test();
            const result = resolve(optional(obj).a, expected);

            expect(result).toBe(expected);
        });
    });

    describe('if typescript fails', () => {
        it('should not explode when accessing beyond the depth ', () => {
            interface Test { a?: string }

            function test(): Test | undefined {
                return;
            }

            const expected = 'expected';

            const obj = test();
            const result = resolve(optional(obj).a, expected);

            expect(result).toBe(expected);
        });
    });
});
