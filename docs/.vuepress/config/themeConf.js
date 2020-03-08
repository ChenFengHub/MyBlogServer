module.exports = {
  sidebar: 'auto',
  sidebarDepth: 1,
  nav: [
    // 导航配置
    {
      text: '首页',
      link: '/blog/rabbitmq/rabbitmqbroker'
    },
    {
      text: 'rabbitmq 入门',
      items: [
        {
          text: '入门',
          items: [
            {
              text: 'broker',
              link: '/blog/rabbitmq/rabbitmqbroker'
            },
            {
              text: 'client',
              link: '/blog/rabbitmq/rabbitmqclient'
            },
            {
              text: 'boot',
              link: '/blog/rabbitmq/springboot'
            }
          ]
        },
      ]
    },
    {
      text: 'mysql',
      items: [
        {
          text: '树演化',
          link: '/blog/mysql/a树演化'
        },
        {
          text: '索引浅谈',
          link: '/blog/mysql/b索引浅谈'
        },
        {
          text: '分库分表',
          link: '/blog/mysql/c分库分表'
        }
      ]
    }
  ]
}
