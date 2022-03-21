module.exports = {
  head: [ // 注入到当前页面的 HTML <head> 中的标签
    ['link', { rel: 'icon', href: '/logo.jpg' }], // 增加一个自定义的 favicon(网页标签的图标)
  ],
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
              { title: "学前必读", path: "/pages/guide/study" }
          ]
        },
        {
          title: 'hls的学习',
          collapsable: false,
          path: '/pages/record/studyHls'
        },
        {
          title: '深入浅出组件传值',
          collapsable: false,
          path: '/pages/record/value'
        },
        {
          title: 'git从入门到放弃',
          collapsable: false,
          path: '/pages/record/git'
        },
        {
          title: '前端路由详解',
          collapsable: false,
          path: '/pages/record/router'
        },
        {
          title: '埋点数据上报',
          collapsable: false,
          path: '/pages/record/dataReport'
        },
        {
          title: 'svg与canvas',
          collapsable: false,
          path: '/pages/record/pictureMore'
        },
        {
          title: '移动端适配',
          collapsable: false,
          path: '/pages/record/flexable'
        },
        {
          title: '伪元素的使用',
          collapsable: false,
          path: '/pages/record/pseudoElement'
        },
        {
          title: 'Ts中的实践踩坑',
          collapsable: false,
          path: '/pages/record/tsStudy'
        },
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