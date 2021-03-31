import en from './en_US.json'
import zh from './zh_CN.json'

var messages = {
  en: en,
  zh_CN: zh
 }

// 填充空翻译
for (const locale in messages) {
  const data = messages[locale]
  for (const key in data) {
    if (!data[key]) {
      data[key] = en[key] || key
    }
  }
}
export default messages
