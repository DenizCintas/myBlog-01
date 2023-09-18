module.exports= (err, req,res,next)=>{
    console.log("loglama",err.message);
    // hatayı yazdırdıktan sonra devam etmesi için next kullanıyoruz ve hatayı kaybetmemek için err yi nexte ekliyoruz
    next(err)
   }