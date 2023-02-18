// jshint esversion:6

// module.exports=   function(){
// const date = new Date();
// let options = { weekday: 'long', day: 'numeric',month: 'long' };
// var day=date.toLocaleString('en-US', options);
// return day;
// };
      // or
// module.exports= getDate;
// function getDate(){
// const date = new Date();
// let options = { weekday: 'long', day: 'numeric',month: 'long' };
// var day=date.toLocaleString('en-US', options);
// return day;
// };


module.exports.getDate = function(){
const date = new Date();
let options = { weekday: 'long', day: 'numeric',month: 'long' };
var day=date.toLocaleString('en-US', options);
return day;
};

module.exports.getDay = function(){
const date = new Date();
let options = { weekday: 'long'};
var day=date.toLocaleString('en-US', options);
return day;
};

// Now I can use both
