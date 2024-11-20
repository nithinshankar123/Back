import mongoose from "mongoose";



export interface IUser extends Document{
   name:string,
   email:string,
   password:string
   designation:string,
   facultyId:string,
   photo:string,

}



const userSchema = new mongoose.Schema(
    {
      name: {
        type: String,
        required: [true, "name is required"],
      },
      email: {
        type: String,
        required: [true, "email is required and should be unique"],
        unique: true,
      },
      password: {
        type: String,
        required: [true, "password is required"],
      },
      designation:{
        type: String,
        required: [true, "designation is required"]
      },
      facultyId:{
        type: String,
        required: [true, "facultyId is required"]
      },
      photo:{
        type: String,
        required: false
      }
  
    },
    { timestamps: true }
  );




  let userModal = mongoose.model<IUser>('users',userSchema);


  export default userModal;