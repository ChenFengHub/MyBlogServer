const sidebar = require('./sidebar')
module.exports = {
  // 导航和侧边栏
  // sidebar: 'auto',
  // 网站标题旁边添加头像
  head: [['link', { rel: 'icon', href: '/avatar.jpg' }]],
  sidebar,
  nav: [
    // 导航配置
    {
      text: '首页',
      link: '/',
      icon: 'reco-home'
    },
    {
      text: 'SpringCloud2.0',
      items: [
        {
          text: '开篇',
          link: '/blog/springcloud/带你走进 SpringCloud2.0（一）：开篇'
        },
        {
          text: 'Eureka',
          link: '/blog/springcloud/带你走进 SpringCloud2.0（二）：Eureka'
        },
        {
          text: 'Ribbon',
          link: '/blog/springcloud/带你走进 SpringCloud2.0（三）：Ribbon'
        },
        {
          text: 'Feign',
          link: '/blog/springcloud/带你走进 SpringCloud2.0（四）：Feign'
        },
        {
          text: 'Hystrix',
          link: '/blog/springcloud/带你走进 SpringCloud2.0（五）：Hystrix'
        },
        {
          text: 'Apollo',
          link: '/blog/springcloud/带你走进 SpringCloud2.0（六）：Apollo'
        },
        {
          text: 'Zuul',
          link: '/blog/springcloud/带你走进 SpringCloud2.0（七）：Zuul'
        },
        {
          text: 'Sleuth',
          link: '/blog/springcloud/带你走进 SpringCloud2.0（八）：Sleuth'
        }
      ]
    }
    ,
    // ,
    // {
    //   text: 'RabbitMQ',
    //   items: [
    //     {
    //       text: '',
    //       items: [
    //         {
    //           text: 'broker',
    //           link: '/blog/rabbitmq/rabbitmqbroker'
    //         },
    //         {
    //           text: 'client',
    //           link: '/blog/rabbitmq/rabbitmqclient'
    //         },
    //         {
    //           text: 'boot',
    //           link: '/blog/rabbitmq/springboot'
    //         }
    //       ]
    //     },
    //   ]
    // },
    // ,
    {
      text: 'MySql',
      items: [
        {
          text: '',
          items: [
            {
              text: '树演化',
              link: '/blog/mysql/a树演化'
            },
            {
              text: '索引浅谈',
              link: '/blog/mysql/b索引浅谈'
            }
          ]
        }
      ]
    }
    ,
    // {
    //   text: 'MySql',
    //   items: [
    //     {
    //       text: '树演化',
    //       link: '/blog/mysql/a树演化'
    //     },
    //     {
    //       text: '索引浅谈',
    //       link: '/blog/mysql/b索引浅谈'
    //     },
    //     {
    //       text: '分库分表',
    //       link: '/blog/mysql/c分库分表'
    //     }
    //   ]
    // }
    // ,
    {
      text: 'GitHub',
      link: 'https://github.com/',
      icon: 'reco-github'
    }
  ]
}
