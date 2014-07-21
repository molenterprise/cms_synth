namespace :db do
  desc "Fill database with sample data"
  task populate: :environment do
    make_ontologies
  end
end

def make_ontologies
  Ontology.create!(prefix: "foaf",
               address:"http://xmlns.com/foaf/0.1/",
               name:"FOAF",
               description:"No description")
               
  Ontology.create!(prefix: "skos",
               address:"http://www.w3.org/2004/02/skos/core#",
               name:"SKOS")
               
  Ontology.create!(prefix: "swc",
               address:"http://data.semanticweb.org/ns/swc/ontology#",
               name:"SWC")
end
