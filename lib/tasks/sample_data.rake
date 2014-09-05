namespace :db do
  desc "Fill database with sample data"
  task populate: :environment do
    make_ontologies
    make_wizard
    make_json
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
  @wizardStep1 = WizardStep.create!(title: "What do you want to do?")
  @wizardStep2 = WizardStep.create!(title: "And now. What else?", back: @wizardStep1)
  @reallyStep = WizardStep.create!(title: "Are you sure?", back: @wizardStep2)
  
  WizardStepOption.create!(message: "Option 1", wizard_step: @wizardStep1, next_wizard_step: @wizardStep1)
  WizardStepOption.create!(message: "Option 2", wizard_step: @wizardStep1, next_wizard_step: @wizardStep1)
  WizardStepOption.create!(message: "Option 3", wizard_step: @wizardStep1, next_wizard_step: @reallyStep)
  WizardStepOption.create!(message: "Option 4", wizard_step: @wizardStep2, next_wizard_step: @reallyStep)
  WizardStepOption.create!(message: "Option 5", wizard_step: @wizardStep2, next_wizard_step: @reallyStep)
  WizardStepOption.create!(message: "Option 6", wizard_step: @wizardStep2, next_wizard_step: @reallyStep)
  WizardStepOption.create!(message: "Yes", wizard_step: @reallyStep, next_wizard_step: @wizardStep1)
  WizardStepOption.create!(message: "No", wizard_step: @reallyStep, next_wizard_step: @wizardStep2)
end


def make_json
  TJsonEntity.create(name: "abc")
  TJsonEntity.create(name: "def")
end