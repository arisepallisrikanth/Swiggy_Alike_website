const {MongoClient}=require('mongodb')
const express=require('express')
const bodyParser=require('body-parser')
const path=require('path')

const PORT=3000
const app=express()
app.use(bodyParser.json())
app.set('view engine','ejs')
app.set('views',path.join(__dirname,'views')) 
app.use(bodyParser.urlencoded({extended:true}))
app.use(express.static("public"))
var Restaurants=[{'Name':'Indian Accent',"Status":"Online","url":'https://www.indianaccent.com/newdelhi/images/reservationImg-3.jpg'},
{'Name':'Adaa at Falaknuma Palace',"Status":"Offline",'url':'https://media-cdn.tripadvisor.com/media/photo-s/09/8a/c4/33/taj-falaknuma-palace.jpg'},
{'Name':'Karavalli',"Status":"Online",'url':'https://media-cdn.tripadvisor.com/media/photo-s/1b/2d/2f/94/karavalli-garden.jpg'},
{'Name':'Yauatcha',"Status":"Offline",'url':'https://media-cdn.tripadvisor.com/media/photo-s/12/4b/23/d5/modern-exterior.jpg'},
{'Name':'Jamavar',"Status":"Online",'url':'https://media-cdn.tripadvisor.com/media/photo-s/0e/d3/c0/01/jamavar.jpg'}]
// async function CreateHotels() {
//     const client=new MongoClient('mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.0.1')
//     const db=client.db('Swiggy')
//     const collection=db.collection('Restaurants')
//     await collection.insertMany([{'Name':'Indian Accent',"Status":"Online","url":"https://www.indianaccent.com/newdelhi/images/reservationImg-3.jpg"},
//     {'Name':'Adaa at Falaknuma Palace',"Status":"Offline",'url':'https://media-cdn.tripadvisor.com/media/photo-s/09/8a/c4/33/taj-falaknuma-palace.jpg'},
//     {'Name':'Karavalli',"Status":"Online",'url':'https://media-cdn.tripadvisor.com/media/photo-s/1b/2d/2f/94/karavalli-garden.jpg'},
//     {'Name':'Yauatcha',"Status":"Offline",'url':'https://media-cdn.tripadvisor.com/media/photo-s/12/4b/23/d5/modern-exterior.jpg'},
//     {'Name':'Jamavar',"Status":"Online",'url':'https://media-cdn.tripadvisor.com/media/photo-s/0e/d3/c0/01/jamavar.jpg'}])
//     // collection.deleteMany({})
// }
// CreateHotels()

async function createMenu(){
    const client=await new MongoClient('mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.0.1')
    const db=client.db('Swiggy')
    const collection1=db.collection('Indian Accent')
    const collection2=db.collection('Karavalli')
    const collection3=db.collection('Jamavar')
    await collection1.insertMany([
        {'item': 'Restr1_Sushi','Cost':1000},
        {'item':'Restr1_Rendang','Cost':50},
        {'item':'Restr1_Ramen','Cost':230},
        {'item':'Restr1_Tom Yam Goong','Cost':430},
        {'item':'Restr1_Kebab','Cost':500},
    ])
    await collection2.insertMany([
        {'item': 'Restr2_Sushi','Cost':1000},
        {'item':'Restr2_Rendang','Cost':50},
        {'item':'Restr2_Ramen','Cost':230},
        {'item':'Restr2_Tom Yam Goong','Cost':430},
        {'item':'Restr2_Kebab','Cost':500},
    ])
    await collection3.insertMany([
        {'item': 'Restr3_Sushi','Cost':1000},
        {'item':'Restr3_Rendang','Cost':50},
        {'item':'Restr3_Ramen','Cost':230},
        {'item':'Restr3_Tom Yam Goong','Cost':430},
        {'item':'Restr3_Kebab','Cost':500},
    ])
    // await collection1.deleteMany({})
    // await collection2.deleteMany({})
    // await collection3.deleteMany({})


}
// createMenu()
app.get('/',async(req,res)=>{
 res.render('Homepage.ejs')
})


