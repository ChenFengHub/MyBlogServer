// config 目录下必须有 index.js，否则无法直接引入 config  下其他配置文件
const { themeConf } = require('./config/')
module.exports = {
  // 引入 vuepress-theme-reco 插件
  theme:'reco',
  //网站标题
  title: `ChenFeng's Blog `,
  // 主页描述
  description: 'Java 架构师必备',
  // 要部署的仓库名字
  base: '/',
  // dest: './docs/.vuepress/dist',
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
  themeConfig: themeConf,
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
