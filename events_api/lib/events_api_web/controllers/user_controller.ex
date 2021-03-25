defmodule EventsApiWeb.UserController do
  use EventsApiWeb, :controller

  alias EventsApi.Users
  alias EventsApi.Users.User
  alias EventsApi.Photos
  alias EventsApiWeb.Plugs

  action_fallback EventsApiWeb.FallbackController

  plug Plugs.RequireAuth when action in [:update]
  plug :require_owner when action in [:update]

  def require_owner(conn, _args) do
    {id, _} = Integer.parse(conn.params["id"])
    curr_user = conn.assigns[:current_user]
    if curr_user.id == id do
      conn
    else
      conn
      |> put_flash(:error, "That isn't yours.")
      |> redirect(to: Routes.page_path(conn, :index))
      |> halt()
    end
  end

  def index(conn, _params) do
    users = Users.list_users()
    render(conn, "index.json", users: users)
  end

  def create(conn, %{"user" => user_params}) do
    user_params = add_photo_to_user(user_params)
    with {:ok, %User{} = user} <- Users.create_user(user_params) do
      conn
      |> put_status(:created)
      |> put_resp_header("location", Routes.user_path(conn, :show, user))
      |> render("base.json", user: user)
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
      render(conn, "base.json", user: Users.load_user(user))
    end
  end

  def photo(conn, %{"id" => id}) do
    user = Users.get_user!(id)
    {:ok, data, type} = Photos.load_photo(user.photo_id)
    conn
    |> put_resp_content_type(type)
    |> send_resp(200, data)
  end

  defp add_photo_to_user(user_params) do
    up = user_params["photo"]
    if up == nil || up === "undefined" do
      user_params
    else
      # TODO: check if the type is a valid image type?
      {:ok, photo} = Photos.save_photo(up.path, up.content_type)
      Map.put user_params, "photo_id", photo.id
    end
  end
end
