import { keyInObject } from './helpers';

const WITH: unique symbol = Symbol('with');

interface ImutatorLeaf<T, TBase> {
    with(value: T): TBase;
}

interface ImutatorLeafNoConflict<T, TBase> {
    [WITH](value: T): TBase;
}

type ImutatorNode<T, TBase> = T extends { with: unknown }
    ? MapToImutator<T, TBase> & ImutatorLeafNoConflict<T, TBase>
    : MapToImutator<T, TBase> & ImutatorLeaf<T, TBase>;

type MapToImutator<T, TBase> = {
    [K in keyof T]: T[K] extends object ? ImutatorNode<T[K], TBase> : ImutatorLeaf<T[K], TBase>
};

interface Imutator<T, TBase> {
    replace(): MapToImutator<T, TBase>;
}

function replaceAtWith<TValue, TBase extends object>(
    base: TBase,
    path: Array<string | number | symbol>
): (value: TValue) => TBase {
    const index = path[0];

    if (keyInObject(base, index) && typeof base[index] === 'object') {
        return (value: TValue): TBase => {
            if (path.length <= 1) {
                return {
                    ...base,
                    [index]: value,
                }
            }

            return {
                ...base,
                [index]: replaceAtWith(base[index] as any, path.slice(1))(value),
            };
        };
    }

    return (value: TValue): TBase => ({
        ...base,
        [index]: value,
    });
}

function replacer<TObj extends object, TBase extends object>(obj: TObj, base: TBase, path: Array<string | number | symbol> = []): MapToImutator<TObj, TBase> {
    const WrapAsImutatorProxy: ProxyHandler<TObj> = {
        get(target: TObj, prop, receiver) {
            if (prop in target) {
                const orig = Reflect.get(target, prop, receiver);
                if (typeof orig === 'object') {
                    return replacer(orig, base, [...path, prop]);
                }

                return {
                    with: replaceAtWith(base, [...path, prop]),
                }
            } else if (prop === 'with' || prop === WITH) {
                return replaceAtWith(base, path);
            }
        }
    };

    return new Proxy(obj, WrapAsImutatorProxy) as MapToImutator<TObj, TBase>;
}

function immutable<T extends object>(obj: T): Imutator<T, T> {
    return {
        replace: () => replacer(obj, obj),
    }
}

////////////

type DeepReadonly<T> = {
    readonly [K in keyof T]: T[K] extends object ? DeepReadonly<T[K]> : Readonly<T[K]>;
}

interface Test {
    readonly x: string;
    readonly y: {
        readonly z: number;
        readonly b: number;
    },
}

interface TestNoConflict {
    readonly with: string;
    readonly a: string;
    readonly b: {
        readonly with: number;
    },
    readonly c: {
        readonly with: {
            readonly a: string;
        }
    }
}

interface DeepTest {
    readonly a: { readonly b: { readonly c: { readonly d: { readonly e: { readonly f: { readonly g: string }}}}}};
}

const val: Test = {
    x: 'some string',
    y: { z: 124, b: 123 },
};

const valNoConflict: TestNoConflict = {
    with: 'this is a string',
    a: 'this is also a string',
    b: {
        with: 124,
    },
    c: {
        with: {
            a: 'and so is this'
        }
    }
};
const deepTestVal: DeepTest = { a: { b: { c: { d: { e: { f: { g: 'some string' }}}}}}};

try {
    const x = immutable(val).replace().x.with('test');

    console.assert(x !== val);
    console.assert(x.x === 'test');
    console.assert(x.y === val.y);
} catch (e) {
    console.error(e);
}

try {
    const x = immutable(val).replace().y.z.with(1351);

    console.assert(x !== val);
    console.assert(x.y !== val.y);
    console.assert(x.y.z === 1351);
} catch (e) {
    console.error(e);
}

try {
    const x = immutable(val).replace().y.with({ z: 999, b: 123 });

    console.assert(x !== val);
    console.assert(x.y !== val.y);
    console.assert(x.y.z === 999);
    console.assert(x.y.b === 123);
} catch (e) {
    console.error(e);
}

try {
    const x = immutable(valNoConflict).replace().with.with('test');

    console.assert(x !== valNoConflict);
    console.assert(x.with === 'test');
} catch(e) {
    console.error(e);
}

try {
    const testValue = { with: { a: 'test' }};
    const x = immutable(valNoConflict).replace().c[WITH](testValue);

    console.assert(x !== valNoConflict);
    console.assert(x.c !== valNoConflict.c);
    console.assert(x.c === testValue);
} catch(e) {
    console.error(e);
}

try {
    const x = immutable(deepTestVal).replace().a.b.c.d.e.f.g.with('this is a replacement value');

    console.assert(x !== deepTestVal);
    console.assert(x.a !== deepTestVal.a);
    console.assert(x.a.b !== deepTestVal.a.b);
    console.assert(x.a.b.c !== deepTestVal.a.b.c);
    console.assert(x.a.b.c.d !== deepTestVal.a.b.c.d);
    console.assert(x.a.b.c.d.e !== deepTestVal.a.b.c.d.e);
    console.assert(x.a.b.c.d.e.f !== deepTestVal.a.b.c.d.e.f);
    console.assert(x.a.b.c.d.e.f.g !== deepTestVal.a.b.c.d.e.f.g);
    console.assert(x.a.b.c.d.e.f.g === 'this is a replacement value');
} catch (e) {
    console.error(e);
}
