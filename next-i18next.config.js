/** @type {import('next-i18next').UserConfig} */
module.exports = {
  i18n: {
    defaultLocale: 'ar',
    locales: ['ar', 'en'],
    localeDetection: true,
  },
  localePath: './i18n/locales',
  reloadOnPrerender: process.env.NODE_ENV === 'development',
}