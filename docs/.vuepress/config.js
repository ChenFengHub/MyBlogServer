module.exports = {
  //网站标题
  title: `ChenFeng's Blog `,
  // 主页描述
  description: 'Learn Web development together',
  // 要部署的仓库名字
  base: '/',
  dest: './docs/.vuepress/dist',
  head: [
    //图片放大的支持 begin
    [
      'script',
      {
        src:
          'https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.slim.min.js'
      }
    ],
    [
      'script',
      {
        src:
          'https://cdnjs.cloudflare.com/ajax/libs/fancybox/3.5.2/jquery.fancybox.min.js'
      }
    ],
    [
      'link',
      {
        rel: 'stylesheet',
        type: 'text/css',
        href:
          'https://cdnjs.cloudflare.com/ajax/libs/fancybox/3.5.2/jquery.fancybox.min.css'
      }
    ],
    //图片放大的支持 end
    ['link', { rel: 'icon', href: '/home.jpg' }]
  ],
  // 主题配置
  themeConfig: {
    // 导航配置
    nav: [
      {
        text: '博客',
        // link: '/blog/',
        items: [{ text: '笔记', link: '/blog/rabbitmq/rabbitmqbroker' }]
      }
    ],
    sidebar: [
      {
        title: 'RabbitMQ',
        collapsable: true,
        children: ['/blog/rabbitmq/rabbitmqbroker']
      },
      {
        title: 'MySQL', // 侧边栏名称
        collapsable: true, // 可折叠
        children: [
          '/blog/mysql/a树演化', // md 文件地址
          '/blog/mysql/b索引浅谈', // md 文件地址
          '/blog/mysql/c分库分表' // md 文件地址
        ]
      }
    ],
    // plugins: ['@vuepress/active-header-links', '@vuepress/back-to-top'],
    editLinkText: '编辑此页',
    lastUpdated: '上次更新',
    sidebarDepth: 1
  },
  plugins: [
    '@vuepress/active-header-links',
    ['@vuepress/plugin-back-to-top', true],
    // 'vuepress-plugin-smooth-scroll',
    'vuepress-plugin-medium-zoom',
    [
      'copyright',
      {
        noCopy: false, // 选中的文字将无法被复制
        minLength: 10 // 如果长度超过 100 个字符
      }
    ],
    [
      '@vuepress/register-components',
      {
        componentsDir: './theme/components'
      }
    ]
  ]
}
