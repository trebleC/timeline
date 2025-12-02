/**
 * @vitest-environment jsdom
 */

import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import Timeline from '../src/components/Timeline.vue'

describe('Timeline.vue', () => {
  it('renders without crashing', () => {
    const wrapper = mount(Timeline, {
      props: {
        events: []
      }
    })
    expect(wrapper.exists()).toBe(true)
  })

  it('displays events when provided', () => {
    const events = [
      {
        id: 1,
        title: 'Test Event',
        content: 'This is a test event',
        time: '2022-12-01T12:00',
        period: '上午',
        location: '',
        image: ''
      }
    ]
    
    const wrapper = mount(Timeline, {
      props: { events }
    })
    
    expect(wrapper.text()).toContain('Test Event')
  })

  it('filters events by year', async () => {
    const events = [
      {
        id: 1,
        title: '2022 Event',
        content: 'Event in 2022',
        time: '2022-12-01T12:00',
        period: '上午',
        location: '',
        image: ''
      },
      {
        id: 2,
        title: '2023 Event',
        content: 'Event in 2023',
        time: '2023-01-01T12:00',
        period: '下午',
        location: '',
        image: ''
      }
    ]
    
    const wrapper = mount(Timeline, {
      props: { events }
    })
    
    // Initially should show both events
    expect(wrapper.text()).toContain('2022 Event')
    expect(wrapper.text()).toContain('2023 Event')
    
    // Filter by year 2022
    await wrapper.setProps({ selectedYear: 2022 })
    
    expect(wrapper.text()).toContain('2022 Event')
    expect(wrapper.text()).not.toContain('2023 Event')
  })
})