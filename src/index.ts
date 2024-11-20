import  express  from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import cors from 'cors';
import faculty from "./Controller/Professor";
import path from 'path';




const app = express();
app.use(express.json())
app.use(bodyParser.urlencoded({extended:true}))
app.use(cors());

app.use('/uploads',express.static(path.join(__dirname, 'uploads')));







const server = async() =>{
    try{
        const databaseconnect = await mongoose.connect('mongodb://localhost:27017/professorPerformance')

        if(databaseconnect){
            app.listen(5000,()=>{
                console.log("mongo db is connected")
                console.log('server is running on port 5000')
            })
        }

    }catch(error){
        console.log(error)
        process.exit(1)
    }
};


app.use('/api/v1',faculty)



server()