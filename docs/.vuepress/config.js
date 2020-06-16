const themeConfig = require('./config/theme/')

module.exports = {
  title: "风随缘",
  description: 'Java 架构师成长之路',
  // npm run build 生成静态文件的存放目录
  dest: './docs/.vuepress/dist',
  head: [
    ['link', { rel: 'icon', href: '/head.icon' }],
    ['meta', { name: 'viewport', content: 'width=device-width,initial-scale=1,user-scalable=no' }]
  ],
  theme: 'reco',
  themeConfig,
  markdown: {
    lineNumbers: true
  },
  plugins: ['@vuepress/medium-zoom', 'flowchart']
}
