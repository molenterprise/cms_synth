json.array!(@t_json_entities) do |t_json_entity|
  json.extract! t_json_entity, :id, :name, :ontology_id
  json.url t_json_entity_url(t_json_entity, format: :json)
end
