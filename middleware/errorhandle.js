const errorHandler = (err, req, res, next) => {
    console.log(err);
  
    let message = err.message || "Internal server error";
    let statusCode = err.statusCode || 500;
  
    if (err.code === 11000) {
      message = "Duplicate key";
  
      if (err.keyValue.email) {
        message = "The email is already taken";
      }
  
      if (err.keyValue.username) {
        message = "The username is already taken";
      }
  
      statusCode = 400;
    }
  
    if (err.name === "ValidationError") {
      const fields = Object.keys(err.errors);
  
      fields.map((field) => {
        if (err.errors[field].kind === "maxlength") {
          message = "maxlength error";
        } else {
          message = "Unexpected error";
        }
      });
  
      statusCode = 400;
    }
  
    if (err.name === "CastError") {
      message = "Casting error for database";
      statusCode = 400;
    }
  
    res.status(200).json({ success: false,error:true, message,logout:err.logout,refreshPage:err.refreshPage });
  };
  
  module.exports = errorHandler;