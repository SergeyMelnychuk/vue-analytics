import Vue from 'vue'
import VueAnalytics from '../../src'

window.ga = jest.fn()

let $vm

beforeEach(() => {
  window.ga.mockClear()

  Vue.use(VueAnalytics, {
    id: 'UA-1234-5'
  })

  $vm = new Vue({})

  $vm.$mount()
})

it ('should track an event', () => {
    var track = VueAnalytics.eventsTrackingmiddleware();

    track({
        selector: '.orders-on-the-way__tip--review-order-transparency a:first-of-type',
        trackingEvent: {
            eventAction: 'click_driverapp_details',
            eventCategory: 'engagement'
        },
    });

    $vm.$ga.event('foo', 'bar')
    expect(window.ga).toBeCalledWith('send', 'event', 'foo', 'bar')
  })