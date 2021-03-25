defmodule EventsApiWeb.InviteController do
  use EventsApiWeb, :controller

  alias EventsApi.Invites
  alias EventsApi.Invites.Invite
  alias EventsApi.Events
  action_fallback EventsApiWeb.FallbackController

  alias EventsApiWeb.Plugs
  
  plug Plugs.RequireAuth

  def create(conn, %{"event_id" => event_id, "email" => email}) do
    IO.inspect "called"
    owner = Events.get_event!(event_id).owner
    curr_id = conn.assigns[:current_user].id
    if curr_id != owner do
      send_resp(conn, :error, Jason.encode!(%{error: "Failed"}))
    else 
      invite_params = %{
        event_id: event_id, 
        email: email, 
        response: "maybe"
      }
      with {:ok, %Invite{} = invite} <- Invites.create_invite(invite_params) do
        conn
        |> put_status(:created)
        |> put_resp_header("location", Routes.invite_path(conn, :show, invite))
        |> render("show.json", invite: invite)
      end
    end
  end

  def update(conn, %{"event_id" => event_id, "response" => response}) do
    curr_email = conn.assigns[:current_user].email
    invite = event_id
             |> Events.get_event!
             |> Events.load_event
             |> Map.get(:invites)
             |> Enum.find(nil, &(&1.email == curr_email))
    invite_params = %{response: response}
    with {:ok, %Invite{} = invite} <- Invites.update_invite(invite, invite_params) do
      render(conn, "show.json", invite: invite)
    end
  end











end
