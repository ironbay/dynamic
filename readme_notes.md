# dynamic

Dynamic data structure library. The underlying structure is a `T: map[string]interface{} | map[string]T`.

### Empty() map[string]interface{}
Returns an empty `map[string]interface{}`

### Set(input map[string]interface{}, value interface{}, path ...string) map[string]interface{}
Will set the `value` to the nested `path`. If the path does not exist yet, it will be created.
Returns the input augmented with this path and new value at the right place.

### Get(input map[string]interface{}, path ...string) interface{}
Should find the `value` at the `path` in `input`. It first verifies the path exists, otherwise returns `Nil`.

### Keys(input map[string]interface{}) []string
Returns the keys of a `map` (not nested though).

### Inflate(input map[string]interface{}) map[string]interface{}
Transforms a `map` that looks like:
```
{
  "a.b.c": 10
}
```
into a nested object of "dynamic" type
```
{
  "a": {
    "b": {
      "c": 10
    }
  }
}
```

It adds this data to the `input`.

### Merge(destination, source map[string]interface{}) map[string]interface{}
Deeply merges every element from `source` in `destination`.

### Map(destination map[string]interface{}, arr ...string) map[string]interface{}
Sets to true every key in arr

### String(input map[string]interface{}, path ...string) string
Get and then cast to string or "".

### Bool(input map[string]interface{}, path ...string) bool
Get and then cast to `boolean` or `false`.

### Int(input map[string]interface{}, path ...string) int64
Get and then cast to `int` or `0`.

### Float(input map[string]interface{}, path ...string) float64
Get and then cast to `float` or `0`.

### Object(input map[string]interface{}, path ...string) map[string]interface{}
Get and cast to `map[string]interface{}` or (empty) `map[string]interface{}{}`

### Time(input map[string]interface{}, path ...string) time.Time
Get and cast to `time` or (empty) `time.Time{}`

### Array(input map[string]interface{}, path ...string) []interface{}
Get and cast to `array` or (empty) `[]interface{}{}`

### Build(args ...interface{}) map[string]interface{}
From successive key, value, key2, value2, key3, value3 ... builds a "dynamic" data structure.
It must assume depth ascending sorting in the args.

### Clone(input map[string]interface{}) map[string]interface{}
Creates a copy, element by element.

### Atom structure
Has a Path[]string and a Value interface{} (a value + how to get there in a store)

### Flatten(input map[string]interface{}, path ...string) []\*Atom
From a "dynamic" data strcture, will find all the atoms, and flatten the nested array into a flat one.

### Primitives(input map[string]interface{}) map[string]interface{}
Only returns the non-nested objects. For instance in
a > b > c > 3
a > b > d > 4
a > 2
b > 10
It would return only
a > 2
b > 10

## Delete(input map[string]interface{}, path ...string)
Finds the map holding the Atom at path "path", and deletes it.
