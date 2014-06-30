require 'spec_helper'

describe Ontology do

  before do
    @ontology = Ontology.new(prefix: "foaf", address: "http://xmlns.com/foaf/0.1/")
  end

  subject { @ontology }

  it { should respond_to(:prefix) }
  it { should respond_to(:address) }

  it { should be_valid }

  describe "when prefix is not present" do
    before { @ontology.prefix = " " }
    it { should_not be_valid }
  end

  describe "when address is not present" do
    before { @ontology.address = " " }
    it { should_not be_valid }
  end
  
  describe "when prefix is too short" do
    before { @ontology.prefix = "a" }
    it { should_not be_valid }
  end

  describe "when prefix is too long" do
    before { @ontology.prefix = "a" * 6 }
    it { should_not be_valid }
  end
  
  describe "when prefix is already taken" do
    before do
      ontology_with_same_prefix = @ontology.dup
      ontology_with_same_prefix.save
    end

    it { should_not be_valid }
  end
end
