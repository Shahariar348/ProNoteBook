
 // Import the functions you need from the SDKs you need
 import { initializeApp } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-app.js";
 import { getDatabase, ref,set,onValue,remove,child,get,update } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-database.js";

 
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


//  All variable 
const logout =document.querySelector('.logout')
const confirmLogout =document.querySelector("#confirmLogout")

const setUsername=document.querySelector('.setUsername')
const set_user_name=document.querySelector('.user_name')
const set_user_phone=document.querySelector('.user_phone')

const navbarIcon=document.querySelector('.navbarIcon')

const shorthandnoteForm =document.querySelector('#shorthandnote')
const table =document.querySelector('.fa-table')
const list =document.querySelector('.fa-list')

const parent=document.querySelector('#parent-view')
const loaders=document.querySelector('.load')

const isempty=document.querySelector('.isempty')


const alert_login=document.querySelector('.get_alert_edite')
const alert_add_task=document.querySelector('.add-task')

const viewDiv=document.querySelector('.pviewDiv')


// BaseURL
const base_url="http://127.0.0.1:5500/Registration/registration.html"
let base_url2 ="http://127.0.0.1:5500/Table/"

// Get Data in URL 
 let currentUrl=window.location.href
 let paramiter=(new URL(currentUrl)).searchParams
 let id_name_url=paramiter.get('id')
 let id_phone_url=paramiter.get('phone')
 let id_cookies=paramiter.get("url")


// Log out listener 
logout.addEventListener("click",function(){
  logout.setAttribute("data-toggle","modal")
  logout.setAttribute("data-target","#logout")
})

confirmLogout.addEventListener("click",function(){
  removeCookie()
})

// Collect Cookies 
function getCookies(cname){

    let name=cname.toLowerCase().trim()+"="
    if(document.cookie){
    let list=document.cookie.toLowerCase().split(';')  
     for(let i=0; i<list.length;i++){
        let remove_space=list[i].trim()
        if(remove_space.indexOf(name)==0){
          return {
              log_ined:true,
              cookie:remove_space.substring(name.length)
             }
        }
     }
    }
     else{
        return null
     }
}

// Remove Coookies
function removeCookie(){
  let d=new Date()
  d.setFullYear(d.getFullYear()-1)
  d.setTime(d.getTime() + (30*60*1000))
  const expires="; expires=" + d.toUTCString()
  document.cookie="USER_NAME="+expires+";path=/Home/home.html"
  document.cookie="PHONE_NUMBER="+expires+";path=/Home/home.html"
  remove(ref(Database,`Users/${id_phone_url}/login`))
  window.location.replace(`${base_url}?id=null&phone=null`)
}

// Redirect user to the homepage base in authentic
let loged=getCookies("phone_number")
 if(loged===null){
   window.location.replace(`${base_url}?id=null&phone=null&url=null`)  
 }else{
  setUser(id_name_url,id_phone_url)
 }

// Set Cookies in the Firebase Database
const RefDa=ref(Database)
get(child(RefDa,`Users/${id_phone_url}/login/${id_cookies}`)).then((snapshot) => {
  if (!snapshot.exists()) {
    set(ref(Database,"Users/"+loged.cookie+"/login/"+id_cookies),{
      isLogin:true,
      logdate:new Date().getTime()
    }).then(() => {
      switch_page(alert_login,"Welcome to Pro_Note_Book","warning",4000)
    })
  }
}).catch((err) => {
   console.log(err)
});

// Set User Detail by useing URl
function setUser(uname,uphone){
  setUsername.innerHTML=`<span><i class="fas fa-user"></i> </span> ${uname} `
  set_user_name.innerText=uname
  set_user_phone.innerText=uphone
}

// NavBar Icon listener and Redirect to the home page
navbarIcon.addEventListener('click',function(){
  navbarIcon.setAttribute("href",`${base_url}?id=${id_name_url}&phone=${id_phone_url}&url=${id_cookies}`)
})

