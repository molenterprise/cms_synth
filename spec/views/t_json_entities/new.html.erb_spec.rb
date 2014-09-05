require 'spec_helper'

describe "t_json_entities/new" do
  before(:each) do
    assign(:t_json_entity, stub_model(TJsonEntity,
      :name => "MyString",
      :ontology_id => 1
    ).as_new_record)
  end

  it "renders new t_json_entity form" do
    render

    # Run the generator again with the --webrat flag if you want to use webrat matchers
    assert_select "form[action=?][method=?]", t_json_entities_path, "post" do
      assert_select "input#t_json_entity_name[name=?]", "t_json_entity[name]"
      assert_select "input#t_json_entity_ontology_id[name=?]", "t_json_entity[ontology_id]"
    end
  end
end
