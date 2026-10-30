import assert from 'node:assert/strict'
import test from 'node:test'
import { nextTick } from 'vue'
import { SDialog, SDrawer } from '../dist/index.js'
import { mountComponent } from './renderer.mjs'

function modal(Component) {
  const view = mountComponent(Component, { open: false })
  const element = view.element
  let closes = 0
  element.open = false
  element.showModal = () => { element.open = true }
  element.close = () => { element.open = false; closes++ }
  return {
    view, element,
    get closes() { return closes },
    async setOpen(open) { view.state.value = { ...view.state.value, open }; await nextTick() },
  }
}

for (const Component of [SDialog, SDrawer]) {
  test(`${Component.__name}: independent instances and cancelled exit timers`, async () => {
    const first = modal(Component), second = modal(Component)
    try {
      await first.setOpen(true)
      await second.setOpen(true)
      await first.setOpen(false)
      await first.setOpen(true)
      await new Promise(resolve => setTimeout(resolve, 230))
      assert.equal(first.element.open, true)
      assert.equal(second.element.open, true)
      assert.equal(first.closes, 0)
      await first.setOpen(false)
      await new Promise(resolve => setTimeout(resolve, 230))
      assert.equal(first.element.open, false)
      assert.equal(first.closes, 1)
      assert.equal(second.element.open, true)
    } finally { first.view.unmount(); second.view.unmount() }
  })
  test(`${Component.__name}: unmount clears a pending close fallback`, async () => {
    const instance = modal(Component)
    await instance.setOpen(true)
    await instance.setOpen(false)
    instance.view.unmount()
    assert.equal(instance.closes, 1)
    await new Promise(resolve => setTimeout(resolve, 230))
    assert.equal(instance.closes, 1)
  })
}
