export default class Dynamic {
    static put(input: Object, path: Array<any>, value) {
        const [head, ...tail] = path
        if (tail.length === 0) {
            input[path[0]] = value
            return input
        }
        let child = input[head] || {}
        if (typeof child !== 'object')
            child = {}
        input[head] = Dynamic.put(child, tail, value)
        return input
    }

    static delete(input: Object, path: Array<string>) {
        const [head, ...tail] = path
        if (tail.length === 0) {
            delete (input[head])
            return input
        }
        const child = input[head]
        if (child == null || typeof child !== 'object')
            return input
        return Dynamic.delete(child, tail)
    }


    static get<T>(input: Object, path: Array<string>): T {
        const [head, ...tail] = path
        if (head == null)
            return input as T
        const child = input[head]
        if (child == null)
            return undefined
        return Dynamic.get<T>(child, tail)
    }

    static get_values<T>(input: Object, path: Array<string>): Array<T> {
        return Object.values(Dynamic.get<{ [key: string]: T }>(input, path) || {})
    }

    static get_keys(input: Object, path: Array<string>): Array<string> {
        return Object.keys(Dynamic.get<{ [key: string]: any }>(input, path) || {})
    }

    static get_pattern(input: any, path: Array<string>, left = []): Array<Dynamic.Layer<any>> {
        if (input == null)
            return []
        const [head, ...tail] = path
        if (head == null)
            return [{
                path: left,
                value: input,
            }]
        const children = head === '+' ? Object.entries(input || {}) : [[head, input[head]]]
        return children
            .filter(item => item != null)
            .reduce((collect, [key, child]) => [...collect, ...Dynamic.get_pattern(child, tail, [...left, key])], [])
    }

    static flatten(input: Object, path = new Array<string>()): Array<Dynamic.Layer<any>> {
        return Object
            .keys(input)
            .reduce((collect, key): Array<Dynamic.Layer<any>> => {
                const value = input[key]
                const next = [...path, key]
                if (value instanceof Object && Array.isArray(value) === false) {
                    if (Object.keys(value).length > 0)
                        return [...Dynamic.flatten(value, next), ...collect]
                    return collect
                }
                return [{
                    path: next,
                    value: value,
                }, ...collect]
            }, new Array<Dynamic.Layer<any>>())
    }

    static layers(input: Object, path = new Array<string>()): Array<Dynamic.Layer<any>> {
        switch (input instanceof Object) {
            case false:
                return []
            case true:
                return Object
                    .keys(input)
                    .reduce((collect, key) => {
                        const value = input[key]
                        return collect.concat(Dynamic.layers(value, [...path, key]))
                    }, [
                            {
                                path,
                                value: input,
                            }
                        ])
        }
    }

}