// Create Short note using form
shorthandnoteForm.addEventListener("submit",function(e){
      e.preventDefault()
      const task={}
      ;[...this].forEach(onevalue=>{
        if(onevalue.type!=="submit" && onevalue.type!=="button"){
          task[onevalue.name]=onevalue.value
        }
      })
     set_data_in_firebase(task)
 })

// Create Short note  store to the firebase
function set_data_in_firebase(task){
   let task_id=`task-${rendomId()}`
   task.task_id=task_id 
   task.like={
     is_like:false,
     is_like_tothe:'text-info',
     is_like_falthe:''
   }
   task.time=new Date().toLocaleDateString("en-US")
    set(ref(Database,`Users/${id_phone_url}/Taskes/${task_id}`),task).then(() => {
      switch_page(alert_add_task,"Task Add Successfully","success",2000)
      shorthandnoteForm.reset()
    }).catch((err) => {
      console.log(err)
    }); 
 }

//  Table and list Redireect lestener
 table.addEventListener("click",redirect)
 list.addEventListener("click",redirect)

//  Table and list Redireect lestener function
function redirect(e){
  e.target.innerText==="Table"? window.location.assign(`${base_url2}table.html?id=${id_name_url}&phone=${id_phone_url}&url=${id_cookies}`)
  : window.location.assign(`${base_url2}list.html?id=${id_name_url}&phone=${id_phone_url}&url=${id_cookies}`)
   
 }

// Loading UI base on true and false
function load(result){
     result?loaders.classList.remove('d-none'):loaders.classList.add('d-none')
}

// Home page Main work flow get Data and set UI
load(true)
onValue(ref(Database,`Users/${id_phone_url}/Taskes`),(snapshot)=>{
  
  // Condition check for data are not empty
if(snapshot.val()!==null){
   // clear all and Render new page
      parent.innerHTML=``
      //Data is not empty  
      isempty.classList.add('d-none')
       
      const newObj=snapshot.val()

  for(let i in newObj){ 
    let div=document.createElement('div')
        div.classList.add("col-lg-4")
          div.classList.add("col-md-6")
              div.classList.add("col-sm-12")
              // Card UI 
                div.innerHTML=`
                  <div class="card card-headers">
                      <div class="card-body">
                         <h5 class="card-title">${newObj[i].title}</h5>
                         <h6 class="card-subtitle mb-2 text-muted ">${newObj[i].time} 💥 ${newObj[i].type}</h6>
                                <div class="card-text2">
                                  <h6 class="card-text font-italic">
                                    ${newObj[i].description ==undefined?"There is no Task" :newObj[i].description} 
                                </h6>
                              </div>
                      
                              <div class="d-flex justify-content-between">
                              <a href="home/"  data-toggle="modal" data-target=".bd-example-modal-lg" class="card-link view" data-types="${newObj[i].type}" data-id="${i}">View</a>
                              <div class=" dropleft">
                                     <i class="fas fa-thumbs-up mr-1 ${newObj[i].like.is_like===true?newObj[i].like.is_like_tothe:newObj[i].like.is_like_falthe}" checked=${newObj[i].like.is_like} data-id="${i}"></i>
                                <button class="border-0 text-center btn-light  ddm" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                  <i class="fas fa-ellipsis-v"></i>
                                </button>
                                <div class="dropdown-menu">
                                    <a class="dropdown-item view" href="#" data-toggle="modal" data-target=".bd-example-modal-lg" data-types="${newObj[i].type}" data-id="${i}">View</a>                        
                                    <a class="dropdown-item" href="#" disabled>Share</a>
                                    <a class="dropdown-item deleteTask" href="#"  data-id="${i}">Delete Task</a>
                                </div>
                              </div>
                           </div>

                      </div>
                </div>`     
          
        parent.appendChild(div)  
     load(false)
   }
 
          // UI show base in task type
          let alldei=document.querySelectorAll(".view")
          alldei.forEach(getbtn=>{
              getbtn.addEventListener('click',function(){
                 const id = getbtn.getAttribute("data-id")
                  setModal(id)
              })
          })

          // Task Delete function
          let deleteTask=document.querySelectorAll('.deleteTask')
          deleteTask.forEach(getbtn=>{
            getbtn.addEventListener('click',function(){
               const id = getbtn.getAttribute("data-id")               
               remove(ref(Database,`Users/${id_phone_url}/Taskes/${id}`))
               switch_page(alert_login,"Taskes Delete Successfully","success",3000)
              
            })
          })

          // If Like any task this function
         let likes=document.querySelectorAll(".fa-thumbs-up")
           likes.forEach(like=>{
           like.addEventListener('click',function(e){
              let checked_value=e.target.getAttribute('checked')
              let get_task_id=e.target.getAttribute('data-id')
              if(checked_value==='true'){
                   newObj[get_task_id].like={
                    is_like:false,
                    is_like_tothe:'text-info',
                    is_like_falthe:''
                   }
                   update(ref(Database,`Users/${id_phone_url}/Taskes/${get_task_id}`),newObj[get_task_id])
                 
                 }
              else{               
                newObj[get_task_id].like={
                  is_like:true,
                  is_like_tothe:'text-info',
                  is_like_falthe:''
                }
                  update(ref(Database,`Users/${id_phone_url}/Taskes/${get_task_id}`),newObj[get_task_id])
                  console.log()
              }


           })
           })

}else{
        load(false)
        parent.innerHTML=``
        isempty.classList.remove('d-none')
   }
})



