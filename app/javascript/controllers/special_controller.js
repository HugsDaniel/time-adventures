import ApplicationController from './application_controller'
import Rails from '@rails/ujs'

export default class extends ApplicationController {
  static targets = ['name', 'value']

  connect () {
    super.connect()
    // add your code here, if applicable
  }

  create (event) {
    Rails.stopEverything(event)
    this.stimulate(
      'SpecialReflex#create',
      event.currentTarget.dataset.characterId,
      this.nameTarget.value,
      this.valueTarget.value
    )
  }

  afterCreate () {
    this.nameTarget.value = ''
    this.valueTarget.value = ''
  }

}
