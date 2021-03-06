---
title: '带你走进 SpringCloud2.0（七）：Zuul'
tags:
  - SpringCloud2.0
categories:
  - SpringCloud2.0
---

::: tip
* 当微服务数量非常多时，我们需要一个统一入口调用这些微服务的接口，这时我们就需要网关帮助我们将接口请求反向代理到目标服务。
:::

## 网关

### 网关实现的功能
* 网关对所有服务进行拦截。
* 生成动态路由，进行反向代理。
* 网关安全控制：统一异常处理、防止 xxs 攻击和 SQL 注入。
* 权限控制、黑名单和白名单、性能监控、日志打印。

### 网关分类：内部网关和外部网关
* 内部网关：网关服务不开放给外网。全部服务都部署在内网服务器上，只允许内网的服务才能访问当前网关。
* 外部网关：网关服务开放给外网。网关服务外的其他服务，都部署在内网，外网无法方法。网关服务部署方式有 2 种
  * 网关服务部署在 DMZ 服务器（即网关服务位于的服务器主机位于内网同时拥有外网 IP），然后将网关服务开放给外网访问。
  * 网关服务也部署在内网，另需要 nginx 服务部署在外网，nginx 能够访问网关服务对网关服务实现反向代理，达到将将网关服务开放给外网的效果。

### 常用网关框架
* Kong：是基于 Nginx + Lua 进行二次开发的网关框架。
	* 网址：https://konghq.com/
* Zuul：Netflix 开发的网关框架。SpringCloud 整合了该网关。
	* 网址：https://github.com/Netflix/zuul
* orange：国人开发的一个开源网关框架。
  * 网址：http://orange.sumory.com/

### API 网关与传统服务器网关对比
* 服务器网关：电脑要配置服务器网关，对网络中发送过来的请求进行拦截和转发到目标电脑。
* API 网关：对接收到的请求拦截和转发到目标服务。

## Zuul 网关
::: tip 简介
* Zuul 网关是 SpringCloud 推荐的一个网关框架。
* Zuul 实际是 netflix（美国知名视频网站） 开发的，SpringCloud 做了一个整合封装。
* Zuul 默认集成了 Ribbon 和 Hystrix。
:::

### Zuul 和 Nginx 的区别
* 相同点：Zuul 和 nginx 都可以实现反向代理、负载均衡、过滤请求、实现网关效果。
	* Nginx 通过 Nginx + Lua 实现网关功能。开发团队需要有 Lua 积累，不推荐。
  * 直接在 Nginx 基础上开发一个支持自动注册/注销服务的 Nginx API 网关。
* 不同点
	* Zuul 采用 Java 语言编写，Nginx 采用 C 语言编写
	* Nginx 由 C 编写，采用 I/O 多路复用技术，性能比 Zuul 高，支持的并发数默认要高出两个量级。

### Zuul + Nginx 配合使用
* Nginx 负载均衡能力更强，主要负责反向代理、负载均衡。
* Zuul 对微服务实现请求拦截，智能路由，日志采集等功能。

## 整合 Zuul

### Maven 依赖
  ``` Maven
  <dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-netflix-zuul</artifactId>
  </dependency>
  ```
### application.yml 配置
  ``` .yml
  ### 配置网关反向代理
  zuul:
    routes:
      ### 定义转发规则。这个规则名称可以随意命名
      api-a:
        ### 以 /api-member/ 访问转发到会员服务
        path: /api-member/**
        ### 服务名称。Zuul 网关默认整合了 ribbon，ribbon + serverId 实现本地负载均衡方式调用接口
        serviceId: member-server
      api-b:
        path: /api-order/**
        serviceId: order-server
  ```

### 入口类添加注解
* 注解启动 Zuul 框架的功能
  ``` Java
  @EnableZuulProxy
  ```

## Zuul + Apollo

