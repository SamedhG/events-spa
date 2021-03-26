defmodule EventsApiWeb.EventController do
  use EventsApiWeb, :controller

  alias EventsApi.Events
  alias EventsApi.Events.Event
  alias EventsApiWeb.Plugs
  action_fallback EventsApiWeb.FallbackController

  plug Plugs.RequireAuth when action in [:create, :update]
    


  def create(conn, %{"event" => event_params}) do
    current_user = conn.assigns[:current_user]
    event_params = Map.put(event_params, "owner", current_user.id)
    with {:ok, %Event{} = event} <- Events.create_event(event_params) do
      conn
      |> put_status(:created)
      |> put_resp_header("location", Routes.event_path(conn, :show, event))
      |> render("base.json", event: event)
    end
  end

  def show(conn, %{"id" => id}) do
    event = id |> Events.get_event! |> Events.load_event
    render(conn, "show.json", event: event)
  end

  def update(conn, %{"id" => id, "event" => event_params}) do
    event = Events.get_event!(id)

    current_user = conn.assigns[:current_user]
    if current_user.id != event.owner do
      conn  
      |> send_resp(:unprocessable_entity, Jason.encode!(%{"error" => "Not allowed"}))
    else 
      with {:ok, %Event{} = event} <- Events.update_event(event, event_params) do
        render(conn, "base.json", event: event)
      end
    end
  end
end
