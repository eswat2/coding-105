//
// NOTE:  here's an example of 2 independent vue instances on a single page
//        that are talking to each other thru a third vue instance that's
//        surving purely as an eventBus for the elements on the page...
//
//
const eventBus = new Vue()

const models = [{
    param: 'accountName',
    title: 'Account Name',
    type: 'text',
    applied: null,
    value: ''
  },
  {
    labelFor: function(value) { return value === '' ? value : `last ${value} days` },
    param: 'updated',
    title: 'Account Updated',
    type: 'option',
    values: ['', 3, 7, 14, 30],
    applied: null,
    value: ''
  }
]

const app = new Vue({
  el: "#app",
  data: {
    search: []
  },
  methods: {
    clearAll: function() {
      this.search = []
    },
    clearFilter: function(data) {
      const list = this.search
      this.search = list.filter((item) => { return item.param != data })
    },
    newFilter: function(data) {
      this.clearFilter(data.param)
      this.search.push(data)
    }
  },
  created() {
    eventBus.$on('new:filter', this.newFilter)
    eventBus.$on('clear:filter', this.clearFilter)
    eventBus.$on('clear:all', this.clearAll)
  }
})

const form = new Vue({
  el: "#form",
  data: {
    models
  },
  methods: {
    apply: function(indx) {
      const value = this.models[indx].value
      if (this.models[indx].applied != value) {
        this.models[indx].applied = value
        const param = this.models[indx].param
        eventBus.$emit('new:filter', { param, value })
      }
    },
    classFor: function(indx) {
      return this.isApplied(indx) ? ['disabled'] : []
    },
    clear: function(indx) {
      this.models[indx].value = ''
      this.models[indx].applied = null
      const param = this.models[indx].param
      eventBus.$emit('clear:filter', param)
    },
    clearAll: function() {
      this.models.forEach((item) => {
        item.value = ''
        item.applied = null
      })
      eventBus.$emit('clear:all')
    },
    hasValue: function(indx) {
      return this.models[indx].value != ''
    },
    isApplied: function(indx) {
      return this.models[indx].applied === this.models[indx].value
    },
    wasApplied: function(indx) {
      return this.models[indx].applied !== null
    },
    labelsFor: function(obj) {
      return obj.values.map((item) => { return obj.labelFor(item) })
    },
    optionsFor: function(obj) {
      return obj.values.map((value) => { return { label: obj.labelFor(value), value } })
    }
  },
  computed: {
    manyApplied: function() {
      return this.models.filter((item) => { return item.applied !== null }).length > 1
    }
  }
})
