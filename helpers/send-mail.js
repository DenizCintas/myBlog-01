const nodemailer = require("nodemailer")
const  config = require("../config")
var transporter = nodemailer.createTransport({
    //SMTP, bir e-posta göndermek için sunucu ile istemci arasındaki iletişim şeklini belirleyen protokol
    host:"smtp.gmail.com",
    //Wi-Fi ağı güvenli değilse, Kaspersky Secure Connection belirttiğiniz ülkede bulunan özel olarak ayrılmış bir sunucuyla güvenli bir bağlantıyı etkinleştirmek isteyip istemediğinizi sorar.
    secureConnection: false,
//Türk Telekom, SPAM MAIL gönderimini azaltmak icin bugüne kadar standart olarak kullanılan SMTP 25 portunu 587 olarak değiştirme kararı aldı. Biz de sunucularımızda hem 25 hem de 587 portunu açarak müşterilerimizin mail gönderme problemi yaşamasını önledik.
    port:587,
    //Transport Layer Security Taşıma Katmanı Güvenliği ve onun öncülü/selefi olan Güvenli Soket Katmanı, bilgisayar ağı üzerinden güvenli haberleşmeyi sağlamak için tasarlanmış kriptolama protokolleridir
    tls:{
        ciphers:"SSLv3"
    },
    // bağlanırken kullancak olduğumuz bilgiler
    auth:{
        user:config.email.username,
        pass:config.email.password 
    }
})

module.exports = transporter