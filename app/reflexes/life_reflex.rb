# frozen_string_literal: true

class LifeReflex < ApplicationReflex
  def increase
    character = Character.find(element.dataset.id)

    unless character.life == character.max_life
      character.life += 1
      character.save
    end

    morph "#life#{character.id}", ApplicationController.render( partial: "pages/life", locals: { char: character })
  end

  def decrease
    character = Character.find(element.dataset.id)
    unless character.life == 0
      character.life -= 1
      character.save
    end
    morph "#life#{character.id}", ApplicationController.render( partial: "pages/life", locals: { char: character })
  end
end
