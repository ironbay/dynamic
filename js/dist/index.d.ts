import "./types";
export declare function put(input: Object, path: Array<any>, value: any): Object;
export declare function del(input: Object, path: Array<string>): Object;
export declare function get<T>(input: Object, path: Array<string>): T;
export declare function get_values<T>(input: Object, path: Array<string>): Array<T>;
export declare function get_keys(input: Object, path: Array<string>): Array<string>;
export declare function get_pattern(input: any, path: Array<string>, left?: any[]): Array<Dynamic.Layer<any>>;
export declare function flatten(input: Object, path?: string[]): Array<Dynamic.Layer<any>>;
export declare function layers(input: Object, path?: string[]): Array<Dynamic.Layer<any>>;
