require 'net/http'

class WizardAppsController < ApplicationController
  before_action :set_wizard_app, only: [:show, :edit, :update, :destroy]
  # GET /wizard_apps
  # GET /wizard_apps.json
  def index
    @wizard_apps = WizardApp.all
  end

  def wizard_definition
    file = File.join(Rails.root, 'app', 'assets', 'wizard_def', "#{params[:id]}.json")
    jfile = File.read(file)
    render :json => jfile
  end

  def generate_wizard
    uri = URI("http://localhost:3001/ontologies/wizard/#{params[:url]}")
    req = Net::HTTP.get(uri)

    render :json => req
  end

  def generate_app
    uri = URI("http://localhost:3001/applications/create_app")
    req = Net::HTTP.post_form(uri, 'application[name]' => 'test10')

    render :json => {:message => req.message, :code => req.code, :all => req, :body => req.body}
  end

  def generate_context
    uri = URI("http://localhost:3001/contexts/create_app")
    req = Net::HTTP.post_form(uri, 'context[context_name]' => 'Product1', 'context[context_title]' => 'Product Title', 'context[context_query]' => 'AUCTION::Produto.find_all')

    render :json => {:message => req.message, :code => req.code, :all => req, :body => req.body}
  end

  # GET /wizard_apps/1
  # GET /wizard_apps/1.json
  def show
    #ActiveRDF::Namespace.register(:swc, "http://data.semanticweb.org/ns/swc/ontology")

    excluded_namespaces = [:xsd, :rdf, :rdfs, :owl, :shdm, :swui, :symph, :void]
    @domain_classes = (RDFS::Class.find_all(options).reject{ |c| excluded_namespaces.include?(ActiveRDF::Namespace.prefix(c))  } +
    OWL::Class.find_all(options).reject{ |c| excluded_namespaces.include?(ActiveRDF::Namespace.prefix(c))  }).uniq

  end

  # GET /wizard_apps/new
  def new
    @wizard_app = WizardApp.new
  end

  # GET /wizard_apps/1/edit
  def edit
  end

  # POST /wizard_apps
  # POST /wizard_apps.json
  def create
    @wizard_app = WizardApp.new(wizard_app_params)

    if @wizard_app.save
      #redirect_to @wizard_app, notice: 'Wizard app was successfully created.'
      redirect_to controller: "wizard_step", action: "start", id: 1
    else
      render :new
    end
  end

  # PATCH/PUT /wizard_apps/1
  # PATCH/PUT /wizard_apps/1.json
  def update
    respond_to do |format|
      if @wizard_app.update(wizard_app_params)
        format.html { redirect_to @wizard_app, notice: 'Wizard app was successfully updated.' }
        format.json { render :show, status: :ok, location: @wizard_app }
      else
        format.html { render :edit }
        format.json { render json: @wizard_app.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /wizard_apps/1
  # DELETE /wizard_apps/1.json
  def destroy
    @wizard_app.destroy
    respond_to do |format|
      format.html { redirect_to wizard_apps_url, notice: 'Wizard app was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private

  # Use callbacks to share common setup or constraints between actions.
  def set_wizard_app
    @wizard_app = WizardApp.find(params[:id])
  end

  # Never trust parameters from the scary internet, only allow the white list through.
  def wizard_app_params
    params.require(:wizard_app).permit(:name, :ontology_id)
  end
end
