class WizardApp < ActiveRecord::Base
<<<<<<< HEAD
=======
  has_one :ontology
  validates :name, length: { minimum:3, maximum: 140 }
>>>>>>> 4b9f22ee6c1148ec779e4ab1efe50288b42963f2
end
