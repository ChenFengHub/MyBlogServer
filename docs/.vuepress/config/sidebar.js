const springcloud = [
  {
    title: '带你走进 SpringCloud2.0',
    collapsable: false,
    siebarDepth: 2,
    children: [
      {
          title: '之一-开篇',
          path: '/blog/springcloud/带你走进 SpringCloud2.0（一）：开篇.md',
      },
      {
        title: '之二-Eureka',
        path: '/blog/springcloud/带你走进 SpringCloud2.0（二）：Eureka.md'
      },
      {
        title: '之三-Ribbon',
        path: '/blog/springcloud/带你走进 SpringCloud2.0（三）：Ribbon.md'
      },
      {
        title: '之四-Feign',
        path: '/blog/springcloud/带你走进 SpringCloud2.0（四）：Feign.md'
      },
      {
        title: '之五-Hystrix',
        path: '/blog/springcloud/带你走进 SpringCloud2.0（五）：Hystrix.md'
      },
      {
        title: '之六-Apollo',
        path: '/blog/springcloud/带你走进 SpringCloud2.0（六）：Apollo.md'
      },
      {
        title: '之七-Zuul',
        path: '/blog/springcloud/带你走进 SpringCloud2.0（七）：Zuul.md'
      },
      {
        title: '之八-Sleuth',
        path: '/blog/springcloud/带你走进 SpringCloud2.0（八）：Sleuth.md'
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

const mysql = [
  {
    title: 'Mysql',
    collapsable: false,
    siebarDepth: 2,
    children: ['/blog/mysql/a树演化.md', '/blog/mysql/b索引浅谈.md']
  }
]


module.exports = {
  '/blog/springcloud': springcloud,
  '/blog/mysql': mysql
  // ,
  // '/docs/前端知识体系/': frontend,
  // '/docs/前端框架/': frontendFrame,
  // '/docs/NodeJS/': node,
  // '/docs/webpack4/': webpack4,
  // '/docs/前端自动化测试/': test,
  // '/docs/数据结构与算法/数据结构/': dataStructures,
  // '/docs/数据结构与算法/LeetCode/': LeetCode
}
