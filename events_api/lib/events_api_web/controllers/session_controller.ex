defmodule EventsApiWeb.SessionController do
  use EventsApiWeb, :controller

  def create(conn, %{"email" => email, "password" => password}) do
    user = EventsApi.Users.authenticate(email, password)

    if user do
      sess = %{
        user_id: user.id,
        name: user.name,
        email: user.email,
        token: Phoenix.Token.sign(conn, "user_id", user.id)
      }
      conn
      |> put_resp_header(
        "content-type",
        "application/json; charset=UTF-8")
        |> send_resp(:created, Jason.encode!(%{session: sess}))
    else
      conn
      |> put_resp_header("content-type", "application/json; charset=UTF-8")
      |> send_resp(:unauthorized, Jason.encode!(%{error: "Unable to login"}))
    end
  end
end
