require "spec_helper"

describe TJsonEntitiesController do
  describe "routing" do

    it "routes to #index" do
      get("/t_json_entities").should route_to("t_json_entities#index")
    end

    it "routes to #new" do
      get("/t_json_entities/new").should route_to("t_json_entities#new")
    end

    it "routes to #show" do
      get("/t_json_entities/1").should route_to("t_json_entities#show", :id => "1")
    end

    it "routes to #edit" do
      get("/t_json_entities/1/edit").should route_to("t_json_entities#edit", :id => "1")
    end

    it "routes to #create" do
      post("/t_json_entities").should route_to("t_json_entities#create")
    end

    it "routes to #update" do
      put("/t_json_entities/1").should route_to("t_json_entities#update", :id => "1")
    end

    it "routes to #destroy" do
      delete("/t_json_entities/1").should route_to("t_json_entities#destroy", :id => "1")
    end

  end
end
