const hamburger = document.querySelector("#hamburger");
const menu = document.querySelector("#menu");
const close = document.querySelector("#close");

hamburger.addEventListener("click", ()=> {
    menu.classList.toggle("hidden")
    hamburger.classList.toggle("hidden")
    close.classList.remove("hidden")
})

close.addEventListener("click", ()=>{
    menu.classList.toggle("hidden");
    hamburger.classList.remove("hidden");
})


"use strict"

const bankForm = document.querySelector('#bankForm');
const output = document.getElementById('output');

const nurEingängeCheck = document.getElementById("nurEingängeCheck"); // by default?
const nurAusgängeCheck = document.getElementById("nurAusgängeCheck");


//set up mockdata
const mockObjects = [
    {
        id: "cardEntry_0",
        description: "Sicily", 
        amount:  -500, 
        isCheck: false,
        date: getDate(),
        category: "travel"
    },
    {
        id: "cardEntry_1",
        description: "The Lord of the Rings Series", 
        amount:  -550, 
        isCheck: false,
        date: getDate(),
        category: "books"
    },
    {
        id: "cardEntry_2",
        description: "Wollgarn", 
        amount:  2000, 
        isCheck: true,
        date: getDate(),
        category: "crochet"
    },
    {
        id: "cardEntry_3",
        description: "Materials", 
        amount:  -100, 
        isCheck: false,
        date: getDate(),
        category: "crochet"
    },
    {
        id: "cardEntry_4",
        description: "Eingang", 
        amount:  500, 
        isCheck: true,
        date: getDate(),
        category: "house"
    }
];

 
const bankingObjects = []; 



mockObjects.forEach(function(mockObj){
    renderCardElement(mockObj);
    bankingObjects.push(mockObj);
    
})

renderReporter();


let id = 0;
bankForm.addEventListener('submit', (event) => { 
    event.preventDefault(); 



const textIn = document.getElementById("textIn").value;
let numberIn = document.getElementById("numberIn").value;
const isCheck = document.getElementById("isCheck").checked;
let dateIn = document.getElementById("dateIn").value; 
const myBtn = document.getElementById("myBtn"); 

if(isCheck){
        numberIn = numberIn * 1;
    } else{
        numberIn = numberIn * -1;
    }
    
    const bankingObject = {
        id: "cardEntry_" + id++,
        description: textIn, 
        amount:  numberIn, 
        isCheck: isCheck,
        date: getDate(dateIn),
        category: categoryDropdown.value
    }
    

    renderCardElement(bankingObject);    
  
    bankingObjects.push(bankingObject);
    renderReporter();
    
})



function renderReporter() {

  document.getElementById('balance').innerText = "EUR " + calculateBalance().toFixed(2);
  document.getElementById('onlyIncoming').innerText = "EUR " + calculateIncoming().toFixed(2);
  document.getElementById('onlyOutcoming').innerText = "EUR " + calculateOutcoming().toFixed(2);
}


function calculateBalance() {
    
let result = 0;

bankingObjects.forEach(obj => {
    result += obj.amount;
})

    return result;
}

function calculateIncoming() {
    let result = 0;

    bankingObjects.forEach(obj => {
        if(obj.isCheck){
            result += obj.amount;
        }
    })

    return result;
}

function calculateOutcoming() {
    let result = 0;
    for(const obj of bankingObjects){
        if(!obj.isCheck){
            result += obj.amount;
        }
    }

    return result;
}

function calcCategorySaldo(categoryName) {
    let saldo = 0;
    bankingObjects.forEach(banking => {
        if (banking.category === categoryName) {
            saldo += banking.amount;
        }
    });
    return saldo;
}


//TODO: FILTER ADD ASC DESC FOR MONEY ONLY IF FILTERED EINGÄNGE THEN HIGHEST EINGANG
// IF FILTERED AUSGÄNGE THEN THE highest AUSGANG on the side, working for each of the cases secondary filter ICONS


nurEingängeCheck.addEventListener('click', () => {
    const allEntries = document.querySelectorAll('#output .out');
    allEntries.forEach(entry => {
        entry.classList.toggle('hidden', nurEingängeCheck.checked);
    });
});


nurAusgängeCheck.addEventListener('click', () => {
    const allEntries = document.querySelectorAll('#output .in');
    allEntries.forEach(entry => {
        entry.classList.toggle('hidden', nurAusgängeCheck.checked);
    });
});

document.querySelector('#filterÄlteste').addEventListener('change', (event) => {
    if(event.target.checked){
        bankingObjects.sort(byDate);
    }else{
        bankingObjects.sort(byDateDesc);
    }
    renderSortedEntries();
})

function byDate(a,b) {
return new Date(a.date) - new Date(b.date).valueOf(); 
}

function byDateDesc(a, b){
    return new Date(b.date) - new Date(a.date);
}

function renderSortedEntries(){
    output.innerHTML = "";
    bankingObjects.forEach(renderCardElement);
}
document.querySelector('#filterNeueste').addEventListener('change', (event) => {
    if(event.target.checked){
        bankingObjects.sort(byDate);
    }else{
        bankingObjects.sort(byDateAsc);
    }
    renderSortedEntries();
})

function byDate(b,a) {
return new Date(b.date) - new Date(a.date); //timestamps
}

function byDateAsc(b, a){
    return new Date(a.date) - new Date(b.date);
}

function renderSortedEntries(){
    output.innerHTML = "";
    bankingObjects.forEach(renderCardElement);
}


