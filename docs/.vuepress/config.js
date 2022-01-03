module.exports = {
  title: 'LeslieC的学习笔记',
  description: '虽然我卷，但我还是菜啊',
  configureWebpack: {
      resolve: {
        alias: {
        '@alias': 'path/to/some/dir'
      }
    }
  },
  plugins: [
    ['@vuepress/back-to-top'],
    ['@vuepress/nprogress'],
    ['@vuepress/search', {
      searchMaxSuggestions: 10
    }]
  ],
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
          { text: 'Github', link: 'https://github.com/chenwenlong7' }
        ]
      }
    ],
    sidebar: {
      '/pages/':[
        {
          title: '欢迎学习',
          collapsable: false, // 不折叠
          children: [
              { title: "学前必读", path: "/pages/guide/study.md" }
          ]
        },
        {
          title: '简单的测试',
          collapsable: false,
          path: '/pages/record/study1'
        }
      ]
    },
    sidebarDepth: 2,
    lastUpdated: 'Last Updated',
    serviceWorker: {
      updatePopup: {
          message: "有新的内容.",
          buttonText: '更新'
      }
    },
    editLinks: true,
    editLinkText: '在 GitHub 上编辑此页 ！'
  }
}