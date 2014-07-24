class WizardStepOption < ActiveRecord::Base
  validates :message, length: { minimum:1, maximum: 140 }
  
  belongs_to :wizard_step            
  belongs_to :next_wizard_step,
              :class_name =>  "WizardStep",
              :foreign_key => :next_wizard_step_id
end
