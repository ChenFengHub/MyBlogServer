# RabbitMQ Client

## RabbitMQ Client 简介

::: tip 介绍

- 即 RabbitMq 的客户端。Client 主要模块：channel、connection、connectionFactory。
  :::

### Client 主要功能

- 往 Broker 推送消息以及向 Broker 订阅消息；
- 给 broker 发送命令， 创建 exchange、queue；
- 给 broker 发送命令，通过 binding 绑定 exchange 和 queue。

### Client 各个模块负责的功能

- connectionFactory：connection 连接的工厂；需要给工厂指定 client 与 broker 连接所需的配置参数；connectionFactory 创建 connection；
- connection：connection 是 client 与 broker 之间的 tcp 连接；connection 创建 channel；
- channel：channel 负责与 broker 进行交互的各种操作； channel 主要功能是消息推送和消息订阅；提供接口创建 exchange、queue，进行 exchange 和 queue 绑定。

## channel 的创建流程

### 创建 connectionFactory 连接工厂

- 创建工厂，并设置 client 与 broker 连接的基本参数：

```js
ConnectionFactory connectionFactory = new ConnectionFactory();
connectionFactory.setUsername(userName);
connectionFactory.setPassword(password);
connectionFactory.setHost(host);
connectionFactory.setPort(port);
//设置 client 连接的 vhost，即虚拟主机。默认是连接的默认虚拟主机：「/」。
connectionFactory.setVirtualHost(virtualHost);
```

::: tip 注意事项

- 一般一个 client 创建一个 connectionFactory 即可。
  :::

### 创建 connection 连接

- 创建 connection：Connection conn = connectionFactory.newConnection()
  ::: tip
  1. connection 本质是 client 与 Broker 之间建立的 tcp 连接；
  2. 消息发送频率低时：可以创建新的 Connection 和新的 Channel，然后发送消息。---常用
  3. 消息发送频率高时：可以将创建好的 connection 管理起来，然后通过 connection 创建 channel 发送多条消息，减少创建连接的开销。
     :::

### 创建 Channel 消息通道

- 创建 channel：
  Channel channel = conn.createChannel();

::: tip

1. 创建 channel 的意义：channel 与 broker 的通信，本质上是通过 connection 实现的；创建 channel 是为了复用 connection，减少连接创建的开销；
2. 创建 channel 对象的原理：将 connection 对象作为 channel 对象的成员变量，用于与 broker 通信；创建成员变量：通道标识，其作为唯一标识，来标识 channel；当 channel 与 broker 通信时，需要带上该通道标识；每一个 channel 可以认为是一个会话。
3. connection 可以创建多个 channel。channel 共享 connection，每个 channel 有唯一的通道标识。
4. connection 中传输多个 channel 的消息整体是无序的，但是针对同一个通道标识的消息，其是有序传输的。
   :::

## client 消息推送

### 消息推送主要代码

```js
//声明交换机：如果该交换机不存在，则创建；
channel.exchangeDeclare(exchangeName, exchangeType, durable)
//声明队列：如果队列不存在，则创建；
channel.queueDeclare(queueName, durable, exclusive, autoDelete, null)
//绑定 exchange 和 queue；
channel.queueBind(queueName, exchangeName, queueName + '_key')
//推送消息
channel.basicPublish(
  exchangeName,
  routingKey,
  MessageProperties.PERSISTENT_TEXT_PLAIN,
  msg.getBytes()
)
//使用完毕需要关闭。其未关闭，当connection关闭时，channel也会被关闭。
channel.close()
```

### 消息推送的接口

- 主要有 3 种重载方法

  1. void basicPublish(String exchange, String routingKey, BasicProperties props, byte[] body) throws IOException;
  2. void basicPublish(String exchange, String routingKey, boolean mandatory, BasicProperties props, byte[] body) throws IOException;
  3. void basicPublish(String exchange, String routingKey, boolean mandatory, boolean immediate, BasicProperties props, byte[] body) throws IOException;

