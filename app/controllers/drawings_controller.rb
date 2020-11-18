class DrawingsController < ApplicationController
  def create
    RealtimePartialChannel.broadcast_to("drawings", {
      name: "draw",
      body: ApplicationController.render( partial: "pages/draw", locals: { drawing: params[:_json] }, layout: false)
    })

    respond_to do |format|
      format.json { render json: params[:_json] }
    end
  end
end
