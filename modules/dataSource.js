var mongoose = require('mongoose')
const server = 'mongodb://177010592:123456@ds263639.mlab.com:63639/assignmentdatabase'
mongoose.connect(server, function(){
});
module.exports = mongoose