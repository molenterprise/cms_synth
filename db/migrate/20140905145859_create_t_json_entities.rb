class CreateTJsonEntities < ActiveRecord::Migration
  def change
    create_table :t_json_entities do |t|
      t.string :name
      t.integer :ontology_id

      t.timestamps
    end
  end
end
