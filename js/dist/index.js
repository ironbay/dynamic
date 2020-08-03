'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function put(input, path, value) {
    const [head, ...tail] = path;
    if (tail.length === 0) {
        input[path[0]] = value;
        return input;
    }
    let child = input[head] || {};
    if (typeof child !== "object")
        child = {};
    input[head] = put(child, tail, value);
    return input;
}
function del(input, path) {
    const [head, ...tail] = path;
    if (tail.length === 0) {
        delete input[head];
        return input;
    }
    const child = input[head];
    if (child == null || typeof child !== "object")
        return input;
    input[head] = del(child, tail);
    return input;
}
function get(input, path) {
    const [head, ...tail] = path;
    if (head == null)
        return input;
    const child = input[head];
    if (child == null)
        return undefined;
    return get(child, tail);
}
function get_values(input, path) {
    return Object.values(get(input, path) || {});
}
function get_keys(input, path) {
    return Object.keys(get(input, path) || {});
}
function get_pattern(input, path, left = []) {
    if (input == null)
        return [];
    const [head, ...tail] = path;
    if (head == null)
        return [
            {
                path: left,
                value: input,
            },
        ];
    const children = head === "+" ? Object.entries(input || {}) : [[head, input[head]]];
    return children
        .filter((item) => item != null)
        .reduce((collect, [key, child]) => [
        ...collect,
        ...get_pattern(child, tail, [...left, key]),
    ], []);
}
function flatten(input, path = new Array()) {
    return Object.keys(input).reduce((collect, key) => {
        const value = input[key];
        const next = [...path, key];
        if (value instanceof Object && Array.isArray(value) === false) {
            if (Object.keys(value).length > 0)
                return [...flatten(value, next), ...collect];
            return collect;
        }
        return [
            {
                path: next,
                value: value,
            },
            ...collect,
        ];
    }, new Array());
}
function layers(input, path = new Array()) {
    switch (input instanceof Object) {
        case false:
            return [];
        case true:
            return Object.keys(input).reduce((collect, key) => {
                const value = input[key];
                return collect.concat(layers(value, [...path, key]));
            }, [
                {
                    path,
                    value: input,
                },
            ]);
    }
}

exports.del = del;
exports.flatten = flatten;
exports.get = get;
exports.get_keys = get_keys;
exports.get_pattern = get_pattern;
exports.get_values = get_values;
exports.layers = layers;
exports.put = put;
