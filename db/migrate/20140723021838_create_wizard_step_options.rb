class CreateWizardStepOptions < ActiveRecord::Migration
  def change
    create_table :wizard_step_options do |t|
      t.string :message
      t.integer :wizard_step_id
      
      t.timestamps
    end
  end
end
