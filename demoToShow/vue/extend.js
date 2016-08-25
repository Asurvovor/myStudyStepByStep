var Profile = Vue.extend({
  template: '<p>{{firstName}} {{lastName}} aka {{alias}}</p>'
})

var profile = new Profile({
  data: {
    firstName: 'Walter',
    lastName: 'White',
    alias: 'Heisenberg'
  }
})

profile.$mount('#mount-point')