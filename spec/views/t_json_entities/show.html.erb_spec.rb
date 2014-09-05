require 'spec_helper'

describe "t_json_entities/show" do
  before(:each) do
    @t_json_entity = assign(:t_json_entity, stub_model(TJsonEntity,
      :name => "Name",
      :ontology_id => 1
    ))
  end

  it "renders attributes in <p>" do
    render
    # Run the generator again with the --webrat flag if you want to use webrat matchers
    rendered.should match(/Name/)
    rendered.should match(/1/)
  end
end
