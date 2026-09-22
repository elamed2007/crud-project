// Prevent XSS: convert special characters into safe HTML entities
function escapeHtml(str){
    let p = document.createElement('p')
    p.textContent = str == null ? '' : String(str)
    return p.innerHTML
}

// Grab all input elements from the page
let name = document.getElementById("name")
let price = document.getElementById("price")
let taxes = document.getElementById("taxes")
let ads = document.getElementById("ads")
let discount = document.getElementById("discount")
let create = document.getElementById("create")
let total = document.getElementById("total")
let  category = document.getElementById("category")
let count = document.getElementById("count")
let btndelete = document.getElementById("btndelete")
let btnupdate = document.getElementById("btnupdate")
let btnDALL = document.getElementById("btnDALL")
let SBC = document.getElementById("SBC")
let SBN = document.getElementById("SBN")
let inputsearch = document.getElementById("search")
let result
let mood = 'create'   // 'create' or 'update' mode
let tmp               // stores the index of the product being updated

// Calculate the total price (price + taxes + ads - discount)
function calcul(){


    if(price.value == ''){
        total.innerHTML = ''
         total.style.background = 'red'   // no price -> red
    }else{
        result = (+price.value + +taxes.value + +ads.value) - +discount.value
    total.innerHTML = result
    total.style.background = 'green'      // valid total -> green
    }
}

 let datapro = []

 // Load saved products from localStorage, or start with an empty array
 if(localStorage.Sdata != null){
    datapro = JSON.parse(localStorage.Sdata)
 }else{
    datapro = []
 }
 
 // Create / Update product when clicking the create button
create.onclick = function (){
 if(name.value == ''){
  name.style.background = 'red'    // highlight empty name
  name.onclick = function(){
    name.style.background = 'black'  // reset color when user clicks
  }
    

 }else{
    // Build the new product object from the form values
    let newdata = {
        name : name.value,
        price : price.value,
        taxes: taxes.value,
        ads : ads.value,
        discount : discount.value,
        total : total.innerHTML,
        category : category.value,
    }
 if(mood === 'create'){

  // Add the product "count" times if count > 1
  if(count.value > 1){
     for(i=0; i < count.value ; i++){
     datapro.push(newdata)
  }
  }else{
        datapro.push(newdata)
  }

  

      
    }else{
      // Update mode: replace the product at index tmp
      datapro[tmp] = newdata
      mood = 'create'
      create.innerHTML ='create'
      count.style.display = 'block'
    }
   

    
    
  
localStorage.Sdata = JSON.stringify(datapro)   // save to localStorage
clear()
showdata()
}
 }


// Build the HTML of one table row for a product
function productRow(i){
    return `
    <tr>
        <th>${i+1}</th>
        <th>${escapeHtml(datapro[i].name)}</th>
        <th>${escapeHtml(datapro[i].price)}</th>
        <th>${escapeHtml(datapro[i].taxes)}</th>
        <th>${escapeHtml(datapro[i].ads)}</th>
        <th>${escapeHtml(datapro[i].discount)}</th>
        <th>${escapeHtml(datapro[i].total)}</th>
        <th>${escapeHtml(datapro[i].category)}</th>
        <th><button onclick="updatepro(${i})" id="btnupdate" style="background:green">update</button></th>
        <th><button onclick='deletepro(${i})' id="btndelete" style="background:red">delete</button></th>
    </tr>
    `
}

// Display all products inside the table
function showdata(){
 let table = ''
    for(i=0 ; i < datapro.length ; i++){
         table += productRow(i)
        
    }
    
    document.getElementById('tbody').innerHTML = table

       // Show "Delete All" button only if there is at least one product
       if(datapro.length > 0){
      btnDALL.style.display = 'block'
    }else{
       btnDALL.style.display = 'none'

}
   
}

showdata()

// Clear all input fields
function clear(){
  name.value = ''
   price.value = ''
    ads.value = ''
     taxes.value = ''
      discount.value = ''
       total.innerHTML = ''
         count.value = ''
           category.value =''
calcul()
        
}

// Ask the user for confirmation, returns true or false
function sure(){
    return confirm('are you sure ?')
}

// Delete one product after confirmation
function deletepro(i){
   if(sure()){
   datapro.splice(i,1)
   localStorage.Sdata = JSON.stringify(datapro)
   showdata()
   return true
   }
   return false
}

// Fill the form with the product data to update it
function updatepro(i){
    name.value = datapro[i].name
     price.value = datapro[i].price
     taxes.value = datapro[i].taxes
       ads.value = datapro[i].ads
        discount.value = datapro[i].discount
        category.value = datapro[i].category
        calcul()
        create.innerHTML = 'Update'
        count.style.display = 'none'
        mood = 'update'
        tmp = i
}

// Delete all products after confirmation
btnDALL.onclick = function DALL(){
  if(sure()){
  datapro.splice(0)
  localStorage.Sdata = JSON.stringify(datapro)
  showdata()
  return true
  }
  return false
}

let searchmood = 'SBN'   // search mode: by name or by category
function search(id){
   if(id == 'SBN'){
    searchmood = 'SBN'
   }else{
    searchmood = 'SBC'
   }
   console.log('hhhh')
   inputsearch.value = ''
}

// Filter the table while typing in the search box
function showsearch(value){
     let table = ''
    for(i=0 ; i < datapro.length ; i++){
      if(searchmood == 'SBN'){
      if(datapro[i].name.includes(value)){   // search by name
         table += productRow(i)
        }
    }else{
      if(datapro[i].category.includes(value)){   // search by category
         table += productRow(i)
        }
    }
    }
    
    document.getElementById('tbody').innerHTML = table
}