- 接口参数解析：

  1.  exchange：交换机。未指定，使用默认交换机。
  2.  routingKey：路由 key。
  3.  mandatory：强制队列已经创建。默认为 false（推荐）。
      -false：推送的消息没有队列接收，broker 将消息丢弃，推送接口调用成功。
      -true：推送的消息没有队列接收，broker 将消息返还给生产者（添加监听器，获取返回信息，进行补偿操作）。
  4.  immediate：直接将消息投递给消费者。默认为 false（推荐）。
      -false：消息正常投放到队列，不需要直接投递给消费者。
      -true：如果队列上有消费者正在订阅，则消息不入队列，直接将消息推送给 consumer；如果 queue 没有消费者正在订阅，消息不入队列，消息返还给生产者（添加监听器，获取返回信息，进行补偿操作）。
  5.  props：消息属性，即头部信息。如下：设置了请求内容类型、请求头参数 userId、消息持久化等；MessageProperties 对象定义了几个常用的 BasicProperties 类型的静态变量。
      channel.basicPublish(exchangeName,
      routingKey,
      new AMQP.BasicProperties.Builder()
      .contentType("text/plain")
      .deliveryMode(2)
      .priority(1)
      .userId("bob")
      .build()),
      messageBodyBytes);

  6.  body：消息主体。

## 注意事项

- 推送消息，有时需要接受 broker 返回的推送结果，需要添加监听器，操作如下：

```js
channel.basicQos(1);
channel.basicPublish(exchangeName, "", mandatory, immediate, MessageProperties.PERSISTENT_TEXT_PLAIN, "===mandatory===".getBytes());
channel.addReturnListener(new ReturnListener() {
public void handleReturn(int replyCode, String replyText, String exchange, String routingKey, AMQP.BasicProperties basicProperties, byte[] body) throws IOException {
		String message = new String(body, "UTF-8");
		System.out.println("Basic.return返回的结果是："+message);
	}
});
```

- channel.basicQos(1)：指消费者在接收到 channel 推送消息但没有返回确认结果之前，它不会将新的消息分发给它。这个确保推送的消息，由多个 consumer 中空闲时间较多的来多消费。若采用默认策略，多个 consumer 按照轮询分发相同数目的消息。

## 消息订阅

### 订阅消息

- 订阅消息处理过程分为：2 步。 1. 创建处理消息的消费者对象； 2. channel 进行队列订阅；

- 创建处理消息的消费者对象：

```js
public class BasicQueueConsumer extends DefaultConsumer {
    private boolean multiple;
    public BasicQueueConsumer(Channel channel) {    super(channel);    }
    public BasicQueueConsumer(Channel channel, boolean multiple) {
        super(channel);
        this.multiple = multiple;
    }

    /**@Description 消费业务处理的位置*/
    @Override
    public void handleDelivery(String consumerTag, Envelope envelope, AMQP.BasicProperties properties, byte[] body) throws IOException
    {
        String routingKey = envelope.getRoutingKey();
        String contentType = properties.getContentType();
        long deliveryTag = envelope.getDeliveryTag();
        String message = new String(body, "UTF-8");
      //ack：手动确认消息消费完成
        getChannel().basicAck(deliveryTag, multiple);
    }
}
```

- channel 进行队列订阅：

```js
public static Boolean receive(String queueName, String consumerTag, String exchangeName,
                              String exchangeType, Boolean durable, Boolean exclusive,
                              Boolean autoDelete, String bindingKey, Class clazz) {
	try {
		// 创建队列消费者，默认消息消费确认设置：false，需要手动确认消息消费完成
		boolean autoAck = false;
		Boolean multiple = false;
		Connection connection = connectionFactory.newConnection();
		Channel channel = connection.createChannel();
		channel.queueDeclare(queueName, durable, exclusive, autoDelete, null);
		/** exchange ==""，为默认交换机，默认交换机不可显示的绑定队列和解除队列的绑定。创建默认交换机会抛出IO异常 **/
		if(!CommonUtils.isEmpty(exchangeName)) {
			channel.exchangeDeclare(exchangeName, exchangeType, durable);
			channel.queueBind(queueName, exchangeName, bindingKey);
		}
		// 反射创建对应的对象
		Constructor<Consumer> consumerConstructor =  clazz.getConstructor(Channel.class, boolean.class);
		Consumer consumer = consumerConstructor.newInstance(channel, multiple);

		// consumerTag-消费者的标识，多个消费者可以使用相同标识
		if(CommonUtils.isEmpty(consumerTag)) {
			//自动生成消费者标识
			channel.basicConsume(queueName, autoAck, consumer);
		} else {
			channel.basicConsume(queueName, autoAck, consumerTag, consumer);
		}
		return true;
	} 。。。
}
```

::: tip 注意事项

- 订阅消息时，只能收到消息的 body 中的数据，properties 请求头的属性不会被接收。
- 若想要在 body 接收到请求头等消息，可以将这些消息都放到 body 中发送。
  :::
