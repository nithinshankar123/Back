import { Router } from "express";
import { Request,Response,NextFunction } from "express";
import userModal from '../Modal/User';
import transectionModal from '../Modal/transaction';
import typeModal from "../Modal/TypeModal";
import multer from "multer";
import path from 'path'
import fs from 'fs'
import mongoose from "mongoose";


const router = Router();




const storage = multer.diskStorage({
    destination:(req:Request,file:Express.Multer.File,cb:Function)=>{
        const dir = path.join(__dirname,'../uploads/users');
        if(!fs.existsSync(dir)){
            fs.mkdirSync(dir,{recursive:true})
        }
        cb(null,dir)
    },
    filename:(req:Request,file:Express.Multer.File,cb:Function)=>{
        cb(null,`${Date.now()}-${file.originalname}`)
    }
});


const uploads = multer({storage:storage})








router.post('/register',uploads.single('photo'),async(req:Request,res:any,next:NextFunction)=>{
    console.log(req?.files,'file')
    try{
        const {name,email,password,designation,facultyId}=req.body;

        const photo = req.file?.filename;

        const checkfacultyid = await userModal.findOne({facultyId:facultyId ,email:email});


        if(checkfacultyid){
            return res.status(400).json({
                success:false,
                message:"Faculty already exict"
            })
        }else{
            const newFaculty = await userModal.create({
                name:name,
                email:email,
                password:password,
                designation:designation,
                facultyId:facultyId,
                photo:photo

            });

            if(newFaculty){
                return res.status(201).json({
                    success:true,
                    message:"Faculty created successfully",
                })
            }
        }
    }catch(error){
        console.log(error)
        return res.status(500).json({
            success:false,
            message:"Internal server error"
        })
    }
});





router.post('/login',async(req:Request,res:any,next:NextFunction)=>{
    try{
        const {email,password} = req.body;
        const professor = await userModal.findOne({email:email});
        if(professor){
            if(professor.password === password){
                return res.status(200).json({
                    success:true,
                    message:"Login Successfully",
                    data:professor
                })
            }else{
                return res.status(400).json({
                    success:false,
                    message:"Invalid Password"
                })
            }
        }else{
            return res.status(400).json({
                success:false,
                message:"Invalid Email"
            })
        }
    }catch(error){
        console.log(error)
        return res.status(500).json({
            success:false,
            message:"Internal server error"
        })
    }
}
);









// get the faculty
router.get('/profile/:id',async(req:Request,res:any,next:NextFunction)=>{
    try{
        const id : string = req.params.id as string;

        const user = await userModal.findById(id);

        if(user){
            return res.status(200).json({
                success:true,
                message:"Faculty profile",
                data:user
            })
        }

    }catch(error){
        console.log(error)
        return res.status(500).json({
            success:false,
            message:"Internal server error"
        })
    }
});


// update the profile
router.put('/profile/:id',uploads.single('photo'),async(req:Request,res:any,next:NextFunction)=>{
    try{
        const id : string = req.params.id as string;

        const user = await userModal.findById(id);

        if(!user){
            return res.status(404).json({
                success:false,
                message:"No User Found With This Id"
            })
        }else{
            const {name,email,facultyId,designation,password} = req.body;
            const photo = req.file?.filename;

            const updateprofessor = await userModal.findByIdAndUpdate(id,{name,email,facultyId,designation,photo,password});

            if(updateprofessor){
                return res.status(200).json({
                    success:true,
                    message:"update successfully"
                })
            }







        }

    }catch(error){
        console.log(error)
        return res.status(500).json({
            success:false,
            message:"Internal server error"
            })
    }
});




// add points
router.post('/addtype/:id',async(req:Request,res:any,next:NextFunction)=>{
    try{
        const id : string = req.params.id as string;
        const {maxPoints,types} = req.body;

        const checktype = await typeModal.findOne({facultyId:id,types:types});

        if(checktype){
            return res.status(400).json({
                success:false,
                message:"Type already exist"
            })
        }else{
            const newtype = await typeModal.create({
                facultyId:id,
                maxPoints:maxPoints,
                types:types
            });

            if(newtype){
                return res.status(201).json({
                    success:true,
                    message:"Type created successfully"
                })
            }
        }

    }catch(error){
        console.log(error)
        return res.status(500).json({
            success:false,
            message:"Internal server error"
        })
    }
});



