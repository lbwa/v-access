const path = require('path')

exports.fromRoot = p => path.join(__dirname, '..', p)

exports.__DEV__ = process.env.NODE_ENV === 'development'
