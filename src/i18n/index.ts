import i18n from 'i18next'   // 导入 i18next 库
import { initReactI18next } from 'react-i18next'   // 导入 react-i18next 的初始化模块
import LanguageDetector from 'i18next-browser-languagedetector'   // 导入语言检测模块

import en from './locales/en.json'  // 导入英文语言包
import zh from './locales/zh.json'  // 导入中文语言包

i18n   // 初始化 i18next
  .use(LanguageDetector)  // 使用语言检测插件
  .use(initReactI18next)  // 将 i18next 与 React 绑定
  .init({
    resources: {
      en: { translation: en },   // 配置英文语言资源
      zh: { translation: zh }    // 配置中文语言资源
    },
    fallbackLng: 'en',   // 设置默认语言为英文
    supportedLngs: ['en', 'zh'],   // 支持的语言列表
    interpolation: {
      escapeValue: false
    },   // 配置插值选项
    detection: {
      order: ['localStorage', 'navigator'],   // 检测语言的顺序
      caches: ['localStorage']   // 缓存检测到的语言到本地存储
    }
  })

export default i18n  // 导出已初始化的 i18next 实例
