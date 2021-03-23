defmodule EventsApi.Events.Event do
  use Ecto.Schema
  import Ecto.Changeset

  schema "events" do
    field :date, :date
    field :description, :string
    field :time, :time
    field :title, :string

    field :num_yes, :integer, virtual: true, default: 0
    field :num_no, :integer, virtual: true, default: 0
    field :num_maybe, :integer, virtual: true, default: 0

    belongs_to :user, EventsApi.Users.User, foreign_key: :owner

    has_many :invites, EventsApi.Invites.Invite, foreign_key: :event_id 
    has_many :comments, EventsApi.Comments.Comment, foreign_key: :event_id

    timestamps()
  end

  @doc false
  def changeset(event, attrs) do
    event
    |> cast(attrs, [:title, :description, :date, :time, :owner])
    |> validate_required([:title, :description, :date, :time, :owner])
  end
end
