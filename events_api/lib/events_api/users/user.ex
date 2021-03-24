defmodule EventsApi.Users.User do
  use Ecto.Schema
  import Ecto.Changeset

  schema "users" do
    field :email, :string
    field :name, :string
    field :password_hash, :string

    belongs_to :photo, EventsApi.Photos.Photo
    has_many :events, EventsApi.Events.Event, foreign_key: :owner
    has_many :invites, EventsApi.Invites.Invite, foreign_key: :email, references: :email
    has_many :comments, EventsApi.Comments.Comment

    timestamps()
  end

  @doc false
  def changeset(user, attrs) do
    user
    |> cast(attrs, [:name, :email, :password_hash, :photo_id])
    |> add_password_hash(attrs["password"])
    |> validate_required([:name, :email, :password_hash])
    |> unique_constraint(:email)
  end

  def add_password_hash(cset, nil) do
    cset
  end

  def add_password_hash(cset, password) do
    change(cset, Argon2.add_hash(password))
  end
end
