const Blog = require("../models/blog");
const Category = require("../models/category");
const { Op } = require("sequelize");

exports.blogs_by_category = async function (req, res) {
  const sluq = req.params.sluq;
  try {
    const blogs = await Blog.findAll({
      include: {
        model: Category,
        where: { url: sluq },
      },
      raw: true,
    });

    const categories = await Category.findAll({ raw: true });

    res.render("users/index", {
      blogs: blogs,
      categories: categories,
      selectedCategory: sluq,

    });
  } catch (err) {
    console.log(err);
  }
};
exports.blogs_details = async function (req, res) {
  const sluq = req.params.sluq;
  try {
    const blog = await Blog.findOne({
      where: {
        url: sluq,
      },
      raw: true,
    });
    if (blog) {
      return res.render("users/blog-details", {
        blog: blog,
  
      });
    }
    res.redirect("/404");
  } catch (err) {
    console.log(err);
  }
  res.render("users/blog-details");
};
exports.blog_list = async function (req, res) {
  // sayfalama ilk 5 blog gelsin dedik
  const size = 4;
  const {page = 0} = req.query;
  try {
    const {rows, count} = await Blog.findAndCountAll({
      where: {
        anasayfa: {
          [Op.eq]: true, // onay=1
        },
      },
      raw: true,
      limit : size,
      // sıfırncı sayfadaysak offset 0 olur yani ilk 5 gelir 1. sayfaya geçince 5 gelir 
      offset : page * size
    });
    const categories = await Category.findAll({ raw: true });

    res.render("users/blogs", {
      title: "Tüm Kurslar",
      blogs: rows,
      totalItems: count,
      // oluşturulcal sayfa sayınısını blogları size bölüyoruz
      totalPages:Math.ceil( count/size),
      // anlık hangi sayfada oldugumu görmek için
      currentPages: page,
   
      
    });
  } catch (err) {
    console.log(err);
  }
};
exports.index = async function (req, res) {
  console.log(req.cookies);
  try {
    const blogs = await Blog.findAll({
      where: {
        [Op.and]: [{ anasayfa: true }],
      },
      raw: true,
    });
    const categories = await Category.findAll({ raw: true });

    res.render("users/index", {
      title: "Popüler Kurslar",
      blogs: blogs,
      categories: categories,
      selectedCategory: null,
    
    });
  } catch (err) {
    console.log(err);
  }
};
