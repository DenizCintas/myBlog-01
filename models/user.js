const { DataTypes } = require("sequelize");
const sequelize = require("../data/db");
const bcrypt = require("bcrypt");


const User = sequelize.define("user", {
    fullname: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: "ad soyad girmelisiniz"
            },
            isFullname(value) {
                // kullanıcının ad soyadını ayırt etmekl için split kullanız
                // örnek "deniz çintaş" aradaki boşluktan split bölücek ve kalan elamanları sayıcaz kalan elaman 2 tane ise sorun yok ama 1 ise sadece "Deniz" girmiş oluyor
                // spliye boşluktan ayır dedik ve kalan sonuç bizim için bir dizi 
                // bu dizininde lenghtine bakıcaz eğer 2 den azsa bir sorun vardır
                // bizde bu sonu throw ile geri döndürücez
                if(value.split(" ").length < 2) {
                    throw new Error("Lütfen ad ve soyad bilginizi giriniz.");
                }
            }
        }
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        // email için bir kısıtlama ekleme emailin sadece bir kere kullanılmasını sağlar
        unique : {
            args: true,
            msg: "email daha önce alınmış"
        },
         validate:{
            // boş string kabul etmez
            notEmpty:{
                msg :"email girmelisiniz"
            },
            // email formatında olmalı demek
            isEmail: {
                msg:" email olmalıdır"
            }
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate:{
            notEmpty:{
                msg :"parola boş geçilemez"
            },
            len: {
                args: [5,10],
                msg:"parolanız 5-10 karakter uzunluğunda olmalıdır"
            }
           
        }
    },
    resetToken:{    
    type:DataTypes.STRING,
    allowNull:true,
    },
    //sıfırlama likinin süresinin ne kadar olacağı kısım 
    
    resetTokenExpiration:{    
    type:DataTypes.DATE,
    allowNull:true,
    }
}, { timestamps: true});

// parolanın validatelenmesi
// artıık parola burda haslenicek auth.js de heslemiyoruz
User.afterValidate( async (user) => {
  user.password = await bcrypt.hash(user.password, 10);
})

module.exports = User;
