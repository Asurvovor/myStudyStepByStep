var exampleData = {
  name: 'Vue.js',
  age: 20
}
var exampleVM = new Vue({
  el: '#example-1',
  data: exampleData
})

var exampleVM2 = new Vue({
  el: '#example-2',
  data: {
    greeting: true
  }
})