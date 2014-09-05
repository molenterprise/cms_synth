require 'spec_helper'

describe "TJsonEntities" do
  describe "GET /t_json_entities" do
    it "works! (now write some real specs)" do
      # Run the generator again with the --webrat flag if you want to use webrat methods/matchers
      get t_json_entities_path
      response.status.should be(200)
    end
  end
end
