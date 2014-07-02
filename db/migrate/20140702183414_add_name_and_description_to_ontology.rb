class AddNameAndDescriptionToOntology < ActiveRecord::Migration
  def change
    add_column :ontologies, :name, :string
    add_column :ontologies, :description, :text
  end
end
