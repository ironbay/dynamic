package dynamic

import "strings"

func Empty() map[string]interface{} {
	return map[string]interface{}{}
}

func Set(input map[string]interface{}, value interface{}, path ...string) map[string]interface{} {
	if len(path) == 0 {
		return input
	}
	field, path := path[len(path)-1], path[:len(path)-1]
	current := input
	for _, segment := range path {
		next := current[segment]
		if next == nil {
			next = map[string]interface{}{}
			current[segment] = next
		}
		current = next.(map[string]interface{})
	}
	current[field] = value
	return current
}

func Get(input map[string]interface{}, path ...string) interface{} {
	field, rest := path[len(path)-1], path[:len(path)-1]
	current := input
	var ok bool
	for _, segment := range rest {
		next := current[segment]
		if next == nil {
			return nil
		}
		current, ok = next.(map[string]interface{})
		if !ok {
			return nil
		}
	}
	return current[field]
}

func Keys(input map[string]interface{}) []string {
	result := []string{}
	for key, _ := range input {
		result = append(result, key)
	}
	return result
}

func Inflate(input map[string]interface{}) map[string]interface{} {
	for key, value := range input {
		splits := strings.Split(key, ".")
		if casted, ok := value.(map[string]interface{}); ok {
			value = Inflate(casted)
		}
		delete(input, key)
		Set(input, value, splits...)
	}
	return input
}

func Merge(destination, source map[string]interface{}) {
	for key, value := range source {
		nest, ok := value.(map[string]interface{})
		if !ok {
			destination[key] = value
			continue
		}
		var match map[string]interface{}
		exists, ok := destination[key]
		if ok {
			match, _ = exists.(map[string]interface{})
		}
		if match == nil {
			match = make(map[string]interface{})
			destination[key] = match
		}
		Merge(match, nest)
	}
}

func Map(destination map[string]interface{}, arr []string) {
	for _, val := range arr {
		destination[val] = true
	}
}

func String(input map[string]interface{}, path ...string) string {
	match := Get(input, path...)
	if match == nil {
		return ""
	}
	return match.(string)
}

func Object(input map[string]interface{}, path ...string) map[string]interface{} {
	match := Get(input, path...)
	if match == nil {
		return map[string]interface{}{}
	}
	return match.(map[string]interface{})
}

func Build(args ...interface{}) map[string]interface{} {
	result := Empty()
	for n := 0; n < len(args); n += 2 {
		result[args[n].(string)] = args[n+1]
	}
	return result
}

func Array(input map[string]interface{}, path ...string) []interface{} {
	match := Get(input, path...)
	if match == nil {
		return []interface{}{}
	}
	return match.([]interface{})
}
