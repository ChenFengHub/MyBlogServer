# 带你走进 SpringCloud2.0（八）：Sleuth

::: tip 背景
* 在微服务系统中，随着系统越来越庞大，各个服务之间调用关系也越来越复杂。一个 Http 请求可能要经过 n 个服务处理后才能返回结果，如果其中一个服务出现问题，要定位问题将变得很困难。
* 请求调用链跟踪技术就应运而生，可以对请求进行服务跟踪。
:::

## Sleuth 介绍

::: tip 简介
* Sleuth 是 SpringCloud 提供的服务跟踪解决方案，可以对请求调用链中耗时、异常等信息进行统计
:::

### Sleuth 实现的功能
* 耗时分析：统计调用每个服务接口消耗的时间。
* 可视化错误：记录服务未捕获的异常，可以 Zipkin 可视化界面上展示。
* 链路优化：统计接口调用的频率。对比较经常调用的接口，使用 Hystrix 进行高可用性优化。
* 记录服务依赖信息

### 整合 Zipkin
* Sleuth 只对请求调用链进行跟踪，并统计信息，没有专门展示统计信息的 UI。
* SpringCloud2.0 Sleuth 以及默认整合了 Zipkin。
* 各个服务器上的请求链信息会推送给 Zipkin，Zipkin 展示调用链的信息。
  * Zipkin 默认是调用链信息保存在内存中。
  * Zipkin 可以对数据持久化。通过整合数据库，将数据存储在数据库中。

## Sleuth 原理分析

::: tip
* 同一次接口调用，会生成唯一的 traceId 标识整个调用链；生成多个 spanId，分别对应各个接口统计数据，从而确定服务的依赖关系，调用链的顺序和统计时间等。
:::

### 基本概念介绍
* traceId：跟踪编号。同一个请求调用链中所有接口调用信息的唯一标识。
* spanId：跨度编号。接口调用链中服务依赖关系，接口调用顺序，接口调用耗时都是通过 spanId。

### 接口调用链信息主要成分介绍
* traceId：跟踪编号。同一个请求调用链中所有接口调用信息的唯一标识。
* id：即 spanId，跨度编号。接口调用链中服务依赖关系，接口调用顺序，接口调用耗时都是通过 spanId。
* kind：有 2 个值 CLIENT 和 SERVER。
  * CLIENT：客户端，即消费者，调用服务的接口。
  * SERVER：服务端，即生成者，提供接口的服务。
* localEndpoint：存储服务名称及服务 IP 的信息。
* parentId：即 parentSpanId。当 parentId 为 null 或者 spanId == traceId 的 JSON 信息，作为调用链的入口
* 生产者/服务端：提供接口的服务。

### 调用链信息解析流程
* 调用 zuul-server 生产者。确定调用链入口是 parentId 找到调用链入口 zuul-server 生产者
* 调用 zuul-server 消费者。zuul-server 生产者为 zuul-server 消费者创建 spanId 即 id，zuul-server parentId 是 zuul-server 生产者的 id。
  * zuul-server 消费者的 parentId 是 zuul-server 生产者的 id。
  * zuul-server 消费者的 id 是 zuul-server 生产者新生成传递给它。
  * 当调用生产者接口成功，根据 zuul-server 消费者 JSON 中时间信息与返回记录的时间做差值，就能获取调用接口时间。
* 调用 order-server 生产者。zuul-server 消费者调用的生产者有与其相同的 id 和 parentId，所以 zuul-server 消费者调用的是 order-server 生产者。
* 调用 order-server 消费者。order-server 生产者为 order-server 消费者创建 spanId 即 id，order-server parentId 是 order-server 生产者的 id
* 调用 member-server 生产者。

服务名称|parentId|spanId|traceId
---|:--:|:--:|---
zuul-server 生产者|null|769fa17617dcbb87|769fa17617dcbb87
zuul-server 消费者|769fa17617dcbb87|67421900df06a518|769fa17617dcbb87
order-server 生产者|769fa17617dcbb87|67421900df06a518|769fa17617dcbb87
order-server 消费者|67421900df06a518|a5e06cd163763c2b|769fa17617dcbb87
member-server 生产者|67421900df06a518|a5e06cd163763c2b|769fa17617dcbb87

