defmodule EventsApiWeb.CommentController do
  use EventsApiWeb, :controller

  alias EventsApi.Comments
  alias EventsApi.Events
  alias EventsApi.Comments.Comment
  alias EventsApiWeb.Plugs

  plug Plugs.RequireAuth when action in [:create, :delete]

  action_fallback EventsApiWeb.FallbackController

  def create(conn, %{"comment" => comment_params}) do
    user = conn.assigns[:current_user]
    event = comment_params
            |> Map.get("event_id")
            |> Events.get_event!
            |> Events.load_event

    invited? = Enum.reduce(event.invites, false, &(&2 || &1.email == user.email))
    if user.id != event.owner && !invited? do
      conn  
      |> send_resp(:unprocessable_entity, Jason.encode!(%{"error" => "Not allowed"}))
    else 
      with {:ok, %Comment{} = comment} <- Comments.create_comment(Map.put(comment_params, "user_id", user.id)) do
        conn
        |> put_status(:created)
        |> put_resp_header("location", Routes.comment_path(conn, :show, comment))
        |> send_resp(:ok, "{}")
      end
    end
  end


  def delete(conn, %{"id" => id}) do
    comment = Comments.get_comment!(id)
    user = conn.assigns[:current_user]
    event = Events.get_event!(comment.event_id)
    if user.id != event.owner && user.id != comment.user_id do
      send_resp(conn, :unprocessable_entity, "Not Allowed")
    else 
      event = comment.event_id
              |> Events.get_event!
              |> Events.load_event
      with {:ok, %Comment{}} <- Comments.delete_comment(comment) do
        send_resp(conn, :no_content, "")
      end
    end
  end
end
