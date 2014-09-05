require 'spec_helper'

describe "t_json_entities/index" do
  before(:each) do
    assign(:t_json_entities, [
      stub_model(TJsonEntity,
        :name => "Name",
        :ontology_id => 1
      ),
      stub_model(TJsonEntity,
        :name => "Name",
        :ontology_id => 1
      )
    ])
  end

  it "renders a list of t_json_entities" do
    render
    # Run the generator again with the --webrat flag if you want to use webrat matchers
    assert_select "tr>td", :text => "Name".to_s, :count => 2
    assert_select "tr>td", :text => 1.to_s, :count => 2
  end
end
