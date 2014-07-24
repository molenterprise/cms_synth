class WizardStep < ActiveRecord::Base
  validates :title, length: { minimum:3, maximum: 140 }
  has_many :wizard_step_options
  belongs_to :back, foreign_key: "back", class_name:  "WizardStep"
end