// get all type
router.get('/gettype/:id',async(req:Request,res:any,next:NextFunction)=>{
    try{
        const id : string = req.params.id as string;

        const alltype = await typeModal.find({facultyId:id});

        if(alltype){
            return res.status(200).json({
                success:true,
                message:"All type",
                data:alltype
            })
        }

    }catch(error){
        console.log(error)
        return res.status(500).json({
            success:false,
            message:"Internal server error"
        })
    }
});


router.delete('/deletetype/:id',async(req:Request,res:any,next:NextFunction)=>{
    try{
        const id : string = req.params.id as string;

        const deletetype = await typeModal.findByIdAndDelete(id);

        if(deletetype){
            return res.status(200).json({
                success:true,
                message:"Type deleted successfully"
            })
        }

    }catch(error){
        console.log(error)
        return res.status(500).json({
            success:false,
            message:"Internal server error"
        })
    }
});




// add points
router.post('/addpoints/:id',async(req:Request,res:any,next:NextFunction)=>{
    try{
        const id : string = req.params.id as string;
        const {points,types,description,date} = req.body;
        console.log(points,types,description,date);
        const checktype = await typeModal.findById(types);
        if(checktype){
            const addpoints = await transectionModal.create({
                userid:id,
                points:points,
                types:types,
                description:description,
                date:date
            });

            if(addpoints){
                return res.status(201).json({
                    success:true,
                    message:"Points added successfully"
                })
            }
        }
    }catch(error){
        console.log(error)
        return res.status(500).json({
            success:false,
            message:"Internal server error"
        })
    }
});

router.put('/updatePoints/:userId/:updateId',async(req:Request,res:any,next:NextFunction)=>{
    try{
        const userId : string = req.params.userId as string;
        const updateId : string = req.params.updateId as string;
        const {points,types,description,date} = req.body;
        console.log(points,types,description,date);
        const checktype = await typeModal.findById(types);
        const checkUser= await userModal.findById(userId);
        const checkPoint= await transectionModal.findById(updateId);
        if(checktype&&checkPoint&&checkUser){
            const addpoints = await transectionModal.findByIdAndUpdate( updateId,{
                points:points,
                types:types,
                description:description,
                date:date
            });

            if(addpoints){
                return res.status(201).json({
                    success:true,
                    message:"Points Updated successfully"
                })
            }
        }
    }catch(error){
        console.log(error)
        return res.status(500).json({
            success:false,
            message:"Internal server error"
        })
    }
});


// get all points
// router.get('/getpoints/:id', async (req: Request, res: any, next: NextFunction) => {
//     try {
//         const id: string = req.params.id as string;
//         const { year, types, startdate, enddate } = req.query;

//         console.log(year, types, startdate, enddate);

//        let query;

//        if(year || types || startdate || enddate){
//         if(year){
//             query = {userid:new mongoose.Types.ObjectId(id)}
//         }
//         if(startdate && enddate){
//             query = {userid:id,date:{$gte:startdate,$lte:enddate}}
//         }
//        }

//         // Aggregate query
//         const aggregationPipeline: any[] = [
//             {
//                 $match: query
//             },
//             {
//                 $lookup: {
//                     from: "types",
//                     localField: "types",
//                     foreignField: "_id",
//                     as: "types"
//                 }
//             },
//             {
//                 $unwind: "$types"
//             }
//         ];

//         // Add types filter if provided
//         // if (types) {
//         //     aggregationPipeline.push({
//         //         $match: {
//         //             "types.types": { $in: (types as string).split(',') }
//         //         }
//         //     });
//         // }

//         const allpoints = await transectionModal.aggregate([
//             {
//                 $match: matchCriteria
//             },
//             {
//                 $lookup: {
//                     from: "types",
//                     localField: "types",
//                     foreignField: "_id",
//                     as: "types"
//                 }
//             },
//             {
//                 $unwind: "$types"
//             }
//         ]);

//         // console.log(allpoints, "allpoints");

//         if (allpoints.length > 0) {
//             return res.status(200).json({
//                 success: true,
//                 message: "All points",
//                 data: allpoints
//             });
//         } else {
//             return res.status(404).json({
//                 success: false,
//                 message: "No points found"
//             });
//         }

//     } catch (error) {
//         console.error(error);
//         return res.status(500).json({
//             success: false,
//             message: "Internal server error"
//         });
//     }
// });



