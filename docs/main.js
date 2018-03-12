//
// NOTE:  here's an example of 2 independent vue instances on a single page
//        that are talking to each other thru a third vue instance that's
//        surving purely as an eventBus for the elements on the page...
//
//
const eventBus = new Vue()

const app = new Vue({
  el: "#app",
  data: {},
  methods: {
    newFilter: function() {
      // NOTE:  placeholder...
    }
  },
  created() {
    eventBus.$on('new:filter', this.newFilter)
  }
})

const form = new Vue({
  el: "#form",
  data: {},
  methods: {}
})
