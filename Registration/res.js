
  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-app.js";
  import { getDatabase, ref,set,onValue, child,get} from "https://www.gstatic.com/firebasejs/9.10.0/firebase-database.js";

  
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: "AIzaSyCECQw2ktx3_bYgPKNp5XGmi8RLB0VZIzE",
    authDomain: "pronotebook-398b0.firebaseapp.com",
    projectId: "pronotebook-398b0",
    storageBucket: "pronotebook-398b0.appspot.com",
    messagingSenderId: "899071845708",
    appId: "1:899071845708:web:22ac0f9e78856c86725be9",
    measurementId: "G-CM5MZERTK9"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const  Database=getDatabase(app)

  //Parse Url 
 let currentUrl=window.location.href
 let paramiter=(new URL(currentUrl)).searchParams
 let id_name_url=paramiter.get('id')
 let id_phone_url=paramiter.get('phone')
 let id_cookies=paramiter.get("url")

//  Base URl
 let home_base_url ="http://127.0.0.1:5500/Home/home.html"

//  All Variable
  const form  = document.querySelector("#addform")
  const login  = document.querySelector("#log-in")

  const home  = document.querySelector(".home-btn") 

  const loader =document.querySelector(".load")
  const sing_loader =document.querySelector(".singIn_load")

  const alert=document.querySelector('.get_alert')
  const alert_login=document.querySelector('.get_alert_edite')

  const singUp=document.querySelector(".singUpForm")
  const singIn=document.querySelector(".singInForm")


// Registration Form Handle
form.addEventListener("submit",function(e){
    e.preventDefault()
    const User={}
   ;[...this].forEach(value=>{
       if(value.type!=="submit" && value.type!=="checkbox"){
          User[value.name]=value.value
       }
   })
    
   if(is_validField()){
    user_sing_up(User)
    }
  
})

// Input Fields Validation Function

function is_validField(){
  if( username_Is_valid() ===true && phone_Is_valid()===true  && Password_Is_valid() === true){
    return true
  }
  else{
    return false
  }
}

// User Input Field Validation function
form["UserName"].addEventListener('input',username_Is_valid)
function username_Is_valid(e){
  let name=e ? e.target.value.trim() : form["UserName"].value.trim() 
  let nextdiv=form["UserName"].nextElementSibling
   if(name.length<3)
   {
     invalid(form["UserName"],nextdiv,"User is empty")
     return false
   }
   else {
    valid(form["UserName"],nextdiv,"")
    return true
   }
}

// Phone Input Field Validation function
form["Phone"].addEventListener('input',phone_Is_valid)
function phone_Is_valid(e){
  let phone=e ? e.target.value.trim() : form["Phone"].value.trim()
  let nextdiv=form["Phone"].nextElementSibling
  
  if(phone.length==0)
  {
    invalid(form["Phone"],nextdiv,"Phone is empty")
     return false
  }
  else if(phone.length<11 || phone.length>11){
    invalid(form["Phone"],nextdiv,"Phone must 11 char")
     return false
   }
   else {
     valid(form["Phone"],nextdiv,"")
     return true
   }
}

// Password Input Field Validation function
form["Password"].addEventListener('input',Password_Is_valid)
function Password_Is_valid(e){
  let password=e ? e.target.value.trim() : form["Password"].value.trim()
  let nextdiv=form["Password"].nextElementSibling
   
  if(password.length ==0){
    invalid(form["Password"],nextdiv,"Password is empty")
     return false
   }

  if(password.length <= 5){
    invalid(form["Password"],nextdiv,"Password must be 6 char")
     return false
   }
   else {
     valid(form["Password"],nextdiv,"")
     return true
   }
}

// Show PASSWORD Input Field Validation function
form["checkbox"].addEventListener('input',show_password)

function show_password(e){
   let show=e.target.checked
     if(show){
      form["Password"].type ="text"
     }else{
      form["Password"].type ='password'
     }
}


// log in Form Handle
login.addEventListener("submit",function(e){
  e.preventDefault()
  const User={}
 ;[...this].forEach(value=>{
     if(value.type!=="submit" && value.type!=="checkbox"){
        User[value.name]=value.value
     }
 })
  
 if(log_is_validField()){
   User.time=new Date().toLocaleDateString("en-US")
   user_sing_in(User)
 }

})

// Input Fields Validation Function
function log_is_validField(){
  if( log_phone_Is_valid()===true  && log_Password_Is_valid() === true){
    return true
  }
  else{
    return false
  }
}

// Phone Input Field Validation function
login["Phone"].addEventListener('input',log_phone_Is_valid)
function log_phone_Is_valid(e){
  let phone=e ? e.target.value.trim() : login["Phone"].value.trim()
  let nextdiv=login["Phone"].nextElementSibling
  
  if(phone.length==0)
  {
    invalid(login["Phone"],nextdiv,"Phone is empty")
     return false
  }
  else if(phone.length<11 || phone.length>11){
    invalid(login["Phone"],nextdiv,"Phone must 11 char")
     return false
   }
   else {
     valid(login["Phone"],nextdiv,"")
     return true
   }
}

