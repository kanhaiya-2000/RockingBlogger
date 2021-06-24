exports.generateOTP = (n) =>{
  let otp = 0;
  for(var i=0;i<n;i++){
    otp = otp*10 + Math.floor(Math.random()*10);
  }
  return parseInt(otp);
}