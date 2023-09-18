// sınıflar tanımlanırken büyük harf ile başlanır
//BUNLAR MODELLERİMİZ
const Blog = require("../models/blog");
const Category = require("../models/category");
const Role = require("../models/role")
const User = require("../models/user")
const { Op } = require("sequelize");
// fotoğrafı günceledikten sorna eski fotoğrafın silinmesi
const fs = require("fs");
const sequelize = require("../data/db");
const sluqFeild = require("../helpers/slugfield");


exports.get_blog_delete = async function (req, res) {
  const blogid = req.params.blogid;
  const userid = req.session.userid;
  const isAdmin = req.session.roles.includes("admin")

  try {
    // const [blogs] = await db.execute("select * from blog where blogid=?", [blogid,]);
    // const blog = blogs[0];
    const blog = await Blog.findOne({
      // id:blogid idsi sadeece blogid ye göre  sorgulansın demek
      where: isAdmin ? {id:blogid} :{
      id:blogid,
      // kim bloğu eklediyse o silmiş olucak
      userId: userid
    }});
    if (blog) {
      return res.render("admin/blog-delete", {
        title: "delete blog",
        blog: blog,
      });
    } else {
      res.redirect("/admin/blogs");
    }
  } catch (err) {
    console.log(err);
  }
};
exports.post_blog_delete = async function (req, res) {
  const blogid = req.body.blogid;
  try {
    const blog = await Blog.findByPk(blogid);
    if (blog) {
      // veri tabanında ki veriyi silme komutu
      await blog.destroy();
      return res.redirect("/admin/blogs?action=delete");
    } else {
      res.redirect("/admin/blogs");
    }
  } catch (err) {
    console.log(err);
  }
};
exports.get_category_delete = async function (req, res) {
  const categoryid = req.params.categoryid;

  try {
    // const [categories] = await db.execute("select * from category where categoryid=?",[categoryid] );
    // const category = categories[0];
    const category = await Category.findByPk(categoryid);
    if (category) {
      res.render("admin/category-delete", {
        title: "delete category",
        category: category,
      });
    } else {
      res.redirect("admin/category-delete");
    }
  } catch (err) {
    console.log(err);
  }
};
exports.post_category_delete = async function (req, res) {
  const categoryid = req.body.categoryid;
  try {
    // await db.execute("delete from category where categoryid=?", [categoryid]);
    // res.redirect("/admin/categories?action=delete");
    await Category.destroy({
      where: {
        id: categoryid,
      },
    });
    return res.redirect("/admin/categories?action=delete");
  } catch (err) {
    console.log(err);
  }
};
exports.get_blog_crate = async function (req, res) {
  try {
    // const [categories] = await db.execute("select * from category");
    const categories = await Category.findAll();
    res.render("admin/blog-create", {
      title: "add blog",
      categories: categories,
    });
  } catch (err) {
    console.log(err);
  }
};
exports.post_blog_create = async function (req, res) {
  const baslik = req.body.baslik;
  const altbaslik = req.body.altbaslik;
  const aciklama = req.body.aciklama;
   // file üretilmeden filename ulaşmaya çalışırsak ahta alırız bu yüzden önce kontrol edicez
  //const resim = req.file.filename;
  const anasayfa = req.body.anasayfa == "on" ? 1:0;
  const userid = req.session.userid;
  let resim = "";


  try {

    if(baslik == "") {
      throw new Error("başlık boş geçilemez");
  }
  
  if(baslik.length < 5 || baslik.length > 20) {
      throw new Error("başlık 5-20 karakter aralığında olmalıdır.");
  }
  
  if(aciklama == "") {
      throw new Error("aciklama boş geçilemez");
  }
  
      // req.file var mı diye baktık varsa filename ekledik 
  if(req.file) {
      resim = req.file.filename;
  
      fs.unlink("./public/images/" + req.body.resim, err => {
          console.log(err);
      });
  }
    await Blog.create({
      baslik: baslik,
      url: sluqFeild(baslik),
      altbaslik: altbaslik,
      aciklama: aciklama,
      resim: resim,
      anasayfa: anasayfa,
      userId: userid
  
    });
    res.redirect("/admin/blogs?action=create");
  } catch (err) {
    let hataMesajı =""
    //instanceof errnin Errordan üretilen bir obje oluğ olmadığpını kontrol ediyor
    if(err instanceof Error){

      hataMesajı += err.message;
      // bize hata mesajını get blogu değil üstteki kısım getireceği için hata mesajını kaybetmeden tekrtar render ediyorum bu yüzden kategorşi bilgilerini yeniden ihtiyacımız olduğu için tekrar finlaAll ile çağırıyoruz

      res.render("admin/blog-create", {
        title: "add blog",
        categories: await Category.findAll(),
        message: {text : hataMesajı,class: "danger"},
        // glog eklerken boş bir kısım yada hatalı bir şey yapınca yazdığımız her şey silinir her yer boş gelir bunun olmaması için son yazdığımuız şeyleri kayıtlı gelsin
      // ve daha  sonra blog-create.ejs gibip  baslik:baslik,altbaslik: altbaslik,  aciklama:aciklama olan kısımları dzüenliyoruz
        values:{
          baslik:baslik,
          altbaslik: altbaslik,
          aciklama:aciklama

        }
      });
    }
  }
};
exports.get_category_create = async function (req, res) {
  try {
    res.render("admin/category-create", {
      title: "add category",
    });
  } catch (err) {
    console.log(err);
  }
};
exports.post_category_create = async function (req, res) {
  const name = req.body.name;
  try {
    await Category.create({ name: name });
    res.redirect("/admin/categories?action=create");
  } catch (err) {
    res.redirect("/500")
  }
};
exports.get_blog_edit = async function (req, res) {
  const blogid = req.params.blogid;
  const userid = req.session.userid;

  const isAdmin = req.session.roles.includes("admin")
  try {
    const blog = await Blog.findOne({
// bir moderatorün eklediği blogu bir diğer moderator editlememesi gerekiyor ancak admin için geçerli değil bu yüzden " : " sonra koşula userid ekliyoruz
      where: isAdmin ? {id:blogid} :
       // bir moderatorün eklediği blogu bir diğer moderator eklememesi gerekiyor bu  yüzden useridleri alıyoruz 
      {
        id:blogid,
        userId:userid
      },
      include:{
        model:Category,
        attributes:["id"]
      }
    })
    const categories = await Category.findAll();

    if (blog) {
      return res.render("admin/blog-edit", {
        title: blog.dataValues.baslik,
        blog: blog.dataValues,
        categories: categories,
      });
    }

    res.redirect("/admin/blogs");
  } catch (err) {
    console.log(err);
  }
};
exports.post_blog_edit = async function (req, res) {
  const blogid = req.body.blogid;
  const baslik = req.body.baslik;
  const altbaslik = req.body.altbaslik;
  const aciklama = req.body.aciklama;
  const kategoriIds= req.body.categories
  const userid = req.session.userid;
  let resim = req.body.resim;
  if (req.file) {
    // edit sayfasında resmin güncellenmesi
    resim = req.file.filename;
    // silincek resim hiddenda mevcut
    fs.unlink("./public/images/" + req.body.resim, (err) => {
      console.log(err);
    });
  }
  const anasayfa = req.body.anasayfa == "on" ? 1 : 0;
  

  try {
    const blog = await Blog.findOne({
      where:{
        id:blogid,
        userId:userid
      },
      include:{
        model:Category,
        attributes:["id"]
      }
    })
    if (blog) {
      // gelen bilgide baslik bilgisi varsa bu bilgiyi set ediyoruz
      blog.baslik = baslik;
      blog.altbaslik = altbaslik;
      blog.aciklama = aciklama;
      blog.resim = resim;
      blog.anasayfa = anasayfa;
      
        if(kategoriIds == undefined){
          await blog.removeCategories(blog.categories)
        }else{
          await blog.removeCategories(blog.categories)
          const selectedCategories = await Category.findAll({
            where: {
              id: {
                [Op.in] : kategoriIds
              }
            }
          });
            await blog.addCategories(selectedCategories)
        }


      // veri tabanına kayıt işlemi olduktan sonra sayfayı yönlendiriyoruz
      await blog.save();

      return res.redirect("/admin/blogs?action=edit&blogid=" + blogid);
    } else {
      res.redirect("/admin/blogs");
    }
  } catch (err) {
    console.log(err);
  }
};
exports.get_category_remove = async function(req,res){
const blogid = req.body.blogid
const categoryid = req.body.categoryid;

  await sequelize.query(`delete from blogcategories where blogId=${blogid} and categoryId=${categoryid}`)
 res.redirect("/admin/categories/"+ categoryid)

}
exports.get_category_edit = async function (req, res) {
  const categoryid = req.params.categoryid;

  try {
    // findByPk ile id sorgulama yaparak categorileri getiriyoruz.
    // yukarda aldığımız req.params.categoryid sayesinde id ile veriyi buluyoruz
    const category = await Category.findByPk(categoryid);
    //Lazy loading ile verileri teker teker( ihtiyacımız olan kadar ) alma. Veri tabanından bilgileri 3 soruguda çekiyoruz. Bunları tek sorduguda hepsini çekmeye Eager loading denir
    const blogs = await category.getBlogs();
    const countBlog = await category.countBlogs();

    if (category) {
      return res.render("admin/category-edit", {
        title: category.dataValues.name,
        category: category.dataValues,
        blogs: blogs,
        countBlog: countBlog,
      });
    }

    res.redirect("admin/categories");
  } catch (err) {
    console.log(err);
  }
};
exports.post_category_edit = async function (req, res) {
  const categoryid = req.body.categoryid;
  const name = req.body.name;

  try {
    await Category.update(
      { name: name },
      {
        where: {
          id: categoryid,
        },
      }
    );
    return res.redirect(
      "/admin/categories?action=edit&categoryid=" + categoryid
    );
  } catch (err) {
    console.log(err);
  }
};
exports.get_blog = async function (req, res) {
  // login olan kullanıcının idsini alıyoruz
  const userid = req.session.userid
// moderatore rolüne sahipse true döner
  const isModerator= req.session.roles.includes("moderator")
  // admin rolüne sahipse true döner
  const isAdmin= req.session.roles.includes("adm,n")
  try {
    //const [blogs] = await db.execute("select blogid, baslik, altbaslik, resim from blog");
    // findAll İLe blog tablosudndaki bilgilere ulaştık ve attributes sayesinde kolanları seçtik. log(blogs dersek bilgileri görebiliriz)
    const blogs = await Blog.findAll({
      attributes: ["id", "baslik", "altbaslik", "resim"],
      // blob list sayfasındaki tabloya kategoriyi eklemek için category tablosunuda cağırdım 
      include: {
        model: Category,
        attributes: ["name"]
      },
      // sorugulamayı  moderatore göre yapıcaz zatem admin her şeyi görebiliyor olucak
      //moderatorse ve admin değilse gelen değer true ise userıdye göre filtreleme yaparız diğer durumda null döndürürüz
      where: isModerator && !isAdmin ? {
        // herbie blogun userId kolonu gelen userid numarasıyla eşleşen kaydı al
        // ancak bu durum sadece modarator için geçerli bu yüzden login olan kullanıcının useridsine göre user içirsinden bu bilgiyi alıcaz bunun için bunu gidip /controllers/auth.js deki post.login üzerinden yapıcaz 
        userId: userid
      }: null
    });

    res.render("admin/blog-list", {
      title: "blog list",
      blogs: blogs,
      action: req.query.action,
      blogid: req.query.blogid,
    });
    
  } catch (err) {
    console.log(err);
  }
};
exports.get_category = async function (req, res) {
  try {
    const categories = await Category.findAll();
    res.render("admin/category-list", {
      title: "blog list",
      categories: categories,
      action: req.query.action,
      categoryid: req.query.categoryid,
    });
  } catch (err) {
    console.log(err);
  }
};
exports.get_roles = async function (req, res) {
  try {
    // bütün role tablosunu çektik
    const roles = await Role.findAll({
      attributes:{
        // fn() fonksiyonu ile role.id ve role.rolnameler bize gelcek ve onlara ait olan kaç kullanıcı var bunu COUNT ile sayıyoruz(users.id sayıyoruz)
          include:["role.id","role.rolename",[sequelize.fn("COUNT",sequelize.col("users.id")),"user_count"]]
      },
      include:[
        {model:User,attributes:["id"]}
      ],
      //burda da grupladık çünkü COUNT grupladıktan sonra user bilgilerini sayıyor
      group:["role.id"],
      // sadece kayıtları almak için raw true
      raw:true,
      // burda da gelen hatanını önüne geçiyoruz
      includeIgnoreAttributes: false
    })
    
    res.render("admin/role-list", {
      roles: roles
    });
  } catch (err) {
    console.log(err);
  }
};
exports.get_role_edit = async function (req, res) {
  const roleid = req.params.roleid
  try {
  const role = await Role.findByPk(roleid);
  const users = await role.getUsers()
  if(role){
return res.render("admin/role-edit",{
  role:role,
  users:users
})
  }
  res.redirect("admin/roles")
  } catch (err) {
    console.log(err);
  }
};
exports.post_role_edit = async function (req, res) {
  const roleid = req.body.roleid;
  const rolename= req.body.rolename
  try {
  await Role.update({
    rolename:rolename
  },{
    where:{
      id:roleid
    }
  })
   return res.redirect("/admin/roles")
  } catch (err) {
    console.log(err);
  }
};
exports.roles_remove = async function (req, res) {
  const roleid = req.body.roleid;
  const userid= req.body.userid
  try {
    //sequelize.query sql sorugusu yazmak için
 await sequelize.query(`delete from userroles where userId=${userid} and roleId=${roleid}`)
   return res.redirect("/admin/roles/" +roleid)
  } catch (err) {
    console.log(err);
  }
};
exports.get_user = async function(req,res){
  try{
const users = await User.findAll({
  // almak istediğim kolonlar 
  attributes:["id","fullname","email"],
  include: {
    model: Role,
    attributes:["rolename"]
  }
})
res.render("admin/user-list",{
  users:users
})
  }
  catch(err){
console.log(err);
  }
}
exports.get_user_edit= async function(req,res){
  const userid = req.params.userid
  try{
    const user= await User.findOne({
      where:{
        // id yukardan userid ile eşleşeni al
        id:userid
      },
      include:{
        // her user ile eşleleşen rolelerini alıcaz allırkende bütün bilgilerini almaya gerek yok attribute ile alamk istediğimiz kolanaları seçelim 
        model:Role, 
      attributes:["id"]
      }
    })
const roles = await Role.findAll()
res.render("admin/user-edit", {
  user:user,
  roles: roles
})
  }
  catch(err){
console.log(err);
  }
}
exports.post_user_edit= async function(req,res){
  const userid = req.body.userid
  const fullname = req.body.fullname
  const email = req.body.email
  const roleIds = req.body.roles
  try{
    const user= await User.findOne({
      where:{
        // id yukardan userid ile eşleşeni al
        id:userid
      },
      include:{
        // her user ile eşleleşen rolelerini alıcaz allırkende bütün bilgilerini almaya gerek yok attribute ile alamk istediğimiz kolanaları seçelim 
        model:Role, 
      attributes:["id"]}})
      if(user){
        user.fullname = fullname;
        user.email= email

        if(roleIds == undefined){
          await user.removeRoles(user.roles)
        }else{
          // kullanıcının rollerini temizliyoruz
          await user.removeRoles(user.roles)
          // eklenicek roleri alıyoruz
          const selectedRoles = await Role.findAll({
            where:{
              id:{
                [Op.in]:roleIds
              }
            }
          })
          // daha sonra roleri kullanıcı ile ilişkilendiriyoruz
          await user.addRoles(selectedRoles)
        }

        await user.save()
        return res.redirect("/admin/users")
      }
      // eğer user bilgsisi yoksa sayfa yönlendir
     return  res.redirect("/admin/users")
  }
  catch(err){
console.log(err);
  }
}