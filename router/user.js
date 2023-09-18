const express = require("express");
const router = express.Router();

const userController = require("../controllers/user")

router.use("/about", function (req, res) {
  res.render("users/about");
});
// blog sayfasında category kullanmama kararı aldım ancak kod hazır
router.get("/blogs/category/:sluq",userController.blogs_by_category)
router.get("/blogs/:sluq",userController.blogs_details );
router.get("/blogs",userController.blog_list);
router.get("/", userController.index);

module.exports = router;
