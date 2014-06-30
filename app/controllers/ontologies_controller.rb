class OntologiesController < ApplicationController
  
  def index
    @ontologies = Ontology.all
  end
  
  def new
    @ontology = Ontology.new
  end
  
  def create
    @ontology = Ontology.new(user_params)
    if @ontology.save
      flash[:success] = "Ontology created!"
      redirect_to @ontology
    else
      render 'new'
    end
  end
  
  def edit
    @ontology = Ontology.find(params[:id])
  end

  def update
    @ontology = Ontology.find(params[:id])
    if @ontology.update_attributes(user_params)
      flash[:success] = "Ontology updated"
      @ontologies = Ontology.new
      redirect_to @ontologies
    else
      render 'edit'
    end
  end
  
  private

    def user_params
      params.require(:ontology).permit(:prefix, :address)
    end
end