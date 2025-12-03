// logout.js
module.exports = function (app) {
  app.get("/admin/logout", (req, res) => {
    req.session.destroy(() => {
      res.redirect("/admin?msg=loggedout");
    });
  });
};
