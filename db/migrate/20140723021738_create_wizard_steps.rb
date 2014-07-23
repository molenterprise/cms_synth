class CreateWizardSteps < ActiveRecord::Migration
  def change
    create_table :wizard_steps do |t|
      t.string :title

      t.timestamps
    end
  end
end
