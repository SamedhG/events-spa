defmodule EventsApi.Repo.Migrations.CreateUsers do
  use Ecto.Migration

  def change do
    create table(:users) do
      add :name, :string, null: false
      add :email, :string, null: false
      add :password_hash, :string, null: false
      add :photo_id, references(:photos, on_delete: :nothing)

      timestamps()
    end

    create index(:users, [:photo_id])
    create unique_index(:users, [:email])
  end
end
