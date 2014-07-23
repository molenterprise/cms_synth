class AddNextWizardStepIdToWizardStepOptions < ActiveRecord::Migration
  def change
    add_column :wizard_step_options, :next_wizard_step_id, :integer
  end
end
