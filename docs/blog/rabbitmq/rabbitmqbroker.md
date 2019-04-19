# RabbitMQ Broker

## RabbitMQ 简介

### RabbitMQ 主要分成：broker 和 client

- broker：消息代理，即 RabbitMQ 的服务端，负责 RabbitMQ 的消息接收和分发。

  - broker 的组成：vhost

- client：即 RabbitMQ 的客户端，作为生产者或消费者，或者作为发布者和订阅者。

### Broker 概念图

<a data-fancybox title="" href="https://raw.githubusercontent.com/ChenFengHub/PicServer/master/blogger/mysql/20190417142100.png">![](https://raw.githubusercontent.com/ChenFengHub/PicServer/master/blogger/mysql/20190417142100.png)</a>

## vhost 简介

### vhost：虚拟主机

- 默认虚拟主机:「/」

- vhost 拥有自己的 exchange、queue 和 binding。一个虚拟机的 exchange 不能绑定给其他 vhost 中。

- vhost 用作不同用户的权限分离。用户拥有对应的 vhost 权限，才能操作 vhost 内部的 exchange、queue 等元素。如下图：

<a data-fancybox title="" href="https://raw.githubusercontent.com/ChenFengHub/PicServer/master/blogger/mysql/20190417112219.png">![](https://raw.githubusercontent.com/ChenFengHub/PicServer/master/blogger/mysql/20190417112219.png)</a>

## exchange 简介

### exchange：交换机

- RabbitMQ 的 client 将消息推送给 Broker 时，消息先到 exchange。
  - exchange 确认将消息投递给 queue 后， client 的 publish 才算结束。
  - client 推送消息开启 confirm 时。queue 不存在，会将消息返回给 client；消息投递到 queue 后，推送才算成功。
  - exchange 不存储消息，只做转发。

### exchange 类型：2 类

- 默认交换机：默认值为“”，空字符串。默认交换隐式绑定到每个队列，binding 等于队列名称。

  - 默认交换机无法创建。创建会报错。
  - 队列无法显式绑定到默认交换机。queue 与默认交换机绑定会报错。
  - 队列无法显式取消绑定到默认交换机。
  - 可以只创建队列来使用。队列默认会与默认交换机来绑定，这样则不需要创建 exchange 以及显式绑定 queue 和 exchange。

- 其他交换机：exchange 要想能路由到队列，必须显示绑定，否则无法往对应的队列推送消息。

### exchange 消息路由类型：3 种

- direct：完全匹配。推送消息时， 与参数 routingKey 相匹配的 binding 绑定的 queue， 才能接收到消息。
- fanout：广播型。与交换机建立绑定的队列都会收到消息（未绑定的队列不会收到消息）。
- topic：正则匹配。binding 定义为正则表达式，发送消息中的 routingKey 匹配到的 bindingKey 绑定队列，才接收到消息。

## queue 和 binding 简介

### queue 简介

- queue 是消息存储并推送给消费者的地方。
- client 中可以创建 queue。
- client 可以将消息发送给 queue。发送的消息会先到 exchange，再由 exchange 投递给 queue；queue 未创建，默认情况下不会报错，但会导致消息丢失。
- queue 作用是负载均衡服务，将接收到的消息推送给 counsumer。当有多个 cousumer 消费时，queue 默认根据轮询算法（Round-Robin），将消息推送给每个 consumer。

- 由谁负责创建 queue

  - 分析：若仅由 consumer 创建 queue，那么当 producer 推送消息时，由于 queue 不存在而导致消息丢失；
  - 结论：推荐 cousumer 与 producer 都创建 queue，保证消息不会丢失。

### binding 简介

- binding 将 exchange 与 queue 进行绑定
- 消息根据路由规则推送给对应的 queue：client 推送的 message 中带有 routingKey，当 message 发送到 exchange 时，会根据 exchangeType，再根据 routingKey 和 bindingKey，按照对应规则匹配到 queue。

## 消息持久化

- 实现消息持久化需要同时满足的条件： 3 个
  - 消息持久化：message 的 delivery mode 设置为 2。如此设置后，消息到达 queue 时才会被写入磁盘，否则仅写入内存。
  - exchange 的持久化：exchage 的 durable 设置为 true。这样当 Broker 服务重启时，exchange 不会丢失。
  - queue 的持久化：queue 的 durable 设置为 true。这样当 Broker 服务重启时，queue 不会丢失。这时消息写入内存；当 message 的 delivery mode 设置为：2，消息写入磁盘。当确认消息被 consumer 消费并 ack 确认，消息从磁盘删除。
:::tip

- RabbitMQ 默认是不进行持久化的。这样当服务器重启时，queue 会丢失，queue 中的消息自然也消息会丢失。
- exchange 和 queue 的 durable 的值必须同时相同。否则会报错。exchange 和 queue 要么同时持久化，要么都不持久化。
  :::

<!-- <Valine></Valine> -->
[前端友情链接](https://itxiaohao.github.io)
