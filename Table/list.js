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

// Collect Data from URL
  let currentUrl=window.location.href
  let paramiter=(new URL(currentUrl)).searchParams
  let id_name_url=paramiter.get('id')
  let id_phone_url=paramiter.get('phone')
  let id_cookies=paramiter.get("url")

  // All variable
 let succ_alert=document.querySelector(".succ-alert")
  let get_ul=document.querySelector(".unorderlist")
  let get_add_btn=document.querySelector(".add-list")
  
  let type=document.querySelector(".type")
  let title=document.querySelector(".title")
  let description=document.querySelector(".description")

  const save_list=document.querySelector(".save")
  
// Daymani list create function
   get_add_btn.addEventListener("click",addlist)
   function addlist(){
      let createDiv=document.createElement('div')
      let count= get_ul.querySelectorAll("li").length + 1
           createDiv.innerHTML=`
      <li class="list-group-item d-flex justify-content-between border mt-1">
            <div class="option-list">                                  
                <label class="content" contenteditable="true">Add new task ${count}</p>                                        
            </div>
            <div>                                      
                <button class="btn btn-danger delete-list">X</button>
            </div>
        </li>
      `
          count>=0?get_ul.nextSibling.nextSibling.innerText="":""
           get_ul.appendChild(createDiv)
           const get_del_btns=document.querySelectorAll('.delete-list')
              get_del_btns.forEach(get_del_btn=>{
                 get_del_btn.addEventListener("click", delete_list)
              })
    } 
    // Tables Delete functiion
    function delete_list(e){
        get_ul.removeChild(e.path[3])
     }
    
// Store Data in database
save_list.addEventListener("click",save_list_database)  
     function save_list_database(){
        let lis=get_ul.querySelectorAll(".content")
        let list=[]
        lis.forEach(li=>{
            list.push({
               listname:li.innerText,
               is_checked:'',
               del:''
            })
           
        })
        getTaske(list)
     }

// Get Data from list
function getTaske(getlist){
        let task_id=`task-${rendomId()}`
     
        const task={
            time:new Date().toLocaleDateString("en-US"),
            type:type.value,
            title:title.value,
            description:description.value,
            task_id,
            like:{
               is_like:false,
               is_like_tothe:'text-info',
               is_like_falthe:''
            },
            list:getlist
        } 
        if(validation(getlist)){
           set(ref(Database,`Users/${id_phone_url}/Taskes/${task.task_id}`),task).then(() => {                     
              
               title.value="",
               description.value="",
               get_ul.innerHTML=""
               switch_sucorerr(succ_alert,"successfully Task Add","success",3000)
           }).catch((err) => {
            
           });
        }
     }
  

// List valitation Function
function validation(list){
      
        if(title.value=="")
        {
             description.classList.remove("is-invalid")
             title.classList.add("is-invalid")
             return false
        }
        
        else if(description.value==""){
             title.classList.remove("is-invalid")
             description.classList.add("is-invalid")
              return false
        }
        else if(list.length==0){
           get_ul.nextSibling.nextSibling.innerText="You must craete one task"
           return false
        }
       
        else{
           get_ul.nextSibling.innerText=""
           title.classList.remove("is-invalid")
           description.classList.remove("is-invalid")
           return true
        }
     }
  
// Rendom Id Creator table function
function rendomId(){
        let e_id=0
        for(let i=0;i<5;i++){
           let rendompick=Math.floor(100000000 + Math.random() * 900000000)
           e_id+=rendompick
        }
        return  e_id
   }

 // View Alert  function     
 function switch_sucorerr(tag,seccessMassage,code,duration){ 
   tag.innerHTML=`
       <div class="alert alert-${code} alert-dismissible fade show" role="alert">
        ${seccessMassage}
       <button type="button" class="close" data-dismiss="alert" aria-label="Close">
       <span aria-hidden="true">&times;</span>
       </button>
       </div>
   `
   setTimeout(()=>{
     tag.innerHTML=``
   },duration) 
   }