# This file is responsible for configuring your application
# and its dependencies with the aid of the Mix.Config module.
#
# This configuration file is loaded before any dependency and
# is restricted to this project.

# General application configuration
use Mix.Config

config :events_api,
  ecto_repos: [EventsApi.Repo]

# Configures the endpoint
config :events_api, EventsApiWeb.Endpoint,
  url: [host: "localhost"],
  secret_key_base: "bljDYzBP5aU7VdkL0+xD+AL8psTR/x7J+7meR3fBkcP2TQQXzvNmTyaugDuuqJdM",
  render_errors: [view: EventsApiWeb.ErrorView, accepts: ~w(html json), layout: false],
  pubsub_server: EventsApi.PubSub,
  live_view: [signing_salt: "Q3CFF4WJ"]

# Configures Elixir's Logger
config :logger, :console,
  format: "$time $metadata[$level] $message\n",
  metadata: [:request_id]

# Use Jason for JSON parsing in Phoenix
config :phoenix, :json_library, Jason

# Import environment specific config. This must remain at the bottom
# of this file so it overrides the configuration defined above.
import_config "#{Mix.env()}.exs"