// Modal view Function
function setModal(id){
  let dbref=ref(Database)
  get(child(dbref,`Users/${id_phone_url}/Taskes/${id}`)).then((snapshot) => {
      if(snapshot.exists()){
        let dtObject=snapshot.val()
        if(dtObject.type=="list"){
              modalList(dtObject)
        }
        else if(dtObject.type=="table"){
              modalTable(dtObject)
        }
        else{
              modalShortHand(dtObject)
        }
      }
  }).catch((err) => {
    console.log(err)
  });
}
  

// list task function
function modalList(getObj){
  viewDiv.innerHTML=``
  const list=`
  <h4 class="">${getObj.title}</h4>
  <span class="text-muted">${getObj.time}</span>
  <br>
  <br>
  <blockquote class="">
    <ul class="list-group addedlist">
     <h6>${getObj.description}</h6> 
    </ul>
    <footer class="blockquote-footer"> Written by <cite title="Source Title">${id_name_url}</cite> </footer>
  </blockquote>
  <br>
  <button type="btn" class="btn btn-danger"  id="close" data-dismiss="modal">Close</button>
  `
viewDiv.innerHTML=list
let addlist=document.querySelector('.addedlist') 
   getObj.list.forEach((value,index)=>{
    let createlistdiv=document.createElement('div')
    createlistdiv.innerHTML=`
       <li class="list-group-item mb-1">
          <div class="form-check">
              <input type="checkbox" class="form-check-input checkfield " id="${value.listname+index}" ${value.is_checked} data-idof=${index} data-taske-id=${getObj.task_id}>
              <label class="form-check-label" for="${value.listname+index}">${value.is_checked?value.del:value.listname}</label>
           </div>
        </li>
     `   

     addlist.appendChild(createlistdiv)
    })
   
    // Checkbox for compelat singal task

    let checkbox=document.querySelectorAll('.checkfield')
       checkbox.forEach(check=>{
       check.addEventListener('click',function(e){
        let value=check.nextElementSibling.innerText
        let listid=e.target.getAttribute('data-idof')
        let listTaskid=e.target.getAttribute('data-taske-id')

         if(e.target.checked){
               check.nextElementSibling.innerHTML=`<del>${value}</del>`
              getObj.list[listid]={
                listname:value,
                is_checked:'checked',
                del:`<del>${value}</del>`,
              }
              // Update Data base on the checkbox
              update(ref(Database,`Users/${id_phone_url}/Taskes/${listTaskid}`),getObj)
              
           }
         else{
             check.nextElementSibling.innerHTML=`${value}`
              getObj.list[listid]={
              listname:value,
              is_checked:'',
              del:``
            }
            update(ref(Database,`Users/${id_phone_url}/Taskes/${listTaskid}`),getObj)           
          }
      })
      })
}

