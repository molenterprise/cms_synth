class WizardStep < ActiveRecord::Base
  validates :title, length: { minimum:3, maximum: 140 }
  has_many :wizard_step_options
  has_one :back, foreign_key: "back", class_name:  "WizardStep"
end
