'use strict'

const login = require('./login')
const model = require('./model')
const models = require('../models')
const gpuUsage = require('./gpu-usage')
const cfpSearch = require('./cfp-search')
const manage = require('./manage')
const takeOutGarbage = require('./take-out-garbage')
const express = require('express')
const {staticWebApp} = require('../config')

function apiRoute () {
  let api = express.Router()

  let emailLogin = [login.forceLogin, login.emailDomain]

  api.post('/login', login.googleIdTokenLogin)
  api.post('/logout', emailLogin, login.logout)
  api.get('/', login.checkLogin, (req, res) => { res.send(login.simpleLoginWeb(req.user)) })

  let sys = model(models.System)
  api.get(sys.route, emailLogin, sys.index)
  api.post(sys.idRoute, emailLogin, sys.record, sys.editable, sys.update)

  api.get('/workstations', emailLogin, gpuUsage)
  api.get('/takeOutGarbage', emailLogin, takeOutGarbage)
  api.get('/conference/search', emailLogin, cfpSearch)
  api.get('/user', login.checkLogin, login.userInfo)

  let m = model()
  for (let route of [['post', 'advance'], ['post', 'postpone'], ['post', 'weekday'], ['get', 'next']]) {
    api[route[0]]('/seminar/' + route[1], emailLogin, m.admin, manage.seminar[route[1]])
  }
  for (let route of [['post', 'advance'], ['post', 'postpone']]) {
    api[route[0]]('/garbage/' + route[1], emailLogin, m.admin, manage.garbage[route[1]])
  }

  let _models = [models.Seminar, models.News, models.Slide, models.ContactList, models.Conference, models.EMail]
  for (let m of _models) {
    let args = {}
    if (m.name === 'EMail') args.route = 'emailSchedule'

    m = model(m, args)

    api.get(m.route, emailLogin, m.index)
    api.post(m.route, emailLogin, m.creatable, m.new)
    api.delete(m.idRoute, emailLogin, m.record, m.editable, m.delete)
    api.post(m.idRoute, emailLogin, m.record, m.editable, m.update)
  }
  return api
}

module.exports = function (app) {
  // app.use(require('helmet'))
  app.use(require('./settings/session'))

  if (staticWebApp) {
    app.use(require('./settings/history')) // redirects all GET excepts /api to index.html
    app.use(express.static('./static'))
  } else {
    app.use(require('./settings/cors'))
  }

  app.use('/api', apiRoute())

  app.use(login.unauthorizedError)
}