app.get('/restaurants',async(req,res)=>{
    // const client=await new MongoClient('mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.0.1')
    // const dbs=client.db('Swiggy')

    // const collections=dbs.collection('Restaurants')

    // const Restaurants=await collections.find().toArray()
    res.render("index.ejs",{"Restaurants":Restaurants})
   


})
app.get('/OnlineRestaurants',async(req,res)=>{
//     const client=new MongoClient('mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.0.1')
// const db=client.db('Swiggy')
// const collection=db.collection('Restaurants')

// const Restaurants=await collection.find({"Status":"Online"}).toArray()
const onlineRestaurants=Restaurants.filter(object=>object.Status==="Online")
res.render('index.ejs',{"onlineRestaurants":onlineRestaurants,'OnlineRestr':true})

})
app.get('/foodMenu/:id',async(req,res)=>{
    const restr=req.params.id
    const client=await new MongoClient('mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.0.1')
    const db=client.db('Swiggy')
    const collection=db.collection(restr)
    const foodmenu=await collection.find().toArray()
    res.render('index.ejs',{foodmenu:foodmenu})
})
app.get('/placeOrder',(req,res)=>{
    res.render('index.ejs',{ordered:true})

})
// localStorage.setItem('vsv','vwv')
var history_items=[]
var history_ele=[]
app.post('/history',(req,res)=>{
    history_items.push(req.body.items)
    console.log(history_items)
    var history_items_time=(history_items.map(item=>item.join(''))).join('')
    console.log(history_items_time)
    history_ele=history_items_time.split('**')

    
})
app.get('/hist',(req,res)=>{
    console.log(history_ele)
    res.render('history.ejs',{'history_ele':history_ele,'history':true})
})

// Owner

app.get('/Owner',(req,res)=>{
  
    res.render('ownerPage.ejs',{'deliveryOrders':history_ele.slice(0,history_ele.length-1)})
})
var statusInitial=[]    
var status
var adminUpdate=false
app.post('/deliveryAdmin',(req,res)=>{
    adminUpdate=true
    statusInitial.push(req.body)
    console.log('/////')
    console.log(statusInitial)
    console.log('*****')
    status=statusInitial.reduceRight((acc,i)=>{
    const exsOb=acc.find(j=>Object.keys(i)[0]===Object.keys(j)[0])
    console.log('((((')

    console.log(exsOb)
    console.log('))))')

    if(!exsOb){
        acc.push(i)
    }
    // acc.push(i)
    return  acc
    
  },[{'hi':'bye'}])
  console.log(status)
  console.log('############')
  
})
app.get('/delivery',(req,res)=>{
    console.log(status)
    res.render('history.ejs',{'status':status,'history_ele':history_ele,"adminUpdate":adminUpdate})
    
})
app.get("/admin",async(req,res)=>{
    // const client=await new MongoClient('mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.0.1')
    // const dbs=client.db('Swiggy')

    // const collections=dbs.collection('Restaurants')

    // const Restaurants=await collections.find().toArray()

    res.render('admin.ejs',{"Restaurants":Restaurants})
})

app.get("/newRestr",async(req,res)=>{
    res.render('admin.ejs',{'create':true})
})
app.post("/newRestr",async(req,res)=>{
    Restaurants.push(req.body)
    console.log(Restaurants)
})
app.get("/deleteRestr/:restrName",async(req,res)=>{
    const restrName=req.params.restrName
    
    Restaurants=Restaurants.filter(object=>object.Name!==restrName)
    
})
app.get("/restaurantOwners",async(req,res)=>{
    res.render('RestrOwner.ejs',{'Restaurants':Restaurants})
})
app.post("/editStatus/:restrName",async(req,res)=>{
    const restrName=req.params.restrName
    Restaurants=Restaurants.map(object=>{
        if(object.Name===restrName){
            object['Status']=req.body.editStatus
        }
        return object
    })
   

})
app.get("/editFoodMenu/:id",async(req,res)=>{
    const restr=req.params.id
    const client=await new MongoClient('mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.0.1')
    const db=client.db('Swiggy')
    const collection=db.collection(restr)
    const foodmenu=await collection.find().toArray()
    res.render('RestrOwner.ejs',{"foodmenu":foodmenu,"restr":restr})
})
app.post('/createMenu/:restr',async(req,res)=>{
    const restr=req.params.restr
    const client=await new MongoClient('mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.0.1')
    const db=client.db('Swiggy')
    const collection=db.collection(restr)
    collection.insertOne(req.body)

})
app.post("/deleteFoodItem/:restr",async(req,res)=>{
    const restr=req.params.restr
    const client=await new MongoClient('mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.0.1')
    const db=client.db('Swiggy')
    const collection=db.collection(restr)
    collection.deleteOne(req.body)

})
app.listen(PORT,()=>console.log(`Server running on ${PORT}`))

