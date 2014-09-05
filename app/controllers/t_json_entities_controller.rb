class TJsonEntitiesController < ApplicationController
  before_action :set_t_json_entity, only: [:show, :edit, :update, :destroy]

  # GET /t_json_entities
  # GET /t_json_entities.json
  def index
    @t_json_entities = TJsonEntity.all
  end

  # GET /t_json_entities/1
  # GET /t_json_entities/1.json
  def show
    render :json => [
    {
      id: 1,
      title: 'Red',
      type: 'radioDetail',
      message: 'Wizard 1',
      options: [
        {key: 0, text:"Red", next: 1},{key: 1, text:"Blue", next: 2} 
      ],
      details:
        [
        {
          title: 'what do you want to choose?',
          items: [
            [{type: 'img', msg: "/assets/checkbox-checked.png"}, {type: 'text', msg: "Option 1.1"}, {type: 'text', msg: "Option 1.2"}],
            [{type: 'img', msg: "/assets/checkbox.png"}, {type: 'text', msg: "Option 2.1"}, {type: 'text', msg: "Option 2.2"}],
            [{type: 'img', msg: "/assets/checkbox-checked.png"}, {type: 'text', msg: "Option 3.1"}, {type: 'text', msg: "Option 3.2"}]
          ]
        },
        {
          title: 'what do you want to choose?',
          items: [
            [{type: 'text', msg: "Property 1 Property 2"}],
            [{type: 'text', msg: "Property 3 Property 4"}],
            [{type: 'text', msg: "Property 5 Property 6"}]
          ]
        },
      ]
    },
    {
      id: 2,
      title: 'Blue',
      type: 'select',
      message: 'Wizard 2',
      options: [
        {key: 0, text:"Red", next: 1},{key: 1, text:"Blue", next: 2},{key: 2, text:"Green", next: 3}
      ]
    },
    {
      id: 3,
      title: 'Green',
      type: 'radio',
      message: 'Wizard 3',
      options: [
        {key: 0, text:"Red", next: 1},{key: 1, text:"Blue", next: 2},{key: 2, text:"Green", next: 3} 
      ]
    }]
  end

  # GET /t_json_entities/new
  def new
    @t_json_entity = TJsonEntity.new
  end

  # GET /t_json_entities/1/edit
  def edit
  end

  # POST /t_json_entities
  # POST /t_json_entities.json
  def create
    @t_json_entity = TJsonEntity.new(t_json_entity_params)

    respond_to do |format|
      if @t_json_entity.save
        format.html { redirect_to @t_json_entity, notice: 'T json entity was successfully created.' }
        format.json { render :show, status: :created, location: @t_json_entity }
      else
        format.html { render :new }
        format.json { render json: @t_json_entity.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /t_json_entities/1
  # PATCH/PUT /t_json_entities/1.json
  def update
    respond_to do |format|
      if @t_json_entity.update(t_json_entity_params)
        format.html { redirect_to @t_json_entity, notice: 'T json entity was successfully updated.' }
        format.json { render :show, status: :ok, location: @t_json_entity }
      else
        format.html { render :edit }
        format.json { render json: @t_json_entity.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /t_json_entities/1
  # DELETE /t_json_entities/1.json
  def destroy
    @t_json_entity.destroy
    respond_to do |format|
      format.html { redirect_to t_json_entities_url, notice: 'T json entity was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_t_json_entity
      @t_json_entity = TJsonEntity.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def t_json_entity_params
      params.require(:t_json_entity).permit(:name, :ontology_id)
    end
end
