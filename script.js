// import * as functions from "firebase-functions";

// export const helloWorld = functions.https.onRequest((request, response) => {
//   response.send("Hello from Firebase!");
// });


// If you want the dropdown to disappear when you move the mouse away
var dropdowns = document.querySelectorAll('.dropdown');

dropdowns.forEach(function(dropdown) {
  dropdown.addEventListener('mouseleave', function() {
    dropdown.querySelector('.dropdown-menu').style.display = 'none';
  });
});

const button1 = document.getElementById("bt1");
const button2 = document.getElementById("bt2");
const Aptform = document.getElementById("form1");

// Add an event listener to the button
button1.addEventListener('click', function() {
  // Display the form
  Aptform.style.display = 'block';
});
button2.addEventListener('click', function()  {
  // Display the form
  Aptform.style.display = 'block';
});






const firebaseConfig = {
  apiKey: "AIzaSyDjPuTIJH8ZaCT3G6xkXSvAX9XsaxWdL_8",
  authDomain: "healthcare-e994c.firebaseapp.com",
  databaseURL: "https://healthcare-e994c-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "healthcare-e994c",
  storageBucket: "healthcare-e994c.appspot.com",
  messagingSenderId: "786358937864",
  appId: "1:786358937864:web:5df9a3123a71a5c832e4bd",
  measurementId: "G-XMCYW9JFF0"
};

firebase.initializeApp(firebaseConfig);
var healthcareDB= firebase.database().ref("healthcare");

document.getElementsByClassName("form1").addEventListener("submit",submitForm);

// var database = firebase.database();
// var formRef = database.ref('form-data');

function submitForm(e){
e.preventDefault();
  var name=document.getElementById("name").value;
  var age=document.getElementById("age").value;
  var gender=document.getElementById("gender").value;
  var number=document.getElementById("number").value;
  var address=document.getElementById("address").value;
  var reason=document.getElementById("reason").value;

console.log(name,age,gender,number,address,reason);
  
  }
  const getElementVal=(id)=>{
    return document,getElementById(id).value;

  // var formData={
  //    name:name,age:age,gender:gender,number:number,address:address,reason:reason

  };

  // formRef.push(formData);
  // document.getElementById("form1").reset();
  // alert("Your Appointment Booked!");
 

// var database= firebase.database();
// var myRef = database.ref("C:\Users\aksha\OneDrive\Desktop\Web\web practice\web project");
// myRef.set("Hello");

// var submitBtm=document.getElementById("submit-btn");
// submitBtm.addEventListener("click",submitForm);