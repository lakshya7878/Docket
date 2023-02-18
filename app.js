// jshint esversion:6

const express = require('express');
const app = express();
// const port = 3000;
app.use(express.static('public'));
const date = require(__dirname + "/date.js");
const cors = require('cors');
app.use(cors());
const mongoose = require('mongoose');
// mongoose.connect('mongodb://localhost:27017/todolist');


mongoose.connect('mongodb+srv://Anupam149:Annug149@cluster0.79vil.mongodb.net/ToDoList');
// mongoose.connect('mongodb+srv://Anupam149:Annug149@cluster0.up4ku.mongodb.net/todolistDB');

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({
  extended: true
}));
app.set('view engine', 'ejs');

let _ = require('lodash');

var day = date.getDay(); // -------> through date.js
day=_.lowerCase(day);  // --------> through lodash

const itemSchema = new mongoose.Schema({
  name: String
});
const Item = mongoose.model('Item', itemSchema); // Collection made from schema // Item (where I is capital) is the model, 'Item' is going to become collection which is items in terminal when show collection

const item1 = new Item({
  name: 'Welcome to your ToDoList !'
});
const item2 = new Item({
  name: 'Hit the + button to add a new Item'
});
const item3 = new Item({
  name: '<--  Hit this to delete an Item'
});

const defaultItems = [item1, item2, item3];


const listSchema = new mongoose.Schema({
  name: String,
  items: [itemSchema]
  // establishing relation between schemas (video no . 340) ,
  // if       items: itemSchema , then items can be item1 or anything, which is created like "const item1 = new Item({ name: 'Welcome to your ToDoList !' });"
  // but now we are using array of itemSchema, items: [itemSchema] , therefore there is an array like [item1,item2]. therefore directly inserting defaultItems
});
const List = mongoose.model('List', listSchema);

app.get('/', (req, res) => {
  Item.find({}, function(err, foundItems) { // foundItems is an array , which will come when use Item.find
    // console.log(foundItems);

    if (foundItems.length == 0) {
      Item.insertMany(defaultItems, function(err) {
        if (!err)
          console.log("Successfully saved defaultItems to DB collection Item");
        res.redirect("/");
      });
    }
    else{
      if (!err)
      res.render('index',{ listTitle: day, items: foundItems });
    }
  });
});


app.post('/', (req, res) => {
  const newItem = req.body.newItem;
  // Item.insertMany(newItem,function(err){console.log(err);}); ----> pehle create krr gadhe
  const listName = req.body.list;
  const item = new Item({name: newItem});
  // console.log(listName,day);
  if ( _.lowerCase(listName) == day) {
    item.save();
    res.redirect('/');
  } else {
    console.log(item.name);
    List.findOne({
      name: listName
    }, function(err, foundList) {
      if (!err) {
        foundList.items.push(item);
        foundList.save();
        res.redirect("/" + listName);
      }
    });
  }
});

app.get('/:currentListName', (req, res) => {

  const currentListName = req.params.currentListName;
  // console.log(currentListName);
  List.findOne({ name: currentListName}, function(err, foundList) {
    if (!err) {
      if (!foundList) {
        // Creating new list
        const list = new List({
          name: currentListName,
          items: defaultItems
        });
        list.save();
        res.redirect("/" + currentListName);
      } else {
        // Show an existing List
        res.render('list', {
          listTitle: foundList.name,
          items: foundList.items
        });
      }
    }
  });

});

// // FOR NORMAL ONE PAGE TODAY LIST
//
// app.post('/delete',(req,res) =>{
//   const checkboxID=req.body.checkbox;
//   console.log(checkboxID);
//
//  // Item.findByIdAndRemove(checkboxID,function(err){
//  //   if(err)
//  //   console.log(err);
//  //   else console.log("Success");
//  // });
//  console.log(typeof(checkboxID));
//  Item.findOneAndRemove({ _id:checkboxID },function(err){
//    if(err)
//    console.log(err);
//    else console.log("Success");
//  });
// // doing mistake in value="<%=item._id%>", it should be exactly the same, no change must be there.
//   res.redirect("/");
// });



// FOR ANY LIST
app.post('/delete', (req, res) => {
  const checkboxID = req.body.checkbox;
  const listName = req.body.list;
  console.log(checkboxID);
  console.log(typeof(checkboxID));
  console.log(listName, day);
  if (_.lowerCase(listName)== day) {
    Item.findOneAndRemove({
      _id: checkboxID
    }, function(err) {
      if (!err)
        res.redirect("/");
    });
    // doing mistake in value="<%=item._id%>", it should be exactly the same, no change must be there.

  } else {
    // https://stackoverflow.com/questions/14763721/mongoose-delete-array-element-in-document-and-save
    // https://www.mongodb.com/docs/manual/reference/operator/update/pull/
    List.findOneAndUpdate({
      name: listName
    }, {
      $pull: {
        items: {
          _id: checkboxID
        }
      }
    }, function(err) {
      if (!err)
        res.redirect("/" + listName);
    });
  }
});
app.listen(process.env.PORT || 3000, () => {
  console.log(`Example app listening on port 3000`);
});
