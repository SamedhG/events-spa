defmodule EventsApiWeb.UserController do
  use EventsApiWeb, :controller

  alias EventsApi.Users
  alias EventsApi.Users.User
  alias EventsApi.Photos

  action_fallback EventsApiWeb.FallbackController

  def index(conn, _params) do
    users = Users.list_users()
    render(conn, "index.json", users: users)
  end

  def create(conn, %{"user" => user_params}) do
    with {:ok, %User{} = user} <- Users.create_user(user_params) do
      conn
      |> put_status(:created)
      |> put_resp_header("location", Routes.user_path(conn, :show, user))
      |> render("show.json", user: user)
    end
  end

  def show(conn, %{"id" => id}) do
    user = id 
           |> Users.get_user!
           |> Users.load_user
    render(conn, "show.json", user: user)
  end

  def update(conn, %{"id" => id, "user" => user_params}) do
    user = Users.get_user!(id)

    with {:ok, %User{} = user} <- Users.update_user(user, user_params) do
      render(conn, "show.json", user: Users.load_user(user))
    end
  end

  def delete(conn, %{"id" => id}) do
    user = Users.get_user!(id)

    with {:ok, %User{}} <- Users.delete_user(user) do
      send_resp(conn, :no_content, "")
    end
  end

  def photo(conn, %{"id" => id}) do
    user = Users.get_user!(id)
    {:ok, data, type} = Photos.load_photo(user.photo_id)
    conn
    |> put_resp_content_type(type)
    |> send_resp(200, data)
  end
end
