//这是项目发布阶段需要用到的babel插件
const prodPlugins = []
if(process.env.NODE_ENV === 'production'){
  prodPlugins.push('transform-remove-console')
}

module.exports = {
  'presets': [
    '@vue/app'
  ],
  'plugins': [
    [
      'component',
      {
        'libraryName': 'element-ui',
        'styleLibraryName': 'theme-chalk'
      }
    ],
    // 'transform-remove-console'
    //发布产品时候的插件数组
    ...prodPlugins,
    //配置路由懒加载
    '@babel/plugin-syntax-dynamic-import'
  ]
}
