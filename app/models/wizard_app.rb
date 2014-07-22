class WizardApp < ActiveRecord::Base
  has_one :ontology
  validates :name, length: { minimum:3, maximum: 140 }
end
