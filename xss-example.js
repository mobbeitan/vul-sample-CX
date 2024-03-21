import utils = require('../lib/utils')
import challengeUtils = require('../lib/challengeUtils')
import { Request, Response, NextFunction } from 'express'
import { Review } from 'data/types'

const challenges = require('../data/datacache').challenges
const security = require('../lib/insecurity')
const db = require('../data/mongodb')

var urlParams = new URLSearchParams(window.location.search);
var name = urlParams.get('name');

var unsafe_div = window.document.getElementById("vulnerable-div");
unsafe_div.innerHTML = "Hello " + name; 


const id = utils.disableOnContainerEnv() ? Number(req.params.id) : req.params.id

db.reviews.find({ $where: 'this.product == ' + id }).then((reviews: Review[]) => {
  const t1 = new Date().getTime()
  challengeUtils.solveIf(challenges.noSqlCommandChallenge, () => { return (t1 - t0) > 2000 })
  const user = security.authenticatedUsers.from(req)
  for (let i = 0; i < reviews.length; i++) {
    if (user === undefined || reviews[i].likedBy.includes(user.data.email)) {
      reviews[i].liked = true
    }
  }
  res.json(utils.queryResultToJson(reviews))
}, () => {
  res.status(400).json({ error: 'Wrong Params' })
})