// Password Input Field Validation function
login["Password"].addEventListener('input',log_Password_Is_valid)
function log_Password_Is_valid(e){
  let password=e ? e.target.value.trim() : login["Password"].value.trim()
  let nextdiv=login["Password"].nextElementSibling
   
  if(password.length ==0){
    invalid(login["Password"],nextdiv,"Password is empty")
     return false
   }

  if(password.length <= 5){
    invalid(login["Password"],nextdiv,"Password must be 6 char")
     return false
   }
   else {
     valid(login["Password"],nextdiv,"")
     return true
   }
}

// Show PASSWORD Input Field Validation function
login["checkbox"].addEventListener('input',log_show_password)
function log_show_password(e){
   let show=e.target.checked
     if(show){
      login["Password"].type ="text"
     }else{
      login["Password"].type ='password'
     }
}


//New  User store in Database
function user_sing_up(get_new_user){

const RefDa=ref(Database)
load(true)
// Check for User already Existe
get(child(RefDa,`Users/${get_new_user.Phone}`)).then((snapshot) => {
  if (snapshot.exists()) {
    invalid(form["Phone"],form["Phone"].nextElementSibling,"This number already exists")
    load(false)
  }
  else {
    // New  User store
  set(ref(Database,'Users/'+get_new_user.Phone),get_new_user)
     .then(() => {
        console.log("Data are save ")
        reset_form()
        load(false)
        switch_page(alert,"Successfully Sing Up","success",3000)
     })
   }
}).catch((err) => {
  console.log(err)
});

}


// User Log in 
function user_sing_in(get_new_user){
const RefDa=ref(Database)
 singin_load(true)
get(child(RefDa,`Users/${get_new_user.Phone}`)).then((snapshot) => {
  if (snapshot.exists()) {
     if(snapshot.val().Phone==get_new_user.Phone && snapshot.val().Password==get_new_user.Password){
         singin_load(false)
         reset_form("login")
         setCookies(snapshot.val().UserName,snapshot.val().Phone)
         redirect(snapshot.val().UserName,snapshot.val().Phone,rendomId())
     }
     else{
      switch_page(alert,"phone & password not match","warning",5000)
      singin_load(false)
      reset_form("")
     }
   
  }
  else {
    switch_page(alert,"First create an account","danger",3000)
    singin_load(false)
   }
}).catch((err) => {
  switch_page(alert,"Server Problem","danger",5000)
  singin_load(false)
});

}


// UI Invalid 
function invalid(inputbox,div,text){
    inputbox.classList.add("is-invalid")
    inputbox.classList.remove("is-valid")
    div.classList.remove('valid-feedback')
    div.classList.add("isvalid-feedback","text-danger")

    div.innerText=text
}
// UI valid 
function valid(inputbox,div,text){
    inputbox.classList.remove("is-invalid")
    inputbox.classList.add("is-valid")
    div.classList.remove('isvalid-feedback','tex-danger')
    div.classList.add('valid-feedback')
    div.innerText=text
}

//  Form Reset function
function reset_form(log){
   log?login.reset(): form.reset()
   document.querySelectorAll(".is-valid").forEach(isvalid=>{
     isvalid.classList.remove("is-valid")
   })
}

// Loading UI function
function load(result){
  result?loader.classList.remove('d-none'):loader.classList.add('d-none')

}

// Loading UI function
function singin_load(result){
  result? sing_loader.classList.remove('d-none'): sing_loader.classList.add('d-none')
 
}

//  set User Cookie
function setCookies(cvalue,cvalue2){
  let d = new Date()
  d.setTime(d.getTime()+(2*24*60*60*1000))
  const expires="; expires=" + d.toUTCString()
  document.cookie="USER_NAME="+cvalue+expires+";path=/Home/home.html"
  document.cookie="PHONE_NUMBER="+cvalue2+expires+";path=/Home/home.html"
}

// Home page to redirect to sing in page listener
home.addEventListener("click",homerender)

function homerender(){
  if(id_name_url == "null" && id_phone_url =="null" && id_cookies =="null"){
    switch_page( alert_login,"Please Log in","warning",5000)
  }else{
     redirect(id_name_url,id_phone_url,id_cookies)
   }
}


// Redirect Function
function redirect(id_name,id_phone,check){  
  window.location.replace(`${home_base_url}?id=${id_name}&phone=${id_phone}&url=${check}`)
  
}

// Rendom Id Creator function
function rendomId(){
  let e_id=0
  for(let i=0;i<2;i++){
     let rendompick=Math.floor(100000 + Math.random() * 9000)
     e_id+=rendompick
  }
  return  e_id
}

// View Alert  function
function switch_page(tag,seccessMassage,code,duration){
  singUp.classList.add("d-none")
  singIn.classList.remove("d-none")
   
tag.innerHTML=`
    <div class="alert alert-${code} alert-dismissible fade show" role="alert">
  <strong>${seccessMassage}</strong>
    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
    <span aria-hidden="true">&times;</span>
    </button>
    </div>
`
setTimeout(()=>{
  tag.innerHTML=``
},duration) 
}