### 简介
* 在实际开发中，微服务中配置一般会放到分布式配置中心中。
* Zuul 网关服务的动态路由配置，一般是放到分布式配置中心中的。这样可以在配置中心配置通过修改配置，添加或删除特定路由的配置，从而让 Zuul 不需要重启，就能动态进行路由的增减。

### Zuul 整合 Apollo
* Maven 依赖
  ``` Maven
  <dependency>
      <groupId>org.springframework.cloud</groupId>
      <artifactId>spring-cloud-starter-netflix-zuul</artifactId>
  </dependency>

  <dependency>
      <groupId>com.ctrip.framework.apollo</groupId>
      <artifactId>apollo-client</artifactId>
      <version>1.1.0</version>
  </dependency>
  <dependency>
      <groupId>com.ctrip.framework.apollo</groupId>
      <artifactId>apollo-core</artifactId>
      <version>1.1.0</version>
  </dependency>

  <dependency>
      <groupId>org.projectlombok</groupId>
      <artifactId>lombok</artifactId>
      <scope>provided</scope>
  </dependency>
  ```
* application.yml 配置
  ``` .yml
  server:
    port: 8500
  spring:
    application:
      name: zuul-server

  eureka:
    client:
      service-url:
        defaultZone: http://${eureka.instance.ip-address}:8000/eureka/,http://${eureka.instance.ip-address}:8001/eureka/,http://${eureka.instance.ip-address}:8002/eureka/
    instance:
      prefer-ip-address: true
      ip-address: 127.0.0.1

  app:
    ### portal 中新建 Application 的 AppId
    id: zuul_server_config
  apollo:
    ### configserver 的地址
    meta: http://${configserver.host}:8080
  ```

* 启动类添加注解。
  ``` Java
  @EnableApolloConfig
  @EnableZuulProxy
  @EnableEurekaClient
  ```

* 添加动态路由刷新类。当 Apollo 修改配置，Zuul 服务内存中对应的配置会修改，但是我们动态路由对象不会重新根据内存中的配置更新路由，所以需要动态路由刷新类，根据路由配置，更新路由对象。
  ``` Java
  @Component
  public class ZuulProxyRefresher implements ApplicationContextAware {

      private ApplicationContext applicationContext;

      @Autowired
      private RouteLocator routeLocator;

      @ApolloConfigChangeListener(value = "application")
      public void onChange(ConfigChangeEvent changeEvent) {
          boolean zuulProxyChanged = false;
          for (String changedKey : changeEvent.changedKeys()) {
              if (changedKey.startsWith("zuul.")) {
                  zuulProxyChanged = true;
                  break;
              }
          }
          if (zuulProxyChanged) {
              refreshZuulProxy(changeEvent);
          }
      }

      private void refreshZuulProxy(ConfigChangeEvent changeEvent) {
          this.applicationContext.publishEvent(new EnvironmentChangeEvent(changeEvent.changedKeys()));
          this.applicationContext.publishEvent(new RoutesRefreshedEvent(routeLocator));
      }

      @Override
      public void setApplicationContext(ApplicationContext applicationContext) throws BeansException {
          this.applicationContext = applicationContext;
      }
  }
  ```

* Portal 中路由配置，修改配置，会同时修改动态路由。
[](./image/zuul-portal.png)

## GitHub 项目 demo

* [整个 demo GitHub 地址](https://github.com/ChenFengHub/springcloud-demo )

* 项目运行测试：通过修改 portal 中网路路由配置信息，控制路由的添加和删减。
  * 先启动注册服务

	![](./image/feign-eureka-start.png)

	* 启动网关服务、会员服务、订单服务

	![](./image/zuul-start.png)

	* 登录 Portal 管理端：http://${portal.ip}:8070,对路由信息进行操作。
  * 比如增加和删减订单服务路由，然后通过网关调用订单服务接口，判断路由是否根据 Portal 中配置实时更新。测试接口：
    ``` http
    localhost:8500/api-order/order/get
    ```

* [Zuul 例子的 GitHub 地址](https://github.com/ChenFengHub/springcloud-demo/tree/master/zuul-demo)
