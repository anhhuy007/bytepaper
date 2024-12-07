// middlewares/errorHandler.js

const errorHandler = (err, req, res, next) => {
  console.error(err)
  const statusCode = err.statusCode || 500

  if (req.xhr || req.headers.accept.indexOf('json') > -1) {
    res.status(statusCode).json({ success: false, message: err.message || 'Internal Server Error' })
  } else {
    res.status(statusCode).render('error', { error: err.message })
  }
}

export default errorHandler
