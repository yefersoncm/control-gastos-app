// ****** SELECT ITEMS **********
const alert = document.querySelector('.alert1');
const form = document.querySelector('.grocery-form');
const grocery = document.getElementById('grocery');
const priceGrocery = document.getElementById('price');
const submitBtn = document.querySelector('.submit-btn');
const container = document.querySelector('.grocery-container');
const list = document.querySelector('.grocery-list');
const clearBtn = document.querySelector('.clear-btn');
const total = document.getElementById('total');
// edit option


let editElement;
let editElementPrice;
let editFlag = false;
let editID = "";

// ****** EVENT LISTENERS **********

//submit form

form.addEventListener('submit', addItem)

//clear items
clearBtn.addEventListener('click', clearItems)

window.addEventListener('DOMContentLoaded', setUpItems);

// ****** FUNCTIONS **********

function addItem(e){
  e.preventDefault();
  const value = grocery.value;
  const price = priceGrocery.value;
  const id = new Date().getTime().toString();
  if (value && !editFlag && price) {
    createListItem(id,value,price);
    // display alert
    displayAlert("item agregado a la lista", "success1");
    // show container
    container.classList.add("show-container");
    // add to localstorage
    addToLocalStorage(id,value,price);
    // set back to default 
    total.textContent ="$ "+formatMoneyNumber(calcTotal());
    setBackToDefault();
  }else if (value && editFlag && price) {
    editElement.innerHTML = value;
    displayAlert("valor cambiado", "success1");
    //edit local storage
    editLocalStorage(editID, value, price);
    setBackToDefault();
  } else {
    displayAlert("porfavor ingrese un valor", "danger1")
  }
}


function displayAlert(text, action){
  alert.textContent = text;
  alert.classList.add(`alert-${action}`);
  //remove alert
  setTimeout(function(){
    alert.textContent = "";
  alert.classList.remove(`alert-${action}`);
  }, 1000);
}

//clear items
function clearItems(){
  const items = document.querySelectorAll('.grocery-item');

  if (items.length > 0) {
    items.forEach(function(item){
      list.removeChild(item);
    });
  }
  container.classList.remove("show-container");
  displayAlert("lista vacia", "danger1");
  localStorage.removeItem('list');
  setBackToDefault();
  // 
}

// delete function
function deletiItem(e){
   const element = e.currentTarget.parentElement.parentElement;
   const id = element.dataset.id;
   list.removeChild(element);
   if(list.children.length === 0){
     container.classList.remove("show-container");
   }
   displayAlert("Item eliminado", "danger1");
   setBackToDefault();
   removeFromLocalStorage(id);
}

// edit function
function editItem(e){
  const element = e.currentTarget.parentElement.parentElement;
  // set editItem
  editElement = e.currentTarget.parentElement.previousElementSibling;
  editElementPrice = e.currentTarget.parentElement.parentElement.children[1].children[0].innerText;
  // set form value
  grocery.value = editElement.innerHTML;
  priceGrocery.textContent = editElementPrice.innerHTML;
  console.log(editElementPrice);
  // grocery.price = editElementPrice.innerHTML;
  editFlag = true;
  editID = element.dataset.id;
  submitBtn.textContent = "Editar";
}
// set back to default
function setBackToDefault(){
  grocery.value="";
  editFlag = false;
  editID = '';
  priceGrocery.value = "";
  submitBtn.textContent = "Agregar";
}

// ****** LOCAL STORAGE **********
function addToLocalStorage(id,value,price){
  const grocery = {id,value,price};
  let items = getLocalStorage();
  items.push(grocery);
  localStorage.setItem('list', JSON.stringify(items));
  total.textContent ="$ "+formatMoneyNumber(calcTotal());
}
function removeFromLocalStorage(id){
  let items = getLocalStorage();
  items = items.filter(function(item){
    if(item.id !== id){
      return item
    }
  });
  localStorage.setItem("list", JSON.stringify(items));
  total.textContent ="$ "+formatMoneyNumber(calcTotal());
}
function editLocalStorage(id, value, price){
  let items = getLocalStorage();
  items = items.map(function(item){
    if (item.id == id){
      item.value = value;
      item.price = price;
    }
    return item;
  });
  localStorage.setItem("list", JSON.stringify(items));
  total.textContent ="$ "+formatMoneyNumber(calcTotal());
}
function getLocalStorage(){
  return localStorage.getItem("list")
  ? JSON.parse(localStorage.getItem("list"))
  : [];
  total.textContent ="$ "+formatMoneyNumber(calcTotal());
}

// localStorage API
// setItem
// getItem
// removeItem
// save as string

// localStorage.setItem('orange', JSON.stringify(["item", "item2"]));
// let oranges = JSON.parse(localStorage.getItem('orange'));

// console.log(oranges);
// localStorage.removeItem('orange');



// ****** SETUP ITEMS **********
function setUpItems(){
  total.textContent ="$ "+formatMoneyNumber(calcTotal());
  let items = getLocalStorage();
  if(items.length > 0){
    items.forEach(function(item){
      createListItem(item.id, item.value, item.price);
    });
    container.classList.add('show-container');
  }
}

function createListItem(id, value, price){
  const element = document.createElement('article');
    // add class
    element.classList.add('grocery-item');
    // add id
    const attrID = document.createAttribute('data-id');
    attrID.value = id;
    element.setAttributeNode(attrID);
    element.innerHTML = `<p class="title">${value}</p>
    <div class="btn-container">
      <span id="showPrice" class="badge rounded-pill bg-info">$ ${formatMoneyNumber(price)}</span>
      <button type="button" class="edit-btn">
        <i class="fas fa-edit"></i>
      </button>
      <button type="button" class="delete-btn">
        <i class="fas fa-trash"></i>
      </button>
    </div>`;
    const deleteBtn = element.querySelector('.delete-btn');
    const editBtn = element.querySelector('.edit-btn');
    deleteBtn.addEventListener('click', deletiItem);
    editBtn.addEventListener('click', editItem);
    //append child
    list.appendChild(element);
}

function calcTotal(){
  let items = getLocalStorage();
  let valTotal = 0;
  if(items.length > 0){
    items.forEach(function(item){
      valTotal = valTotal + parseInt(item.price);
    });
    return valTotal;
  }else{
    return 0
  }
}

function traerPrecio(id){
  let items = getLocalStorage();
  items.forEach(function(item){
    console.log("Item ID: "+item.id+", ID:"+id)
    if(item.id === id){
      console.log("Precio: "+item.price)
      return item.price;
    }
  });
}

function formatMoneyNumber(num) {
  if (!num || num == 'NaN') return '-';
  if (num == 'Infinity') return '&#x221e;';
  num = num.toString().replace(/\$|\,/g, '');
  if (isNaN(num))
      num = "0";
  sign = (num == (num = Math.abs(num)));
  num = Math.floor(num * 100 + 0.50000000001);
  cents = num % 100;
  num = Math.floor(num / 100).toString();
  if (cents < 10)
      cents = "0" + cents;
  for (var i = 0; i < Math.floor((num.length - (1 + i)) / 3) ; i++)
      num = num.substring(0, num.length - (4 * i + 3)) + '.' + num.substring(num.length - (4 * i + 3));
  return (((sign) ? '' : '-') + num + ',' + cents);
}