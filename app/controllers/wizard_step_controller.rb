class WizardStepController < ApplicationController
  def start
    @wizardStep = WizardStep.find(params[:id])
  end
  
  def finish
    @paramid = params[:id]
    @wizardStep = WizardStep.find(@paramid[:id].to_f)
    render :start
  end
end
