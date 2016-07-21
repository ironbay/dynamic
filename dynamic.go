package dynamic

import (
	"encoding/json"
	"strings"
	"time"
)

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
		} else {
			_, ok := next.(map[string]interface{})
			if !ok {
				next = map[string]interface{}{}
				current[segment] = next
			}
		}
		current = next.(map[string]interface{})
	}
	current[field] = value
	return input
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

func Values(input map[string]interface{}) []interface{} {
	result := make([]interface{}, 0)
	for _, v := range input {
		result = append(result, v)
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

func Merge(destination, source map[string]interface{}) map[string]interface{} {
	if source == nil {
		return source
	}
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
	return destination
}

func Map(destination map[string]interface{}, arr ...string) map[string]interface{} {
	for _, val := range arr {
		destination[val] = true
	}
	return destination
}

func String(input map[string]interface{}, path ...string) string {
	match := Get(input, path...)
	if match == nil {
		return ""
	}
	return match.(string)
}

func Bool(input map[string]interface{}, path ...string) bool {
	match := Get(input, path...)
	if match == nil {
		return false
	}
	return match.(bool)
}

func Int(input map[string]interface{}, path ...string) int64 {
	match := Get(input, path...)
	if match == nil {
		return 0
	}
	if number, ok := match.(json.Number); ok {
		if i, err := number.Int64(); err == nil {
			return i
		}
		return 0
	}
	return match.(int64)
}

func Float(input map[string]interface{}, path ...string) float64 {
	match := Get(input, path...)
	if match == nil {
		return 0
	}
	if number, ok := match.(json.Number); ok {
		if float, err := number.Float64(); err == nil {
			return float
		}
		return 0
	}
	return match.(float64)
}

func Object(input map[string]interface{}, path ...string) map[string]interface{} {
	match := Get(input, path...)
	if match == nil {
		return map[string]interface{}{}
	}
	return match.(map[string]interface{})
}

func Time(input map[string]interface{}, path ...string) time.Time {
	match := String(input, path...)
	if match == "" {
		return time.Time{}
	}
	parsed, err := time.Parse(time.RFC3339, match)
	if err != nil {
		return time.Time{}
	}
	return parsed
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

func Clone(input map[string]interface{}) map[string]interface{} {
	result := Empty()
	Merge(result, input)
	return result
}

type Atom struct {
	Path  []string
	Value interface{}
}

func Flatten(input map[string]interface{}, path ...string) []*Atom {
	result := []*Atom{}
	for key, value := range input {
		next := append(path, key)
		match, ok := value.(map[string]interface{})
		if ok {
			result = append(result, Flatten(match, next...)...)
			continue
		}
		result = append(result, &Atom{
			Path:  next,
			Value: value,
		})
	}
	return result
}

func Primitives(input map[string]interface{}) map[string]interface{} {
	result := Build()
	for key, value := range input {
		if _, ok := value.(map[string]interface{}); ok {
			continue
		}
		result[key] = value
	}
	return result
}

func Delete(input map[string]interface{}, path ...string) {
	if len(path) == 0 {
		return
	}
	last := path[len(path)-1]
	match := Object(input, path[:len(path)-1]...)
	delete(match, last)
}
