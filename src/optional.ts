import { keyInObject } from './helpers';

export const GET: unique symbol = Symbol('OptionalResolve');

interface OptionalLeafNoConflict<T, TOptional> {
    [GET](defaultValue: T): Exclude<T, undefined | null | void>;
    [GET](): T | TOptional;
}

interface OptionalLeaf<T, TOptional> extends OptionalLeafNoConflict<T, TOptional> {
    // resolve(defaultValue: T): Exclude<T, undefined | null | void>;
    // resolve(): T | TOptional;
}

type OptionalLeafNoConflictPicker<T, TOptional> = T extends { resolve: any }
    ? OptionalLeafNoConflict<T, TOptional>
    : OptionalLeaf<T, TOptional>;

type OptionalNode<T, TOptional> = OptionalLeafNoConflictPicker<T, TOptional> & MapOptionalProxy<T, TOptional>;

type OptionalProxy<T, TOptional> =
    T extends undefined
        ? never
        : (
            T extends object
            ? OptionalNode<T, TOptional>
            : OptionalLeafNoConflictPicker<T, TOptional>
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
        const index = p.shift();
        if (index == null) {
            break;
        }

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
        return (value?: TValue) => value != null ? value : undefined;
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
                if (target === RAW) {
                    return () => undefined;
                }

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

export function resolve<T>(opt: OptionalLeafNoConflict<T, undefined>, defaultValue: T): T;
export function resolve<T>(opt: OptionalLeafNoConflict<T, never>, defaultValue?: T): T;
export function resolve<T>(opt: OptionalLeafNoConflict<T, undefined>, defaultValue?: T): T | undefined;
export function resolve<T, TOptional extends undefined | never>(opt: OptionalLeafNoConflict<T, TOptional>, defaultValue?: T): T | TOptional {
    if (defaultValue) {
        return opt[GET](defaultValue);
    }

    return opt[GET]();
}
