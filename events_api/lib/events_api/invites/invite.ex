defmodule EventsApi.Invites.Invite do
  use Ecto.Schema
  import Ecto.Changeset

  schema "invites" do
    field :response, :string

    belongs_to :event, EventsApi.Events.Event
    belongs_to :user, EventsApi.Users.User, references: :email, foreign_key: :email, type: :string

    timestamps()
  end

  @doc false
  def changeset(invite, attrs) do
    invite
    |> cast(attrs, [:email, :response, :event_id])
    |> validate_required([:email, :response, :event_id])
    |> unique_constraint([:email, :event_id])
  end
end
