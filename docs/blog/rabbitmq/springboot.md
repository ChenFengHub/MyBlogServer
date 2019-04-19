# springboot 整合 amqp

## 引入 pom 依赖

```<dependency>
	<groupId>org.springframework.boot</groupId>
	<artifactId>spring-boot-starter-amqp</artifactId>
</dependency>
```

## application-dev.yml 配置

```js
spring:
    rabbitmq:
        host: localhost
        port: 5672
        username: ipms
        password: starnet@234
        // 底下两者都为：true，才能真正开启消息发送确认机制，在回调中处理消息发送失败的情况。 # 默认：false-不开启消息发送确认。true-开启消息发送确认（消息成功到达 queue：ack-true；否则：ack-false）
        publisher-confirms: false
        // 默认：false-消息回调关闭（broker 调用回调函数，client 的回调函数不会被触发）。true-开启消息回调。
        publisher-returns: false
        // 默认为false。true时，当 broker 没有 queue 能接收消息，会将消息返回给 producer。
        template:
        mandatory: false
        listener:
            simple:
                // 消费者消费消息的 ack 模式。 默认：AUTO，自动确认，只要消费过程中不发生异常。 MANUAL-需要手动确认。NONE-不需要确认，即使消费者抛异常，队列中的消息也会删除-不安全。
                acknowledge-mode: AUTO
                // 并发消费
                concurrency: 5
                max-concurrency: 10
```

## 创建工厂对象并注入容器

```js
@Configuration
public class RabbitMqConfig {
@Autowired
private Parameters parameters;

    /**
     *@Author cf
     *@Date 2019/3/31 20:41
     *@Description 创建client与Broker连接的工厂
     */
    @Bean("connectionFactory")
    public ConnectionFactory connectionFactory() {
        CachingConnectionFactory connectionFactory = new CachingConnectionFactory();
        connectionFactory.setHost(parameters.getRabbitmqHost());
        connectionFactory.setPort(parameters.getRabbitmqPort());
        connectionFactory.setUsername(parameters.getRabbitmqUsername());
        connectionFactory.setPassword(parameters.getRabbitmqPassword());
        return connectionFactory;
    }

}
```

## 创建生产者对象并注入容器

```js
Component(value = "rabbiMqSender")
public class RabbitMqSender {
    @Autowired
    private Parameters parameters;
    @Autowired
    private AmqpTemplate template;

    // 消息确认的回调：用于监听 Server 端给我们返回的确认请求,消息到了 queue，则 ack 为 true。
    // 需要先开启 2 个配置，缺一不可：spring.rabbitmq 的 publisher-confirms:true 和 publisher-returns:true
    private final RabbitTemplate.ConfirmCallback confirmCallback = (correlationData, ack, cause) -> {
        System.out.println("correlationData:" + correlationData);
        System.out.println("ack:" + ack);
        if (ack){
            System.out.println("消息成功发送到 exchange");
        } else {
            System.out.println("消息未成功发送到 exchange。记录异常日志...，后续会有补偿机制(定时器)");
        }
    };

    /**
     * mandatory 的消息回调：broker没有queue接收该消息，broker将消息返回给生产者的回调函数。
     * 需要开启：spring.rabbitmq.template.mandatory:true
     */
    private final RabbitTemplate.ReturnCallback returnCallback = (message,
                                                                  replyCode,
                                                                  replyText,
                                                                  exchange,
                                                                  routingKey) -> {
        System.out.println("return exchange:" + exchange
                + ", routingKey:" + routingKey + ", replyText:" + replyText);
    };

    /**
     *@Description 向对应的主题推送信息
     *@Param topicName -主题名称
     *@Param msg - 推送的主题信息
     */
    public void send(String topicName, String msg) {
        //CachingConnectionFactory
        template.convertAndSend(topicName, msg);
    }

}
```

## 创建消费者并注入容器

```js
@Slf4j
@Component
public class RabbitMqReceiver {
@Autowired
private Parameters parameters;
@Autowired
@Qualifier("rabbitMqSender")
private RabbitMqSender rabbitMqSender;

    /**
     *@Description 简单方式创建consumer。
     * 这个注解必须放在方法前，如果放在类前，无法创建消息队列。
     * 要创建多个消费者，继续创建方法并加上声明即可。
     */
    @RabbitListener(queues = "BASIC_SERVER")
    public void onMessage(Message message) {
        String data = null;
        try {
            data = new String(message.getBody(), "UTF-8");
            System.out.println("----------------"+data);
        } catch (UnsupportedEncodingException e) {
            e.printStackTrace();
        }
    }

    /**
     *@Description 创建复杂配置的消费者
     */
    @RabbitListener(bindings = @QueueBinding(
            value = @Queue(value = "DORMITORY_SERVER", durable = "true"),
            exchange = @Exchange(value = "", durable = "true", ignoreDeclarationExceptions = "true"),
            key = "DORMITORY_SERVER"
    ))
    @RabbitHandler
    public void onMessageAck(Message message, Channel channel) throws IOException {
        String data = null;
        try {
            Long deliveryTag = (Long) message.getMessageProperties().getDeliveryTag();
            data = new String(message.getBody(), "UTF-8");
            System.out.println("----------------"+data);
            // 限流处理：消息体大小不限制，每次限制消费一条，只作用于该Consumer层，不作用于Channel
            channel.basicQos(0, 1, false);
            // 手工ACK,不批量ack，multiple:当该参数为 true 时，则可以一次性确认 delivery_tag 小于等于传入值的所有消息
            channel.basicAck(deliveryTag, false);
        } catch (UnsupportedEncodingException e) {
            e.printStackTrace();
        }
    }

}
```