router.get('/getpoints/:id', async (req: Request, res: any, next: NextFunction) => {
    try {
        const id: string = req.params.id as string;
        const { year, types, startdate, enddate } = req.query;

        console.log(year, types, startdate, enddate);

        // Initialize the match criteria with the user ID
        let matchCriteria: any = {
            userid: new mongoose.Types.ObjectId(id)
        };

        // Handle year filter
        if (year) {
            matchCriteria.date = {
                $gte: new Date(`${year}-01-01`), // Start of the year
                $lte: new Date(`${year}-12-31`)  // End of the year
            };
        }

        // Handle custom date range filter
        if (startdate && enddate) {
            matchCriteria.date = {
                $gte: new Date(startdate as string),
                $lte: new Date(enddate as string)
            };
        }

        // Prepare the aggregation pipeline
        const aggregationPipeline: any[] = [
            {
                $match: matchCriteria // Match the criteria built above
            },
            {
                $lookup: {
                    from: "types",
                    localField: "types",
                    foreignField: "_id",
                    as: "types"
                }
            },
            {
                $unwind: "$types" // Unwind the types array
            }
        ];

        // Add types filter if provided
        if (types) {
            aggregationPipeline.push({
                $match: {
                    "types.types": { $in: (types as string).split(',') }
                }
            });
        }

        // Execute the aggregation
        const allpoints = await transectionModal.aggregate(aggregationPipeline);

        console.log(allpoints, "allpoints");

        if (allpoints.length > 0) {
            return res.status(200).json({
                success: true,
                message: "All points",
                data: allpoints
            });
        } else {
            return res.status(404).json({
                success: false,
                message: "No points found"
            });
        }

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
});








router.get('/getdashboard/:id',async(req:Request,res:any,next:NextFunction)=>{
    try{
        const id : string = req.params.id as string;

        const allpoints = await transectionModal.aggregate([
            {
              '$match': {
                'userid': new mongoose.Types.ObjectId(id)
              }
            }, {
              '$addFields': {
                'year': {
                  '$year': '$date'
                }
              }
            }, {
              '$lookup': {
                'from': 'types', 
                'localField': 'types', 
                'foreignField': '_id', 
                'as': 'data'
              }
            }, {
              '$unwind': {
                'path': '$data'
              }
            }, {
              '$group': {
                '_id': '$year', 
                'poins': {
                  '$sum': '$points'
                }
              }
            }, {
              '$sort': {
                '_id': 1
              }
            }
          ]);


        if(allpoints){
            return res.status(200).json({
                success:true,
                message:"Dashboard",
                data:allpoints
            })
        }

    }catch(error){
        console.log(error)
        return res.status(500).json({
            success:false,
            message:"Internal server error"
        })
    }
});



router.get('/getdashboards/:id',async(req:Request,res:any,next:NextFunction)=>{
    try{
        const id : string = req.params.id as string;
        const allpoints = await transectionModal.aggregate(
            [
                {
                  '$match': {
                    'userid': new mongoose.Types.ObjectId(id)
                  }
                }, {
                  '$addFields': {
                    'year': {
                      '$year': '$date'
                    }
                  }
                }, {
                  '$lookup': {
                    'from': 'types', 
                    'localField': 'types', 
                    'foreignField': '_id', 
                    'as': 'data'
                  }
                }, {
                  '$group': {
                    '_id': {
                      'type': '$data.types', 
                      'year': '$year'
                    }, 
                    'points': {
                      '$sum': '$points'
                    }
                  }
                }
              ]
        );


        if(allpoints){
            return res.status(200).json({
                success:true,
                message:"Dashboard",
                data:allpoints
            })
        }

    }catch(error){
        console.log(error)
        return res.status(500).json({
            success:false,
            message:"Internal server error"
        })
    }
});






router.put('/forgotpassword',async(req:Request,res:any,next:NextFunction)=>{
    try{
        const {email,password} = req.body;

        const user = await userModal.findOne({email:email})
        console.log(user,'user')

        if(user){
            const updatepassword = await userModal.findByIdAndUpdate(user._id,{password:password});
            if(updatepassword){
                return res.status(200).json({
                    success:true,
                    message:"Password updated successfully"
                })
            }
        }else{
            return res.status(400).json({
                success:false,
                message:"Invalid Email"
            })
        }

    }catch(error){
        console.log(error)
        return res.status(500).json({
            success:false,
            message:"Internal server error"
        })
    }
});

router.delete('/deletePoints/:id',
async(req:Request,res:any,next:NextFunction)=>{
    try{
        const id : string = req.params.id as string;
const  respo = await transectionModal.findByIdAndDelete(id)
if (respo) {
    return res.status(200).json({
        success: true,
        message: "points deleted successfully"
    })
} else {
    return res.status(400).json({
        success: false,
        message: "Invalid id"
    })
}

    }catch(error){
        console.log(error);
        
    }
}
)






export default router;