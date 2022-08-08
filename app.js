const express=require('express');
const mongoose=require('mongoose');
const Razorpay=require('razorpay');

let ejs=require('ejs');
let _=require('lodash')
let uploads=require('express-fileupload');
let app=express();
let port=process.env.PORT||5000;
app.use( express.static( "public" ) );
app.set('view engine','ejs');
app.use(express.urlencoded({extended:false}));
app.use(express.static('public'));
app.use(uploads());

let arr=[];
let match="";
let b="";
let regname="";
let pswd="";
let cpswd="";
let rollnum="";

const razorpay = new Razorpay({
    key_id: 'rzp_test_2Q4bCgE4Deh0y9',
    key_secret: 'Hu0z0JJqcNr6BdbcWS369pe2',
})

//   const uri="mongodb+srv://santhosh:1234@cluster0.xq2wt.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
  //    mongodb+srv://san:1234@cluster0.hjlcs.mongodb.net/myFirstDatabase?retryWrites=true&w=majority // recent
 const uri="mongodb+srv://Hari:12-Sep-01@cluster0.mengpxs.mongodb.net/?retryWrites=true&w=majority"
mongoose.connect(  uri ||'mongodb://localhost:27017/picdb');

mongoose.connection.on('connected',()=>{
    console.log("mongoDb connected");
});

let picSchema={
    bname:String,
    price:Number,
    name:String,
    num:String,
    email:Number,
   
    filename:[String],
   
}

let regSchema={
    name:String,
    pswd:String,
    cpswd:String
}

let bookingSchema={
    name:String,
    email:String,
    book:String,
    dept:String,
    collectdate:String,
    duedate:String,
    pincode:String,
    mobile:String
}

let picmodel= mongoose.model('pic',picSchema);

let regmodel=mongoose.model('reg',regSchema);

let Bookingmodel=mongoose.model('booking',bookingSchema);

app.get('/',(req,res)=>{
    res.render('login');
});

app.post('/order', (req, res)=> {
    let options = {
        amount: 50000,
        currency: "INR",
    };
    razorpay.orders.create(options, function (err, order){
        order_id_variable = order.id
        console.log(order)
        res.json(order)
    })
})

app.post('/is-order-complete', (req, res)=>{

        razorpay.payments.fetch(req.body.razorpay_payment_id).then((paymentDocument)=> {
            if(paymentDocument.status == 'captured'){
                res.redirect('/sucess')
            } else{
                res.redirect('/sucess')
            }
        })


})

app.get('/register',(req,res)=>{
    res.render('register')
})

app.get('/compose',(req,res)=>{
res.render('form');
});
app.get('/iregister',(req,res)=>{
    res.render('iregister')
})

app.get('/ilogin',(req,res)=>{
    res.render('ilogin');
})

app.get('/index',(req,res)=>{

    picmodel.find({},(err,found)=>{
        if(!err){
            res.render('index',{datas:found})
        }else{
            console.log(err);
        }
    })
    
});

app.get('/new/:topic',(req,res)=>{
     const name1 =req.params.topic

    picmodel.findOne({"bname":name1},(err,found)=>{
        if(!err){
            res.render('data',{data:found});
        }else{
            console.log(err);
        }
    })
})

app.get('/data',(req,res)=>{
    res.render('data');
});

app.get('/dataform',(req,res)=>{
    
    Bookingmodel.find({},(err,found)=>{
        if(!err){
            res.render('dataform',{data:found});
        }else{
            console.log(err);
        }
    })
   
})

app.get('/admin',(req,res)=>{
    picmodel.find({},(err,found)=>{
        if(!err){
            res.render('admin',{datas:found})
        }else{
            console.log(err);
        }
    })
})

app.get('/adminreg',(req,res)=>{
    res.render('adminreg');
});

app.get('/invalid',(req,res)=>{
    res.render('invalid');
});

app.get('/sucess',(req,res)=>{
    Bookingmodel.findOne({"rollnum":rollnum},(err,found)=>{
        if(!err){
            res.render('sucess',{data1:found});
        }else{
            console.log(err);
        }
    })
   
})

app.get('/booking',(req,res)=>{
    res.render('booking');
})


app.post('/',(req,res)=>{
    let name=req.body.name;
    let pass=req.body.pswd;

    regmodel.findOne({"name":name},(err,found)=>{
        if((found.name==name)&&(found.cpswd==pass)){
            res.redirect('/index');
        }else{
            res.redirect('/ilogin');
        }
    })

});

