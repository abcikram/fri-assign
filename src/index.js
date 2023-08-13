import express from "express";
import Colors from 'colors';
import mongoose from 'mongoose'
import Router from '../src/router/router.js'



const app = express();


app.use(express.json());


//global middleware :-
app.get('/',(req,res) =>{
    res.send("hello")
})


mongoose.connect('mongodb+srv://roy146571:Ska1FanAZAgUX18k@cluster0.xpt1akt.mongodb.net/bitspeed', {
    useUnifiedTopology: true,
    useNewUrlParser: true,
})
    .then(() => console.log(`Database Connected`.bgBlue.underline))
    .catch((error) => console.log(error.message));

app.use('/',Router)



const PORT =  process.env.PORT || 8000;

app.listen(PORT,() =>{
    console.log(`Server running on port ${PORT}`.yellow.bold)
})

