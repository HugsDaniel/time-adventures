class MarkersController < ApplicationController
  def update
    @marker = Marker.find(params[:id])
    @map = @marker.map

    @marker.update(x: params[:x], y: params[:y])

    RealtimePartialChannel.broadcast_to("map/#{@map.id}", {
      body: ApplicationController.render( partial: "pages/map", locals: { map: @map }, layout: false),
      name: 'map',
      id: @map.id
    })

    respond_to do |format|
      format.json { render json: { success: true } }
    end
  end
end
