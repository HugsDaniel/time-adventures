import ApplicationController from './application_controller'
import debounce from 'lodash/debounce'

export default class extends ApplicationController {

  static targets = ['input']

  connect () {
    super.connect()
    this.update = debounce(this.update, 1000)
    // this.update = debounce(this.update, 1000)
  }

  update = (event) => {
    // Rails.stopEverything(event)
    this.stimulate('InventoryReflex#update', this.inputTarget.id, this.inputTarget.value)
  }

}
