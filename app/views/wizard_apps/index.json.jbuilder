json.array!(@wizard_apps) do |wizard_app|
  json.extract! wizard_app, :id, :name, :ontology_id
  json.url wizard_app_url(wizard_app, format: :json)
end
