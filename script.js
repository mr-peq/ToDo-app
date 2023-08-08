document.addEventListener('click', helper);     // => Event listener sur tout le document: pas très utile ici... l'event 'click' ne provoque rien sur les éléments
                                                //.. parents du "add-button", on a donc pas besoin de le "catch" spécifiquement à cet endroit là en partant du DOM

document.addEventListener('click', deleteItem); // => En revanche, celui du "delete-button" DOIT être sur le document car il n'existe pas encore tant que
                                                //.. l'utilisateur n'a pas créé un nouvel "item"

let ulTarget;                  // => Le <ul> le plus proche du "add-button" cliqué (là où on va placer l'item)                            
let currentHelper;                  // => Pour sauvegarder le fait qu'un helper est présent (bloque les autres 'events')
let liScheduled = [];               // => La liste des items "scheduled"
let currentCategory;                // => 'section' dans laquelle on veut ajouter un item (important, normal, scheduled)


/* ================================== HELPER ================================== */

function helper(event){
    if(currentHelper != undefined) return;

    if(event.target.classList.contains('add-button')){
        ulTarget = event.target.parentElement.nextElementSibling;     // => On récupère le <ul> le + proche (voir HTML)
        currentCategory = event.target.closest('section');                    /* ++++ */ // => On récupère la section dans laquelle est situé le 'add-button' 

        let helper = buildHelper();

        if(currentCategory.id == "scheduled"){
            let date = document.createElement('input');                 /* ++++ */
            date.type = "datetime-local";
            date.classList.add('helper-date');

            helper.insertAdjacentElement('afterbegin', date);
        }

        currentCategory.append(helper);                                    /* ++++ */
        helper.focus();
        currentHelper = helper;

        let confirm = document.querySelector('.helper-confirm');
        let cancel = document.querySelector('.helper-cancel');

        confirm.addEventListener('click', createItem);
        cancel.addEventListener('click', cancelCreation); 
    }

    else return;   
    
}

function buildHelper(){

    let helper = document.createElement('div');                 // => On crée le "helper" (= fenêtre de création du nouvel item)
    helper.classList.add('helper');

    let input = document.createElement('textarea');                  // => On crée l'espace pour entrer le texte ("input"), le bouton OK ("confirm") et celui
    input.classList.add('helper-input');                        //.. d'annulation("cancel")
    input.placeholder = "Enter text here...";
        
    let confirm = document.createElement('div');
    confirm.classList.add('helper-confirm');
    confirm.innerHTML = "OK";

    let cancel = document.createElement('div');
    cancel.classList.add('helper-cancel');
    cancel.innerHTML = "CANCEL";


    helper.insertAdjacentElement('afterbegin', input);          // => On ajoute "input", "confirm" et "cancel" au "Helper"
    helper.insertAdjacentElement('beforeend', confirm);
    helper.insertAdjacentElement('beforeend', cancel);

    return helper;
}


/* ================================== ITEMS ================================== */

function createItem(){

    let input = document.querySelector('.helper-input');        // => Le 'textarea'

    let item = document.createElement('div');                   // => On crée le "item" (contenant le 'li'( = texte) et le "delete-button")
    item.classList.add('item');


    let li = document.createElement('li');
    li.textContent = input.value;

    let deleteButton = document.createElement('div');
    deleteButton.classList.add('delete-button');
    deleteButton.innerHTML = "X";

    

    item.insertAdjacentElement('afterbegin', li);
    item.insertAdjacentElement('beforeend', deleteButton);
    
    ulTarget.append(item);

    if(currentCategory.id == 'scheduled'){
        let getdate = document.querySelector('.helper-date');       /* ++++ */
        const chars = {
            '-': '/',
            'T': '  '
        }

        let date = document.createElement('b');
        date.textContent = getdate.value.replace(/[-T]/g, letter => chars[letter]);

        
        li.textContent = ' => ' + input.value;
        li.insertAdjacentElement('afterbegin', date);

        liScheduled.push(item);                                         /* ++++ */
        liScheduled.sort((a, b) => a.textContent > b.textContent);
        for(let elem of liScheduled){
            ulTarget.append(elem);
        }
    }
        
    currentHelper.remove();
    currentHelper = undefined;
}


function cancelCreation(){ 
    currentHelper.remove();
    currentHelper = undefined;
}


function deleteItem(event){
    if(!event.target.classList.contains('delete-button') || currentHelper != undefined ) return;

    event.target.parentElement.remove();
}

