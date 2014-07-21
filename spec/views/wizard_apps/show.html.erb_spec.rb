require 'spec_helper'

describe "wizard_apps/show" do
  before(:each) do
    @wizard_app = assign(:wizard_app, stub_model(WizardApp,
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
