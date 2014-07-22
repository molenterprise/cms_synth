require "spec_helper"

describe WizardAppsController do
  describe "routing" do

    it "routes to #index" do
      get("/wizard_apps").should route_to("wizard_apps#index")
    end

    it "routes to #new" do
      get("/wizard_apps/new").should route_to("wizard_apps#new")
    end

    it "routes to #show" do
      get("/wizard_apps/1").should route_to("wizard_apps#show", :id => "1")
    end

    it "routes to #edit" do
      get("/wizard_apps/1/edit").should route_to("wizard_apps#edit", :id => "1")
    end

    it "routes to #create" do
      post("/wizard_apps").should route_to("wizard_apps#create")
    end

    it "routes to #update" do
      put("/wizard_apps/1").should route_to("wizard_apps#update", :id => "1")
    end

    it "routes to #destroy" do
      delete("/wizard_apps/1").should route_to("wizard_apps#destroy", :id => "1")
    end

  end
end
