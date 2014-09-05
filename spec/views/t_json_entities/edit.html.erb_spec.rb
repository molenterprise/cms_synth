require 'spec_helper'

describe "t_json_entities/edit" do
  before(:each) do
    @t_json_entity = assign(:t_json_entity, stub_model(TJsonEntity,
      :name => "MyString",
      :ontology_id => 1
    ))
  end

  it "renders the edit t_json_entity form" do
    render

    # Run the generator again with the --webrat flag if you want to use webrat matchers
    assert_select "form[action=?][method=?]", t_json_entity_path(@t_json_entity), "post" do
      assert_select "input#t_json_entity_name[name=?]", "t_json_entity[name]"
      assert_select "input#t_json_entity_ontology_id[name=?]", "t_json_entity[ontology_id]"
    end
  end
end
