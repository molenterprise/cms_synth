class AddBackToWizardStep < ActiveRecord::Migration
  def change
    add_column :wizard_steps, :back, :integer
  end
end
