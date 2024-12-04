// helpers/handlebars.js
import Handlebars from 'handlebars'

Handlebars.registerHelper('eq', function (a, b) {
  return a === b
})

Handlebars.registerHelper('ne', function (a, b) {
  return a !== b
})

Handlebars.registerHelper('hasSubCategorySelected', function (subCategories, currentCategoryId) {
  return subCategories.some((subCategory) => subCategory.subId === currentCategoryId)
})

Handlebars.registerHelper('or', function (a, b) {
  return a || b
})

Handlebars.registerHelper('between', function (value, min, max) {
  return value >= min && value <= max
})

Handlebars.registerHelper('add', function (a, b) {
  return a + b
})

Handlebars.registerHelper('subtract', function (a, b) {
  return a - b
})

Handlebars.registerHelper('formatDate', function (dateString) {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
})

Handlebars.registerHelper('paginationPages', function (currentPage, totalPages) {
  let startPage = Math.max(1, currentPage - 2)
  let endPage = Math.min(totalPages, currentPage + 2)
  let pages = []
  for (let i = startPage; i <= endPage; i++) {
    pages.push(i)
  }
  return pages
})

Handlebars.registerHelper('capitalize', function (str) {
  return str.charAt(0).toUpperCase() + str.slice(1)
})

Handlebars.registerHelper('compare', function (a, operator, b, options) {
  switch (operator) {
    case '==':
      return a == b ? options.fn(this) : options.inverse(this)
    case '!=':
      return a != b ? options.fn(this) : options.inverse(this)
    case '===':
      return a === b ? options.fn(this) : options.inverse(this)
    case '!==':
      return a !== b ? options.fn(this) : options.inverse(this)
    case '>':
      return a > b ? options.fn(this) : options.inverse(this)
    case '<':
      return a < b ? options.fn(this) : options.inverse(this)
    case '>=':
      return a >= b ? options.fn(this) : options.inverse(this)
    case '<=':
      return a <= b ? options.fn(this) : options.inverse(this)
    default:
      throw new Error(`Unknown operator: ${operator}`)
  }
})

Handlebars.registerHelper('default', function (value, defaultValue) {
  return value || defaultValue
})