function populateCategoryDropdown() {
    const categoryDropdown = document.getElementById('filterKategorie');

    categoryDropdown.innerHTML = '';

    const allOption = document.createElement('option'); 
    allOption.value = "all";
    allOption.innerText = "All Categories";
    categoryDropdown.appendChild(allOption);

    const categories = [...new Set(bankingObjects.map(obj => obj.category))];

    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.innerText = "#" + category;
        categoryDropdown.appendChild(option);
    });

}

function filterByCategory(){
    const selectedCategory = document.getElementById('filterKategorie').value;
    output.innerHTML = '';

    const filteredEntries =  selectedCategory === 'all' 
    ? bankingObjects 
    : bankingObjects.filter(obj => obj.category === selectedCategory);

    filteredEntries.forEach(renderCardElement);
}


window.onload = () => {
    populateCategoryDropdown();
    filterByCategory();
};


document.getElementById('filterKategorie').addEventListener('change', filterByCategory)

function renderCardElement(bankingData){
    
 
const newOutputElement = document.createElement("div");
newOutputElement.id = bankingData.id;


if (bankingData.isCheck) {
    newOutputElement.classList.add('in'); 
    if (nurAusgängeCheck.checked) {
        newOutputElement.classList.toggle('hidden'); 
    }
   
} else {
    newOutputElement.classList.add('out');
    if(nurEingängeCheck.checked){
        newOutputElement.classList.toggle('hidden');
    }
}

newOutputElement.classList.add('flex', 'items-center', 'gap-5', 'border-2', 'p-5', 'm-2', 'justify-start')

   
const textElement = document.createElement('p');
textElement.innerText = "Buchungstext: " + bankingData.description;

   
const amountElement = document.createElement('p');
amountElement.innerText = "Betrag: ";

  
const betragElement = document.createElement('span');

if (bankingData.amount > 0) {
    betragElement.classList.add('text-green-500'); 
} else {
    betragElement.classList.add('text-red-500'); 
}

betragElement.innerText = bankingData.amount.toFixed(2); 
amountElement.append(betragElement);


const dateElement = document.createElement('p');
dateElement.innerText = "Datum: " + bankingData.date;

const categoryElement = document.createElement('p');
categoryElement.innerText = "#" + bankingData.category;

newOutputElement.append(categoryElement, textElement, amountElement, dateElement);
output.prepend(newOutputElement);
  
}

//document.getElementById("dateIn").valueAsDate = new Date();
//hat nichts mit dem Eventlistener zu tun (unabhängig)
document.getElementById("dateIn").value = getIsoDate();

function getIsoDate(){
const dateToday = new Date();
// console.log(dateToday);
// let dateToString = dateToday.toISOString();
// dateToString = dateToString.substring(0, 10);
// console.log(dateToString);
// return dateToString
return dateToday.toISOString().substring(0,10);
}


function getDate(dateIn) {
    let options = {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    }

    let date;
    if(dateIn){
        date = new Date(dateIn);
    } else {
        date = new Date()
    }


    let dateLocalStr = date.toLocaleDateString('de-DE', options);

    return dateLocalStr
}

// NEUE KATEGORIE
const categoryForm = document.querySelector('#category_form');
const categoryOutput = document.querySelector('#category_output');
const categoryDropdown = document.querySelector('#category_dropdown');

const mockCategories = [
    {
        id: "entry_0",
        name: "books",
        amount: 200
    },
    {
        id: "entry_1",
        name: "travel",
        amount: 200
    },
    {
        id: "entry_2",
        name: "crochet",
        amount: 200
    },
    {
        id: "entry_3",
        name: "house",
        amount: 200
    }

]

const savedCategory = [];

mockCategories.forEach((function(eachCategory) {

    renderNewOutput(eachCategory);
    savedCategory.push(eachCategory);
   
}))

let index = 0;
categoryForm.addEventListener('submit', (event) => {
    event.preventDefault();
    
    const categoryName = document.querySelector("#category_name").value;
    const categorySumme = document.querySelector('#category_amount').value;
  

    const categoryObject = { 
        id: "categoryEntry_" + index++,
        name: categoryName, 
        amount:  categorySumme, 
    }

    renderNewOutput(categoryObject);

    const option = document.createElement('option');
    option.innerHTML = "#" + categoryObject.name; 
    categoryDropdown.prepend(option);
    savedCategory.push(categoryObject);
   
})


function renderNewOutput(newoutputitem) {
    const newOutputCategory = document.createElement('div');
    newOutputCategory.id = newoutputitem.id;


    const nameField = document.createElement('span');
    nameField.innerHTML = "Category: #" + newoutputitem.name; 

    const amountField = document.createElement('p');
    amountField.innerText = "Amount: " + newoutputitem.amount;
    
    const saldoAmount = calcCategorySaldo(newoutputitem.name); 

    const saldoField = document.createElement('p');
    saldoField.innerText = "Current saldo: " + saldoAmount.toFixed(2); ; 
    
    
    const remainingField = document.createElement('span');
    remainingField.innerText = "Remaining: "+ remainingCategory(newoutputitem.amount, saldoAmount).toFixed(2);

    //To-do: progress bar how much percent is from the overall amount

    newOutputCategory.append(nameField, amountField, saldoField, remainingField);
    categoryOutput.prepend(newOutputCategory);

}

function remainingCategory(goalAmount, saldoValue){
   return goalAmount - saldoValue
}

document.getElementById('goals-link').addEventListener('click', function(e) {
    e.preventDefault();
    // Show the goals section
    document.getElementById('goals-section').classList.remove('hidden');
    document.getElementById('close_btn').classList.remove('hidden');
    document.getElementById('close_btn').addEventListener('click', function(e){
        document.getElementById('goals-section').classList.add('hidden');
        
    })
});




