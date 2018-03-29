/*var connection =  new require('./kafka/Connection');
var login = require('./services/login');

var topic_name = 'login_topic';
var consumer = connection.getConsumer(topic_name);
var producer = connection.getProducer();

console.log('server is running');
consumer.on('message', function (message) {
    console.log('message received');
    console.log(JSON.stringify(message.value));
    var data = JSON.parse(message.value);
    login.handle_request(data.data, function(err,res){
        console.log('after handle'+res);
        var payloads = [
            { topic: data.replyTo,
                messages:JSON.stringify({
                    correlationId:data.correlationId,
                    data : res
                }),
                partition : 0
            }
        ];
        producer.send(payloads, function(err, data){
            console.log(data);
        });
        return;
    });
}); */

var connection =  new require('./kafka/Connection');
var api = require('./services/api');
var topic_name = 'requestTopic';
var consumer = connection.getConsumer(topic_name);
var producer = connection.getProducer();

consumer.on('message', function (message) {
  var data = JSON.parse(message.value);
  api.handle_request(data.data, function(err,res){
    var payloads = [
        { topic: data.replyTo,
            messages:JSON.stringify({
                correlationId:data.correlationId,
                data : res
            }),
            partition : 0
        }
    ];
    producer.send(payloads, function(err, data){
        console.log(data);
    });
    return;
  });
});
