module.exports = {
  title: 'leslieC的学习笔记',
  description: '虽然我卷，但我还是菜啊',
  configureWebpack: {
      resolve: {
        alias: {
        '@alias': 'path/to/some/dir'
      }
    }
  },
  themeConfig: {
      nav: [
          { text: '首页', link: '/' },
          { 
              text: 'LeslieC的 JavaScript 博客', 
              items: [
                  { text: 'Github', link: 'https://github.com/chenwenlong7' }
              ]
          }
      ]
  }
}