  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-app.js";
  import { getDatabase, ref,set,} from "https://www.gstatic.com/firebasejs/9.10.0/firebase-database.js";

  
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

let alertshow=document.querySelector('.table-alert')

// All variable
const rowcount = document.querySelector('#row')
const colcount = document.querySelector('#col')
const create_table = document.querySelector('.create-table')
const inserttable = document.querySelector('.table-responsive')

const savaData_database = document.querySelector('.savaData-in-database')

const type = document.querySelector('#type')
const title = document.querySelector('#title')
const description = document.querySelector('#description')

// Daymani Table create function
create_table.addEventListener('click', maketable)

function maketable() {
    let rows = rowcount.value
    let cols = colcount.value
    if (rows >1 && cols >1) {
        let tableId = Firebase_rendomId()
        const div = document.createElement('div')
        const table = document.createElement('table')

        table.setAttribute('class', 'table table-bordered')
        table.setAttribute('contenteditable', true)
        table.setAttribute('id', tableId)
        const thead = document.createElement("thead")
        thead.setAttribute('class', 'thead-dark')
        const tbody = document.createElement("tbody")

        for (let i = 1; i <= rows; i++) {
            var tr = document.createElement("tr");
            for (let j = 1; j <= cols; j++) {
                if (i == 1) {
                    let th = document.createElement("th");
                    th.innerHTML = "&nbsp;"
                    tr.appendChild(th)
                    thead.appendChild(tr)
                    table.appendChild(thead)
                    div.appendChild(table)
                }
                else if (i > 1) {
                    let td = document.createElement("td");
                    td.innerHTML = "&nbsp;"
                    tr.appendChild(td)
                    tbody.appendChild(tr)
                    table.appendChild(tbody)
                    div.appendChild(table)
                }
                //  tr.innerHTML=''

            }

        }

        const delete_div = document.createElement('div')
        delete_div.setAttribute("class", "mb-2")
        delete_div.innerHTML = `
    <button type="button" id="notEdit" data-id=${tableId} class="btn btn-dark">Not Editable</button>
    <button type="button" id="dele-btn" class="btn btn-danger">Delete Table</button>
    `

        div.appendChild(delete_div)
        inserttable.appendChild(div)
        rowcount.value = ""
        colcount.value = ""
        document.querySelector('.invalid').innerText = ` `

        // Tables Delete functiion
        let delete_btns = document.querySelectorAll('#dele-btn')
        let notEdits = document.querySelectorAll('#notEdit')
        delete_btns.forEach(delete_btn => {
            delete_btn.addEventListener('click', function (e) {
                inserttable.removeChild(e.path[2])
               if(inserttable.children.length==0){
                  rowcount.value = ""
                   colcount.value = ""
                }
            })

        })

        // Table editable function
        let get_editable_check = true
        notEdits.forEach(notEdit => {
            notEdit.addEventListener('click', function (e) {

                let get_editable = e.target.parentNode.parentNode.children[0].getAttribute('id')
                let edit = e.target.parentNode.parentNode.children[0]
                let btn_id = notEdit.getAttribute('data-Id')

                if (get_editable == btn_id) {
                    if (get_editable_check) {
                        getkol(edit, false, 'Editable', e)
                        get_editable_check = false
                    } else {
                        getkol(edit, true, 'Not Editable', e)
                        get_editable_check = true
                    }

                }

            })

        })

        function getkol(tag, bl, text, event) {
            tag.setAttribute("contenteditable", bl)
            event.target.innerText = text
        }


    } else {
        document.querySelector('.invalid').classList.add('text-danger')
        document.querySelector('.invalid').innerText = `2 Row and 2 col must be`

    }
}

savaData_database.addEventListener('click', save)


// Store Data in database
function save() {
    if (setdata_validation()) {
        let task_id=`task-${rendomId()}`
        let task={
            time:new Date().toLocaleDateString("en-US"),
            task_id,
            type:type.value,
            title:title.value,
            description:description.value,
            like:{
               is_like:false,
               is_like_tothe:'text-info',
               is_like_falthe:''
            },
            tables:get_data().Tables
        }
        
        set(ref(Database,`Users/${id_phone_url}/Taskes/${task.task_id}`),task).then(() => {                     
            title.value="",
            description.value="",
            inserttable.innerHTML=''
            switch_sucorerr_table(alertshow,"successfully Task Add","success",3000)

        }).catch((err) => {
         
        });
    }
    else {
        
    }
}

// Get Data from Table
function get_data() {
    let get_div_list = inserttable.children        
        const Table_datas={}   
         Table_datas.Tables=[...get_div_list].map(singalDiv => {
            let tables = singalDiv.children[0]
            let table_index = singalDiv.children[0].getAttribute('id')
               let table={
                     table_index,
                   }
            let thead_length = tables.children[0].children[0].children
            let thead_text = [...thead_length].map(th => {
                return  th.innerText.trim()
                })
                table.thead=thead_text
             let tbodys=tables.children[1].children
             let tbody_text=[...tbodys].map(tr=>{
                  let td=[...tr.children].map(td=>{
                      return td.innerText.trim()
                  })
                  return td
             })
               table.tbody=tbody_text
             return table
        })
      
        return {
            Tables:Table_datas.Tables
        }
}


// Table valitation Function
function setdata_validation() {
    if (title.value == "") {
        description.classList.remove("is-invalid")
        title.classList.add("is-invalid")
        return false
    }

    else if (description.value == "") {
        title.classList.remove("is-invalid")
        description.classList.add("is-invalid")
        return false
    }
    else if (inserttable.children.length == 0) {
        document.querySelector('.invalid').classList.add('text-danger')
        document.querySelector('.invalid').innerText = `2 Row and 2 col must be`
        inserttable.children.length
        return false
    }
    else {

        document.querySelector('.invalid').innerText = ``
        title.classList.remove("is-invalid")
        description.classList.remove("is-invalid")
        return true
    }

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
// Rendom Id Creator table function
function Firebase_rendomId() {
    let e_id = "";
    let alphabet = "abcdefghijklmnopqrstwxuvyz"
    for (let i = 0; i < alphabet.length; i++) {
        let rendompick = Math.floor(Math.random() * 36)
        e_id += alphabet.charAt(rendompick)
    }
    return e_id.slice(0, 10)
}
// View Alert  function
function switch_sucorerr_table(tag,seccessMassage,code,duration){ 
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