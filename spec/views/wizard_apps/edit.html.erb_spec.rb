require 'spec_helper'

describe "wizard_apps/edit" do
  before(:each) do
    @wizard_app = assign(:wizard_app, stub_model(WizardApp,
      :name => "MyString",
      :ontology_id => 1
    ))
  end

  it "renders the edit wizard_app form" do
    render

    # Run the generator again with the --webrat flag if you want to use webrat matchers
    assert_select "form[action=?][method=?]", wizard_app_path(@wizard_app), "post" do
      assert_select "input#wizard_app_name[name=?]", "wizard_app[name]"
      assert_select "input#wizard_app_ontology_id[name=?]", "wizard_app[ontology_id]"
    end
  end
end
