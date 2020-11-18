import Rails from '@rails/ujs'
import debounce from 'lodash/debounce'
import ApplicationController from './application_controller'

let lastMessageId
const reload = controller => {
  controller.stimulate('ChatReflex#reload')
}
const debouncedReload = debounce(reload, 100)

export default class extends ApplicationController {
  static targets = ['list', 'input', 'dice', 'skill', 'factor', 'value', 'name', 'characterId']

  connect () {
    super.connect()
    this.scroll(100)
  }

  post (event) {
    Rails.stopEverything(event)
    lastMessageId = Math.random()
    this.stimulate(
      'ChatReflex#post',
      this.inputTarget.value,
      lastMessageId
    )
  }

  launchDice (event) {
    Rails.stopEverything(event)

    this.stimulate(
      'ChatReflex#launch_dice',
      event.currentTarget.dataset.characterId,
      event.currentTarget.dataset.difficulty,
      event.currentTarget.dataset.name,
    )
  }

  launchSpecial (event) {
    Rails.stopEverything(event)

    this.stimulate(
      'ChatReflex#launch_special',
      this.characterIdTarget.value,
      this.nameTarget.value,
      this.valueTarget.value,
      this.skillTarget.value,
      this.factorTarget.value
    )
  }

  launch (event) {
    Rails.stopEverything(event)

    this.stimulate(
      'ChatReflex#launch_skill',
      event.currentTarget.dataset.characterId,
      event.currentTarget.dataset.difficulty,
      event.currentTarget.dataset.skill,
      event.currentTarget.dataset.dice
    )
  }

  afterPost () {
    this.inputTarget.value = ''
    this.inputTarget.focus()
    this.scroll(1)
  }

  scroll (delay = 10) {
    const lists = document.querySelectorAll('[data-target="chat.list"]')
    setTimeout(() => {
      lists.forEach(e => (e.scrollTop = e.scrollHeight))
    }, delay)
  }

  reload (event) {
    const { messageId } = event.detail
    if (messageId === lastMessageId) return
    debouncedReload(this)
  }
}