// Table task function
function modalTable(getObj){
  viewDiv.innerHTML=``
  const tableHtml=`
     <h4 class="">${getObj.title}</h4>
     <span class="text-muted">${getObj.time}</span>
     <br>
     <br>
     <h6>${getObj.description}</h6> 
     <blockquote class="">
      <ul class="list-group-flush  addedlist">
         
      </ul>
      <footer class="blockquote-footer"> Written by <cite title="Source Title">${id_name_url}</cite> </footer>
     </blockquote>
     <br>
     <button type="btn" class="btn btn-danger" id="close" data-dismiss="modal" >Close</button>
  
  `
  viewDiv.innerHTML=tableHtml

  let addlist=document.querySelector('.addedlist') 
  getObj.tables.forEach((value,index)=>{
   let createlistdiv=document.createElement('div')
     createlistdiv.innerHTML=`
     <li class="list-group-item mb-2 table-li">
     <input type="text" class="form-control border-0" id="search${value.table_index}" placeholder="search with 2nd col">
      <br>
      <div class="table-responsive">                               
          <table class="table table-bordered">
            <thead class="thead-light">
                <tr class="thead-tr ${value.table_index}">
                   
                </tr>
           </thead>
           <tbody class="tbody${value.table_index}">
          
      
               </tbody>
           </table>
       </div>
    </li>

     `   
     
     addlist.appendChild(createlistdiv)
    //  Table  header
     let set_thead =document.querySelector(`.${value.table_index}`)
        value.thead.forEach(hd=>{
            let th =document.createElement('th')
               hd==''?th.innerText="empty":th.innerText=hd
               set_thead.appendChild(th)
          })
          // Table Body
      let set_tbody =document.querySelector(`.tbody${value.table_index}`)
         value.tbody.forEach((trow)=>{
                let tr =document.createElement('tr')
                 trow.forEach((tcol)=>{
                   let td =document.createElement('td')
                    tcol==''?td.innerText="empty":td.innerText=tcol
                    tr.appendChild(td)
                 })
                 set_tbody.appendChild(tr)
          })
      
          // Search table data function

     let search=document.querySelector(`#search${value.table_index}`)
       search.addEventListener('input',function(e){
         let inputvalue=e.target.value.toLowerCase()
         let rows=set_tbody.rows
         
         ;[...rows].forEach(row=>{
             let cellData=row.cells[0].innerText.toLowerCase()
             if(cellData.indexOf(inputvalue)>-1){
                    row.classList.remove('d-none')
                 
               }
               else{
                 row.classList.add("d-none")
               }             
               
         })
             
       })
   })
}

// short task function
function modalShortHand(getObj){
  viewDiv.innerHTML=``
  const short =`
          <h4 class="">${getObj.title}</h4>
           <span class="text-muted">${getObj.time}</span>
           <br>
           <br>
           <blockquote>
            <p class="mb-0">${getObj.description}</p>
             <footer class="blockquote-footer"> Written by <cite title="Source Title">${id_name_url}</cite> </footer>
           </blockquote>
           <br>
           <button type="btn" class="btn btn-danger" id="close" data-dismiss="modal">Close</button>`
viewDiv.innerHTML=short

}

// Rendom Id Creator function
function rendomId(){
  let e_id=0
  for(let i=0;i<5;i++){
     let rendompick=Math.floor(100000000 + Math.random() * 900000000)
     e_id+=rendompick
  }
  return  e_id
}

// View Alert  function
 function switch_page(tag,seccessMassage,code,duration){ 
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