defmodule Dynamic.Macros do
  defmacro get(funs) when is_list(funs) do
    funs
    |> Enum.map(fn fun ->
      quote do
        get(unquote(fun))
      end
    end)
  end

  defmacro get(fun) do
    quote do
      get(unquote(fun), Atom.to_string(unquote(fun)))
    end
  end

  defmacro get(fun, cb) when is_function(cb) do
    quote do
      get(unquote(fun), Atom.to_string(unquote(fun)), unquote(cb))
    end
  end

  defmacro get(fun, path) do
    quote do
      get(unquote(fun), unquote(path), & &1)
    end
  end

  defmacro get(fun, path, cb) when is_list(path) === false do
    quote do
      get(unquote(fun), [unquote(path)], unquote(cb))
    end
  end

  defmacro get(fun, path, cb) do
    quote do
      def unquote(fun)(input) do
        result =
          input
          |> Dynamic.get(unquote(path))

        unquote(cb).(result)
      end
    end
  end

  defmacro __using__(_opts) do
    quote do
      import Dynamic.Macros

      def pull(input, fields) do
        fields
        |> Enum.map(&apply(__MODULE__, &1, [input]))
      end
    end
  end
end

defmodule Dynamic.Example do
  use Dynamic.Macros

  get(:key)
  get(:nice)

  @sample %{"key" => "key", "nice" => "nice"}

  def test do
    [key, nice] = Dynamic.Example.pull(@sample, [:key, :nice])
  end
end
