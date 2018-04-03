"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Dynamic = /** @class */ (function () {
    function Dynamic() {
    }
    Dynamic.put = function (input, path, value) {
        var head = path[0], tail = path.slice(1);
        if (tail.length === 0) {
            input[path[0]] = value;
            return input;
        }
        var child = input[head] || {};
        if (typeof child !== 'object')
            child = {};
        input[head] = Dynamic.put(child, tail, value);
        return input;
    };
    Dynamic.delete = function (input, path) {
        var head = path[0], tail = path.slice(1);
        if (tail.length === 0) {
            delete (input[head]);
            return input;
        }
        var child = input[head];
        if (child == null || typeof child !== 'object')
            return input;
        return Dynamic.delete(child, tail);
    };
    Dynamic.get = function (input, path) {
        var head = path[0], tail = path.slice(1);
        if (head == null)
            return input;
        var child = input[head];
        if (child == null)
            return undefined;
        return Dynamic.get(child, tail);
    };
    Dynamic.get_values = function (input, path) {
        return Object.values(Dynamic.get(input, path) || {});
    };
    Dynamic.get_keys = function (input, path) {
        return Object.keys(Dynamic.get(input, path) || {});
    };
    Dynamic.get_pattern = function (input, path, left) {
        if (left === void 0) { left = []; }
        if (input == null)
            return [];
        var head = path[0], tail = path.slice(1);
        if (head == null)
            return [{
                    path: left,
                    value: input,
                }];
        var children = head === '+' ? Object.entries(input || {}) : [[head, input[head]]];
        return children
            .filter(function (item) { return item != null; })
            .reduce(function (collect, _a) {
            var key = _a[0], child = _a[1];
            return collect.concat(Dynamic.get_pattern(child, tail, left.concat([key])));
        }, []);
    };
    Dynamic.flatten = function (input, path) {
        if (path === void 0) { path = new Array(); }
        return Object
            .keys(input)
            .reduce(function (collect, key) {
            var value = input[key];
            var next = path.concat([key]);
            if (value instanceof Object) {
                if (Object.keys(value).length > 0)
                    return Dynamic.flatten(value, next).concat(collect);
                return collect;
            }
            return [{
                    path: next,
                    value: value,
                }].concat(collect);
        }, new Array());
    };
    Dynamic.layers = function (input, path) {
        if (path === void 0) { path = new Array(); }
        switch (input instanceof Object) {
            case false:
                return [];
            case true:
                return Object
                    .keys(input)
                    .reduce(function (collect, key) {
                    var value = input[key];
                    return collect.concat(Dynamic.layers(value, path.concat([key])));
                }, [
                    {
                        path: path,
                        value: input,
                    }
                ]);
        }
    };
    return Dynamic;
}());
exports.default = Dynamic;
//# sourceMappingURL=dynamic.js.map