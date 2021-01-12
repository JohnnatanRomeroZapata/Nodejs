exports.getPageNotFound = (req, res, next) => {
  res.status(404).render("pageNotFound", {
    pageTitle: "Page not found",
    path: "",
    productCSS: false,
    formCSS: false,
  });
};
