import { keyInObject } from './helpers';

export const GET: unique symbol = Symbol('OptionalResolve');

interface OptionalLeaf<T, TOptional> {
    [GET](defaultValue: T): Exclude<T, undefined | null | void>;
    [GET](): T | TOptional;
}

type OptionalNode<T, TOptional> = OptionalLeaf<T, TOptional> & MapOptionalProxy<T, TOptional>;

type OptionalProxy<T, TOptional> = (
    T extends undefined
        ? never
        : (T extends object ? OptionalNode<T, TOptional> : OptionalLeaf<T, TOptional>)
    );

type IsOptional<T> = T extends undefined ? undefined : never;

type MapOptionalProxy<T, TOptional> = {
    [K in keyof T]-?: OptionalProxy<T[K], IsOptional<T[K] | TOptional>>;
}

function internalResolver<TValue, TBase, TOptional extends undefined | never>(
    base: TBase,
    path: Array<string | number | Symbol>
): TValue | TOptional {
    const p = [...path];
    let cur: any = base;
    while (p.length > 0 && cur != null) {
        const index = p[0];
        p.shift();

        if (keyInObject(cur, index)) {
            cur = cur[index];
        } else {
            cur = undefined;
        }
    }

    if (p.length > 0) {
        cur = undefined;
    }

    return cur;
}

function resolver<TValue, TBase, TOptional extends undefined | never>(
    base: TBase | undefined,
    path: Array<string | number | Symbol>
): (v?: TValue) => TValue | void {
    if (base == null) {
        return (value?: TValue) => value;
    }

    return (value?: TValue) => {
        const cur = internalResolver<TValue, TBase, TOptional>(base, path);

        if (value != null && cur == null) {
            return value;
        }

        return cur;
    };
}

const RAW = {};
function optionalBuilder<T extends object, TBase extends object, TOptional>(
    base?: T,
    path: Array<string | number | Symbol> = [],
): OptionalProxy<T, TOptional> {
    const proxy = new Proxy(base || RAW, {
        get(target: T, prop, receiver) {
            if (prop === GET) {
                return resolver(base, path);
            }

            return optionalBuilder(base, [...path, prop]);
        }
    });

    return proxy as OptionalProxy<T, TOptional>;
}

export function optional<T extends object>(base: T): OptionalProxy<T, never>;
export function optional<T extends object>(base: T | undefined): OptionalProxy<T, undefined>;
export function optional<T extends object>(base: T): OptionalProxy<T, IsOptional<T>> {
    return optionalBuilder(base);
}

export function resolve<T>(opt: OptionalLeaf<T, undefined>, defaultValue: T): T;
export function resolve<T>(opt: OptionalLeaf<T, never>, defaultValue?: T): T;
export function resolve<T>(opt: OptionalLeaf<T, undefined>, defaultValue?: T): T | undefined;
export function resolve<T, TOptional extends undefined | never>(opt: OptionalLeaf<T, TOptional>, defaultValue?: T): T | TOptional {
    if (defaultValue) {
        return opt[GET](defaultValue);
    }

    return opt[GET]();
}
