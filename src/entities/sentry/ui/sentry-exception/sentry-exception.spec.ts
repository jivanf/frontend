import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import SentryException from './sentry-exception.vue'

const makeException = (frameCount: number) => ({
  type: 'RuntimeException',
  value: 'Something went wrong',
  stacktrace: {
    frames: Array.from({ length: frameCount }, (_, index) => ({
      filename: `app/File${index + 1}.php`,
      function: `call${index + 1}`,
      lineno: index + 1,
    })),
  },
})

const mountException = (frameCount: number, maxFrames = 0) =>
  mount(SentryException, {
    props: {
      exception: makeException(frameCount),
      maxFrames,
    },
    global: {
      stubs: {
        SentryExceptionFrame: {
          props: ['frame'],
          template: '<div data-test="frame">{{ frame.filename }}</div>',
        },
      },
    },
  })

describe('SentryException', () => {
  it('renders all stack frames when maxFrames is not set', () => {
    const wrapper = mountException(12)

    expect(wrapper.findAll('[data-test="frame"]')).toHaveLength(12)
  })

  it('limits stack frames when maxFrames is set', () => {
    const wrapper = mountException(12, 10)

    expect(wrapper.findAll('[data-test="frame"]')).toHaveLength(10)
  })
})
