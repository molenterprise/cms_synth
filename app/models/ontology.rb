class Ontology < ActiveRecord::Base
  validates :prefix, presence: true, length: { maximum: 5, minimum: 2},
            uniqueness: { case_sensitive: false }
  validates :address, presence: true
  
  before_save { self.address = address.downcase }
end
