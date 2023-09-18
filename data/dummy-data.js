const Category = require("../models/category");
const Blog = require("../models/blog");
const slugField = require("../helpers/slugfield");
const User = require("../models/user");
const bcrypt = require("bcrypt")
const Role = require("../models/role")


async function populate() {
  const count = await Category.count();
  if (count == 0) {
    const user = await User.bulkCreate([
      {fullname:"Deniz Çintaş", email:"denizcintasq7@gmail.com", password:await bcrypt.hash("8193307",10)},
      {fullname:"Erdal Çintaş", email:"erdalcintasq7@gmail.com", password:await bcrypt.hash("8193307",10)},
      {fullname:"Mehmet Çintaş", email:"mehmetcintasq7@gmail.com", password:await bcrypt.hash("8193307",10)},
      {fullname:"Hüseyin Çintaş", email:"hüseyincintasq7@gmail.com", password:await bcrypt.hash("8193307",10)},
    ])

    const roles = await Role.bulkCreate ([
      {rolename:"admin"},
      {rolename:"moderator"},
      {rolename:"guest"},
    ])

    await user[0].addRole(roles[0]) // 0. usera admin rolü verdik  // admin herkesin blog bilgilerini görebilcek
    await user[1].addRole(roles[1])// 1. usera moderator rolü verdik // modarator sadece kendi yazdıklarını görücek
    await user[2].addRole(roles[1])// 2. usera moderator rolü verdik  
    await user[3].addRole(roles[2])// 3. usera misafir rolü verdik 


    const categories = await Category.bulkCreate([
      { name: "mobil geliştirme", url: slugField("mobil geliştirme") },
      { name: "web geliştirme",url: slugField("web geliştirme")  },
    ]);
    const blogs = await Blog.bulkCreate([
      {
        baslik: "Komple Uygulamalı Web Geliştirme Eğitimi",
        url: slugField("Gömülü sistemler"),
        altbaslik: "Sıfırdan ileri seviyeye 'Web Geliştirme': Html, Css, Sass, Flexbox, Bootstrap, Javascript, Angular, JQuery, Asp.Net Mvc&Core Mvc",
        aciklama: "çaş",
        resim: "1.jpg",
        anasayfa: true,
        userId: 2
      },
      {
        baslik: "Python ile Sıfırdan İleri Seviye Python Programlama",
        url: slugField("Pyhton kursu"),
        altbaslik: "Sıfırdan İleri Seviye Python Dersleri.Veritabanı,Veri Analizi,Bot Yazımı,Web Geliştirme(Django)",
        aciklama: "çaş",
        resim: "2.jpg",
        anasayfa: true,
        userId: 2
      },
      {
        baslik: "Sıfırdan İleri Seviye Modern Javascript Dersleri ES7+",
        url: slugField("Pyhton kursu"),
        altbaslik: "Modern javascript dersleri ile (ES6 & ES7+) Nodejs, Angular, React ve VueJs için sağlam bir temel oluşturun.",
        aciklama: "çaş",
        resim: "2.jpg",
        anasayfa: true,
        userId: 3
      },
      
    ]);
// bulk createler benim geçici test verilerim
   
    // bir numaralı id ye yanı categoryie bir numaralı blog eklenıyor
    await categories[0].addBlog(blogs[0]);
    await categories[0].addBlog(blogs[1]);
    await blogs[0].addCategory(categories[1]);
  }
}

module.exports = populate;
