namespace :db do
  desc "Fill database with sample data"
  task populate: :environment do
    #make_ontologies
    make_wizard
  end
end

def make_ontologies
  Ontology.create!(prefix: "foaf",
               address:"http://xmlns.com/foaf/0.1/",
               name: "FOAF",
               description: "No description")

  Ontology.create!(prefix: "skos",
               address:"http://www.w3.org/2004/02/skos/core#",
               name: "SKOS")

  Ontology.create!(prefix: "swc",
               address:"http://data.semanticweb.org/ns/swc/ontology#",
               name: "SWC")
end

def make_wizard
  @wizardStep = WizardStep.create!(title: "What do you want to do?")
  
  @reallyStep = WizardStep.create!(title: "Confirm", back: @wizardStep)
  
  WizardStepOption.create!(message: "Option 1", wizard_step: @wizardStep, next_wizard_step_id: @reallyStep.id)
  
  WizardStepOption.create!(message: "Option 2", wizard_step: @wizardStep, next_wizard_step_id: @reallyStep.id)
  
  WizardStepOption.create!(message: "Option 3", wizard_step: @wizardStep, next_wizard_step_id: @reallyStep.id)
  
  WizardStepOption.create!(message: "Really?", wizard_step: @reallyStep, next_wizard_step_id: @wizardStep.id)
end
