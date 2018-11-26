# Typescript Object Helpers
Convenience methods for dealing with objects in clean typed manor using Proxies

## Optional

Helper for resolving deep optional chains.

```typescript
import { resolve, optional } from 'typescript-object-helpers'; 

interface Example {
    a?: {
        b?: {
            c?: {
                d?: string;
            }
        }
    }
}

let test: Example | undefined;

resolve(optional(test).a.b.c); // { d?: string } | undefined
resolve(optional(test).a.b.c.d); // string | undefined

resolve(optional(test).a.b.c, { d: 'test' }); // { d?: string }
resolve(optional(test).a.b.c.d, 'test'); // string
```

## Imutator

Helper for replacing deep properties in an immutable manor

```typescript
import { immutable } from 'typescript-object-helpers';

interface Example {
    a: {
        b: {
            c: {
                d: string;
            }
        }
    },
    l: {
        m: { 
            n: string;
        }
    }
}

const original: Example = {
    a: {
        b: { c: { d: 'test' }}
    },
    l: { m: { n: 'something '}}
};

const newVal = { d: 'not-test' };
const result = immutable(original).a.b.c.replace(newVal);

original !== result; // true
original.a !== result.a; // true
original.a.b !== result.a.b; // true
original.a.b.c !== result.a.b.c; // true
original.a.b.c === newVal; // true

original.l === result.l; // true
original.l.m === result.l.m; // true
``` 
