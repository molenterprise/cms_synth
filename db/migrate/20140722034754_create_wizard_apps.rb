class CreateWizardApps < ActiveRecord::Migration
  def change
    create_table :wizard_apps do |t|
      t.string :name
      t.integer :ontology_id

      t.timestamps
    end
  end
end
