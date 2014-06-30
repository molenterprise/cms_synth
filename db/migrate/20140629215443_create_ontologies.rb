class CreateOntologies < ActiveRecord::Migration
  def change
    create_table :ontologies do |t|
      t.string :prefix
      t.string :address

      t.timestamps
    end
    
    add_index :ontologies, :prefix, unique: true
  end
end
