exports.generateOTP = (n) =>{
  let otp = ""; 
  let possibleChars = "qwertyuiopQWERTYUIOPASDFGHJKLMNBVCXZasdfghjklzxcv1290345678bnm";//62^n possibilities now in 5 attempt
  for(var i=0;i<n;i++){
    otp+= possibleChars[Math.floor(Math.random()*possibleChars.length)];
  }
  return otp;
}