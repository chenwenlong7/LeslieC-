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
  locales: {
    '/': {
      lang: 'zh-CN'
    }
  },
  themeConfig: {
    base: '/study',
    subSidebar: 'auto',
    nav: [
      { text: '首页', link: '/' },
      { 
        text: 'LeslieC的 JavaScript 博客', 
        items: [
          { text: 'Github', link: 'https://github.com/chenwenlong7' },
          { text: 'Github', link: 'https://github.com/chenwenlong7' }
        ]
      }
    ],
    sidebar: [
      {
          title: '欢迎学习',
          path: '/',
          collapsable: false, // 不折叠
          children: [
              { title: "学前必读", path: "/" }
          ]
      },
      {
        title: "基础学习",
        path: '/handbook/ConditionalTypes',
        collapsable: false, // 不折叠
        children: [
          { title: "条件类型", path: "/handbook/ConditionalTypes" },
          { title: "泛型", path: "/handbook/Generics" }
        ],
      }
    ]
  }
}