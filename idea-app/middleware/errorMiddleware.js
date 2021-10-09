const errorMiddleware = (err, req, res, next) => {
  console.log(err?.message, "err");
  return res.status(500).render("pages/error", {
    title: "Error",
  });
};

module.exports = { errorMiddleware };
