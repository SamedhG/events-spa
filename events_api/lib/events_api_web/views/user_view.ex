defmodule EventsApiWeb.UserView do
  use EventsApiWeb, :view

  alias EventsApiWeb.UserView
  alias EventsApiWeb.EventView

  def render("index.json", %{users: users}) do
    %{data: render_many(users, UserView, "user.json")}
  end

  def render("show.json", %{user: user}) do
    %{data: render_one(user, UserView, "user_full.json")}
  end

  def render("user.json", %{user: user}) do
    %{id: user.id,
      name: user.name,
      email: user.email
    }
  end

  def render("user_full.json", %{user: user}) do
    %{
      id: user.id,
      name: user.name,
      email: user.email,
      invites: render_many(user.invites, EventView, "event.json"),
      events: render_many(user.events, EventView, "event.json")
    }
  end
end
