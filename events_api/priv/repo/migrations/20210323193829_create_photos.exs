defmodule EventsApi.Repo.Migrations.CreatePhotos do
  use Ecto.Migration

  def change do
    create table(:photos) do
      add :hash, :text
      add :refs, :integer
      add :type, :string

      timestamps()
    end

  end
end
