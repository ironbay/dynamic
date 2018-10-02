export default class Dynamic {
    static put(input: Object, path: Array<any>, value: any): Object;
    static delete(input: Object, path: Array<string>): Object;
    static get<T>(input: Object, path: Array<string>): T;
    static get_values<T>(input: Object, path: Array<string>): Array<T>;
    static get_keys(input: Object, path: Array<string>): Array<string>;
    static get_pattern(input: any, path: Array<string>, left?: any[]): Array<Dynamic.Layer<any>>;
    static flatten(input: Object, path?: string[]): Array<Dynamic.Layer<any>>;
    static layers(input: Object, path?: string[]): Array<Dynamic.Layer<any>>;
}
