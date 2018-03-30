defmodule Dynamic do
  @moduledoc """
    Provides useful tooling when manipulating complex maps
  """

  @doc """
  Gets value at path or falls back

  ## Examples
      iex> Dynamic.get(%{a: %{b: 1}}, [:a, :b])
      1
  """
  @spec get(map, Enumerable.t()) :: any
  def get(input, path) do
    get(input, path, nil, nil)
  end

  @doc ~S"""
  Gets value at path or falls back

  ## Examples
      iex> Dynamic.get(%{a: %{b: 1}}, [:a, :b, :c], :foo)
      :foo
  """
  def get(input, path, fallback) do
    get(input, path, fallback, nil)
  end

  defp get(input, [], fallback, compare) do
    input
    |> default(fallback, compare)
  end

  defp get(input, [head], fallback, compare) when is_list(input) and is_integer(head) do
    input
    |> Enum.at(head)
    |> default(fallback, compare)
  end

  defp get(input, [head], fallback, compare) do
    input
    |> Access.get(head)
    |> default(fallback, compare)
  end

  defp get(input, [head | tail], fallback, compare) when is_list(input) and is_integer(head) do
    case Enum.at(input, head) do
      result when is_map(result) or is_list(result) ->
        get(result, tail, fallback, compare)

      _ ->
        fallback
    end
  end

  defp get(input, [head | tail], fallback, compare) do
    case Access.get(input, head) do
      result when is_map(result) or is_list(result) ->
        get(result, tail, fallback, compare)

      _ ->
        fallback
    end
  end

  @doc ~S"""
  Default to fallback if input is nil

  ## Examples
      iex> Dynamic.default(nil, :foo)
      :foo
  """
  def default(input, fallback), do: default(input, fallback, nil)

  @doc """
  Defaults to fallback if input is compare

  ## Examples
      iex> Dynamic.default(:bar, :foo, :bar)
      :foo
  """
  def default(input, fallback, compare) when input == compare, do: fallback

  def default(input, _compare, _default), do: input

  @doc ~S"""
  Set the value at the given path

  ## Example
      iex> Dynamic.put(%{}, [:a, :b, :c], :foo)
      %{a: %{b: %{c: :foo}}}
  """
  def put(_input, [], value), do: value
  def put(input, [head], value), do: Kernel.put_in(input, [head], value)

  def put(input, [head | tail], value) do
    child =
      case Access.get(input, head) do
        result when is_map(result) -> result
        _ -> %{}
      end

    put(input, [head], put(child, tail, value))
  end

  @doc ~S"""
  Delete the value at the given path

  ## Examples
      iex> Dynamic.put(%{}, [:a, :b, :c], :foo)
      %{a: %{b: %{c: :foo}}}
  """
  def delete(input, [head]) do
    {_, result} = Kernel.pop_in(input, [head])
    result
  end

  def delete(input, [head | tail]) do
    case Access.get(input, head) do
      result when is_map(result) -> put(input, [head], delete(result, tail))
      _ -> input
    end
  end

  @doc ~S"""
  Deep merge the right argument into the left

  ## Examples
      iex> Dynamic.combine(%{a: 1}, %{b: 1})
      %{a: 1, b: 1}
  """
  def combine(left, right), do: Map.merge(left, right, &combine/3)
  defp combine(_key, left = %{}, right = %{}), do: combine(left, right)
  defp combine(_key, _left, right), do: right

  def flatten(input, path \\ []) do
    input
    |> Enum.flat_map(fn {key, value} ->
      full = [key | path]
      if is_map(value), do: flatten(value, full), else: [{Enum.reverse(full), value}]
    end)
  end

  @doc ~S"""
  Traverses map recursively and returns every child map and its path
  ## Examples
      iex> Dynamic.layers(%{a: 1, child: %{b: 1}})
      [
        {
          [],
          %{a: 1, child: %{b: 1}}
        },
        {
          [:child],
          %{b: 1}
        }
      ]
  """
  def layers(input, path \\ []) do
    if is_map(input) do
      [
        {Enum.reverse(path), input}
        | Enum.flat_map(input, fn {key, value} ->
            layers(value, [key | path])
          end)
      ]
    else
      []
    end
  end

  @doc """
  Returns input stripped of child maps

  ## Examples
      iex> Dynamic.primitives(%{a: 1, child: %{b: 1}})
      %{a: 1}
  """
  def primitives(input) do
    input
    |> Stream.filter(fn {_key, value} -> !is_map(value) end)
    |> Enum.into(%{})
  end

  def atom_keys(input), do: for({key, val} <- input, into: %{}, do: {String.to_atom(key), val})
  def string_keys(input), do: for({key, val} <- input, into: %{}, do: {Atom.to_string(key), val})
end
