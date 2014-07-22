require 'spec_helper'

describe "wizard_apps/index" do
  before(:each) do
    assign(:wizard_apps, [
      stub_model(WizardApp,
        :name => "Name",
        :ontology_id => 1
      ),
      stub_model(WizardApp,
        :name => "Name",
        :ontology_id => 1
      )
    ])
  end

  it "renders a list of wizard_apps" do
    render
    # Run the generator again with the --webrat flag if you want to use webrat matchers
    assert_select "tr>td", :text => "Name".to_s, :count => 2
    assert_select "tr>td", :text => 1.to_s, :count => 2
  end
end
