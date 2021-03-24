defmodule EventsApiWeb.EventView do
  use EventsApiWeb, :view

  alias EventsApiWeb.UserView
  alias EventsApiWeb.EventView
  alias EventsApi.Events.Event
  alias EventsApi.Invites.Invite

  def render("index.json", %{events: events}) do
    %{data: render_many(events, EventView, "event.json")}
  end

  def render("show.json", %{event: event}) do
    %{data: render_one(event, EventView, "event.json")}
  end

  def render("event.json", %{event: %Event{} = event}) do
    %{id: event.id,
      title: event.title,
      description: event.description,
      date: event.date,
      time: event.time,
      owner:  render_one(event.user, UserView, "user.json")
    }
  end

  def render("event.json", %{event: %Invite{event: event}}) do
    render("event.json", %{event: event})
  end
end