app.post('/table',(req,res)=>{
    let dele=req.body.checkbox;
    Bookingmodel.findByIdAndDelete(dele,(err)=>{
        if(!err){
            console.log("deleted sucessfully");
            res.redirect('/dataform');
        }else{
            console.log(err);
        }
    })
})

app.post('/register',(req,res)=>{
     regname=req.body.name;
     pswd=req.body.pswd;
     cpswd=req.body.cpswd;

     if(pswd==cpswd){

   let regdocs=new regmodel({
       name:regname,
       pswd:pswd,
       cpswd:cpswd
       
   }) ;

   regdocs.save().then(res=>console.log("",res));
   res.redirect('/');
}else{
    res.redirect('/iregister')
}

   

   
})

app.post('/adminreg',(req,res)=>{
    let email=req.body.email;
    let pass=req.body.pass;
    if((email=="hari98757@gmail.com")&&(pass=="12-Sep-01")){
        res.redirect('/admin');
    }else{
        res.redirect('/adminreg');
    }
})

app.post('/compose',(req,res)=>{
    let bname=req.body.name1;
   let price=req.body.price;
   let name=req.body.name2;
   let num=req.body.num;
   let email=req.body.email;
   let file=req.files.img;
   if(file.name){
     res.redirect('/invalid#book-pic');
   }else{
        for (var i=0;i<file.length;i++){
           b=file[i].name
             arr.push(b);
        }
     
        
        for(var i=0;i<file.length;i++){
          
            
            file[i].mv('./public/uploads/'+file[i].name,(err)=>{
                if(err){
                   console.log(err);
                }
            })
            console.log("uploaded sucessfully");
        }
       
    
    

    let picdocs=new picmodel({
       bname:bname,
       price:price,
       name:name,
       num:num,
       email:email,
       filename:arr
    });
    
            picdocs.save();

            arr=[];

    res.redirect('/admin#books');
   }
});

app.post('/delete',(req,res)=>{
    let dele=req.body.checkbox;
    picmodel.findByIdAndDelete(dele,(err)=>{
        if(!err){
            console.log("deleted sucessfully");
            res.redirect('/admin#books');
        }else{
            console.log(err);
        }
    })
    })

    app.post('/sucess',(req,res)=>{
        let date=new Date();
        let collectdate=date.getDate()+20 +'/'+date.getMonth()+'/'+date.getFullYear();
        let duedate=date.getDate()+20 +'/'+ date.getMonth()+'/'+date.getFullYear();
        let name=req.body.name;
        let email=req.body.email;
        let book=req.body.book;
        let dept=req.body.dept;
        let pincode=req.body.pincode;
        let mobile=req.body.mobile;

        let bookingdocs=new Bookingmodel({
            name:name,
            email:email,
            book:book,
            dept:dept,
            pincode:pincode,
            duedate:duedate,
            collectdate:collectdate,
            mobile:mobile
        });

        bookingdocs.save();

        res.redirect('/sucess');
    })
   

//schema

const CartSchema = new mongoose.Schema(
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      },
      products: [
        {
          productId: Number,
          quantity: Number,
          name: String,
          price: Number
        }
      ],
      active: {
        type: Boolean,
        default: true
      },modifiedOn: {
        type: Date,
        default: Date.now
      }
    },
    { timestamps: true }
  );
  
  let Cart = mongoose.model("Cart", CartSchema);

//   app.post("/cart", async (req, res) => {
//     const { productId, quantity, name, price } = req.body;
  
//     const userId = req.body._id; //TODO: the logged in user id
  
//     try {
//       let cart = await Cart.findOne({ userId });
  
//       if (cart) {
//         //cart exists for user
//         let itemIndex = cart.products.findIndex(p => p.productId == productId);
  
//         if (itemIndex > -1) {
//           //product exists in the cart, update the quantity
//           let productItem = cart.products[itemIndex];
//           productItem.quantity = quantity;
//           cart.products[itemIndex] = productItem;
//         } else {
//           //product does not exists in cart, add new item
//           cart.products.push({ productId, quantity, name, price });
//         }
//         cart = await cart.save();
//         return res.status(201).send(cart); }
  
//          else {
//         //no cart for user, create new cart
//         const newCart = await Cart.create({
//           userId,
//           products: [{ productId, quantity, name, price }]
//         });
  
//         return res.status(201).send(newCart);
//       }
//     } catch (err) {
//       console.log(err);
//       res.status(500).send("Something went wrong");
//     }
//   });


app.listen(port,(res)=>{
    console.log(`the server runs on ${port}`);
})
