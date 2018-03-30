defmodule DynamicTest do
  use ExUnit.Case
  doctest Dynamic

  test "get" do
    input = %{
      a: %{
        b: 2
      }
    }
    assert Dynamic.get(input, [:a, :b]) === 2
    assert Dynamic.get(input, [:a, :c, :d]) === nil
    assert Dynamic.get(input, [:a, :c, :d], 5) === 5
  end

  test "get_list" do
    input = %{
      a: %{
        b: [3, 4, [%{ "deep" => true }]]
      }
    }
    assert Dynamic.get(input, [:a, :b, 0]) === 3
    assert Dynamic.get(input, [:a, :b, 3], 5) === 5
    assert Dynamic.get(input, [:a, :b, 2, 0, "deep"]) === true
  end


  test "put" do
    expected = %{}
    assert Dynamic.put(%{}, [:a, :b], 1) === %{a: %{b: 1}}
    assert Dynamic.put(%{}, [:a], 1) === %{a: 1}
  end

  test "delete" do
    input = %{a: %{b: 1}}
    assert Dynamic.delete(input, [:a, :b]) === %{a: %{}}
    assert Dynamic.delete(input, [:a, :c]) === input
  end

end
