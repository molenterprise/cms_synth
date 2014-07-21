require 'spec_helper'

describe "wizard_apps/new" do
  before(:each) do
    assign(:wizard_app, stub_model(WizardApp,
      :name => "MyString",
      :ontology_id => 1
    ).as_new_record)
  end

  it "renders new wizard_app form" do
    render

    # Run the generator again with the --webrat flag if you want to use webrat matchers
    assert_select "form[action=?][method=?]", wizard_apps_path, "post" do
      assert_select "input#wizard_app_name[name=?]", "wizard_app[name]"
      assert_select "input#wizard_app_ontology_id[name=?]", "wizard_app[ontology_id]"
    end
  end
end
