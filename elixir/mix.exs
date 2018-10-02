defmodule Dynamic.Mixfile do
  use Mix.Project

  def project do
    [
      app: :dynamic,
      description: "Easily manipulate complex maps",
      package: [
        maintainers: ["ironbay"],
        licenses: ["MIT"],
        links: %{"GitHub" => "https://github.com/ironbay/dynamic"}
      ],
      version: "0.1.1",
      elixir: "~> 1.5",
      start_permanent: Mix.env() == :prod,
      deps: deps()
    ]
  end

  # Run "mix help compile.app" to learn about applications.
  def application do
    [
      extra_applications: [:logger]
    ]
  end

  # Run "mix help deps" to learn about dependencies.
  defp deps do
    [
      # {:dep_from_hexpm, "~> 0.3.0"},
      # {:dep_from_git, git: "https://github.com/elixir-lang/my_dep.git", tag: "0.1.0"},
      {:ex_doc, ">= 0.0.0", only: :dev}
    ]
  end
end