### 调用链信息
  ```json
  [
    {
      "traceId": "769fa17617dcbb87",
      "parentId": "67421900df06a518",
      "id": "a5e06cd163763c2b",
      "kind": "CLIENT",
      "name": "get",
      "timestamp": 1571388444930010,
      "duration": 5259,
      "localEndpoint": {
        "serviceName": "order-server",
        "ipv4": "192.168.56.1"
      },
      "tags": {
        "http.method": "GET",
        "http.path": "/member"
      }
    },
    {
      "traceId": "769fa17617dcbb87",
      "parentId": "769fa17617dcbb87",
      "id": "67421900df06a518",
      "kind": "SERVER",
      "name": "get /order",
      "timestamp": 1571388444929145,
      "duration": 8053,
      "localEndpoint": {
        "serviceName": "order-server",
        "ipv4": "192.168.56.1"
      },
      "remoteEndpoint": {
        "ipv6": "::1",
        "port": 63582
      },
      "tags": {
        "http.method": "GET",
        "http.path": "/order",
        "mvc.controller.class": "OrderController",
        "mvc.controller.method": "getOrder"
      },
      "shared": true
    },
    {
      "traceId": "769fa17617dcbb87",
      "parentId": "769fa17617dcbb87",
      "id": "67421900df06a518",
      "kind": "CLIENT",
      "name": "get",
      "timestamp": 1571388444926155,
      "duration": 11667,
      "localEndpoint": {
        "serviceName": "zuul-server",
        "ipv4": "192.168.56.1"
      },
      "tags": {
        "http.method": "GET",
        "http.path": "/order"
      }
    },
    {
      "traceId": "769fa17617dcbb87",
      "id": "769fa17617dcbb87",
      "kind": "SERVER",
      "name": "get",
      "timestamp": 1571388444923168,
      "duration": 16547,
      "localEndpoint": {
        "serviceName": "zuul-server",
        "ipv4": "192.168.56.1"
      },
      "remoteEndpoint": {
        "ipv6": "::1",
        "port": 63581
      },
      "tags": {
        "http.method": "GET",
        "http.path": "/api-order/order"
      }
    },
    {
      "traceId": "769fa17617dcbb87",
      "parentId": "67421900df06a518",
      "id": "a5e06cd163763c2b",
      "kind": "SERVER",
      "name": "get /member",
      "timestamp": 1571388444933266,
      "duration": 2080,
      "localEndpoint": {
        "serviceName": "member-server",
        "ipv4": "192.168.56.1"
      },
      "remoteEndpoint": {
        "ipv4": "127.0.0.1",
        "port": 63583
      },
      "tags": {
        "http.method": "GET",
        "http.path": "/member",
        "mvc.controller.class": "UserController",
        "mvc.controller.method": "getMember"
      },
      "shared": true
    }
  ]
  ```

## 整合 Sleuth

### Zipkin 服务启动
* SpringCloud2.0 开始，提供 Zipkin 服务的 jar 包。
* 启动 Zipkin 服务
  ``` command
  java -jar zipkin-server-2.11.8-exec.jar --server.port=9411
  ```
* zip 服务默认端口：9411

### Maven 依赖
* zipkin 包同时整合了 Sleuth 和 Zipkin
* 依赖包
  ```Maven
  <dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-zipkin</artifactId>
  </dependency>
  ```

### application.yml 配置
  ``` .yml
  spring:
    application:
      name: app-itmayiedu-member
    ### 配置 zipkin 服务的地址
    zipkin:
      base-url: http://localhost:9411/
    sleuth:
      sampler:
        ### 配置 sleuth 的请求抽样比例，推送给 Zipkin。分为：抽样收集和每个请求都收集。默认：0.1，收集 1/10 请求作为样本。1.0-收集全部请求
        probability: 1.0
  ```

### Zipkin 界面
* Zipkin 管理端地址
  ``` url
  http://localhost:9411
  ```
* 微服务刚启动，Zipkin  界面的信息为空。当发送请求后，会出现追踪信息


## GitHub 项目 demo

* [整个 demo GitHub 地址](https://github.com/ChenFengHub/springcloud-demo )

* [Sleuth 例子的 GitHub 地址](https://github.com/ChenFengHub/springcloud-demo/tree/master/sleuth-demo)
