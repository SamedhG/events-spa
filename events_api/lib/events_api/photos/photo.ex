defmodule EventsApi.Photos.Photo do
  use Ecto.Schema
  import Ecto.Changeset

  schema "photos" do
    field :hash, :string
    field :refs, :integer
    field :type, :string

    timestamps()
  end

  @doc false
  def changeset(photo, attrs) do
    photo
    |> cast(attrs, [:hash, :refs, :type])
    |> validate_required([:hash, :refs, :type])
  end
end
