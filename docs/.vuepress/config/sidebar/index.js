const jvm = [
  {
    title: 'JVM 吐血推荐系列',
    collapsable: false,
    siebarDepth: 2,
    children: [
      {
          title: '内存结构',
          path: '/views/jvm/JVM 吐血推荐系列之内存结构.md',
      }
    ]
  }
]

const springcloud = [
  {
    title: '带你走进 SpringCloud2.0',
    collapsable: false,
    siebarDepth: 2,
    children: [
      {
          title: '之一-开篇',
          path: '/views/springcloud/带你走进 SpringCloud2.0（一）：开篇.md',
      },
      {
        title: '之二-Eureka',
        path: '/views/springcloud/带你走进 SpringCloud2.0（二）：Eureka.md'
      },
      {
        title: '之三-Ribbon',
        path: '/views/springcloud/带你走进 SpringCloud2.0（三）：Ribbon.md'
      },
      {
        title: '之四-Feign',
        path: '/views/springcloud/带你走进 SpringCloud2.0（四）：Feign.md'
      },
      {
        title: '之五-Hystrix',
        path: '/views/springcloud/带你走进 SpringCloud2.0（五）：Hystrix.md'
      },
      {
        title: '之六-Apollo',
        path: '/views/springcloud/带你走进 SpringCloud2.0（六）：Apollo.md'
      },
      {
        title: '之七-Zuul',
        path: '/views/springcloud/带你走进 SpringCloud2.0（七）：Zuul.md'
      },
      {
        title: '之八-Sleuth',
        path: '/views/springcloud/带你走进 SpringCloud2.0（八）：Sleuth.md'
      }
    ]
  }
  //,{
  //   title: 'SpringCloud2.x：Eureka',
  //   path: '/blog/springcloud/带你走进 SpringCloud2.0（二）：Eureka.md',
  //   collapsable: false,
  //   siebarDepth: 2
  // }
]

module.exports = {
  '/views/springcloud': springcloud,
}
