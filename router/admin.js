const express = require("express");
const router = express.Router();


const imageUpload = require("../helpers/image-upload");
// link korumasının çağırılması
const isAdmin = require("../middlewares/is-admin")
const csrf = require("../middlewares/csrf");
const adminController = require("../controllers/admin");
const isModerator = require("../middlewares/is-moderator");


// blog delete
router.get("/blog/delete/:blogid",isModerator,csrf, adminController.get_blog_delete);
router.post("/blog/delete/:blogid", isModerator,adminController.post_blog_delete);
// categories delete
router.get("/category/delete/:categoryid",isAdmin,csrf, adminController.get_category_delete);
router.post(
  "/category/delete/:categoryid",isAdmin,
  adminController.post_category_delete
);
// blog oluşturma
router.get("/blog/create",isModerator,csrf, adminController.get_blog_crate);

router.post("/categories/remove",isAdmin, adminController.get_category_remove)

router.post("/blog/create",isModerator,csrf,imageUpload.upload.single("resim"),adminController.post_blog_create
);
// categori ekleme
router.get("/category/create", isAdmin,csrf,adminController.get_category_create);
router.post("/category/create",isAdmin, adminController.post_category_create);
// blog edit
router.get("/blogs/:blogid",isModerator, csrf,adminController.get_blog_edit);
router.post( "/blogs/:blogid",isModerator,csrf,imageUpload.upload.single("resim"),adminController.post_blog_edit
);
// categories edit
router.get("/categories/:categoryid",isAdmin, csrf,adminController.get_category_edit);
router.post("/categories/:categoryid",isAdmin, adminController.post_category_edit);
// caregories remove

// kullanığımız ikinci paremetre(isAdmin) link koruması örneğin bir kullanıcı /admin/crate gitmek isterse login sayfasına yönlendirilecek
router.get("/blogs",isModerator,adminController.get_blog);
router.get("/categories",isAdmin,adminController.get_category);

// Kullanıcı roleri
router.get("/roles",isAdmin, adminController.get_roles);
 router.get("/roles/:roleid",isAdmin, csrf, adminController.get_role_edit);
 // remove postu üste olması gerekiyor
 router.post("/roles/remove",isAdmin, adminController.roles_remove);
 router.post("/roles/:roleid",isAdmin, adminController.post_role_edit);

router.get("/users", isAdmin,adminController.get_user)
router.get("/users/:userid", isAdmin,csrf,adminController.get_user_edit)
router.post("/users/:userid", isAdmin,adminController.post_user_edit)


module.exports = router;
