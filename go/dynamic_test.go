package dynamic

import "testing"

func TestMerge(t *testing.T) {
	destination := map[string]interface{}{
		"a": "hello",
		"b": map[string]interface{}{
			"nice": "ok",
		},
	}
	source := map[string]interface{}{
		"a": "nice",
		"b": map[string]interface{}{
			"cool": "wow",
		},
		"c": map[string]interface{}{
			"me": "too",
		},
	}
	Merge(destination, source)
	if Get(destination, "a") != "nice" {
		t.Fatal("Failed to merge field")
	}
	if Get(destination, "b", "cool") != "wow" {
		t.Fatal("Failed to merge object")
	}
	if Get(destination, "c", "me") != "too" {
		t.Fatal("Failed to create object")
	}
}

func TestFlatten(t *testing.T) {
	var input = Build(
		"userData", Build(
			"53a47c882d9a41612340e6e8", Build(
				"settings", Build(
					"language", "en",
					"privacy", Build(
						"search", true,
					),
					"push", Build(
						"broadcast", true,
						"contact", Build(
							"join", true,
						),
						"preview", false,
					),
				),
			),
		),
	)
	for _, v := range Flatten(input) {
		if Get(input, v.Path...) != v.Value {
			t.Fatal()
		}
	}
}
