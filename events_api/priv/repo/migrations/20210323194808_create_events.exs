defmodule EventsApi.Repo.Migrations.CreateEvents do
  use Ecto.Migration

  def change do
    create table(:events) do
      add :title, :string, null: false
      add :description, :string, null: false, default: ""
      add :date, :date, null: false
      add :time, :time, null: false
      add :owner, references(:users, on_delete: :nothing), null: false

      timestamps()
    end

    create index(:events, [:owner])
  end
end
