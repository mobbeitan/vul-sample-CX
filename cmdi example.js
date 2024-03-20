function productReviews () {
  return (req: Request, res: Response, next: NextFunction) => {
    const id = utils.disableOnContainerEnv() ? Number(req.params.id) : req.params.id

    // Measure how long the query takes, to check if there was a nosql dos attack
    const t0 = new Date().getTime()
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
  }
}
