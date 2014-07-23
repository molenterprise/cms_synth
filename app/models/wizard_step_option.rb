class WizardStepOption < ActiveRecord::Base
  validates :message, length: { minimum:1, maximum: 140 }
  belongs_to :wizard_step
end
