document.addEventListener('click', helper);     // => Event listener sur tout le document: pas très utile ici... l'event 'click' ne provoque rien sur les éléments
                                                //.. parents du "add-button", on a donc pas besoin de le "catch" spécifiquement à cet endroit là en partant du DOM

document.addEventListener('click', deleteItem); // => En revanche, celui du "delete-button" DOIT être sur le document car il n'existe pas encore tant que
                                                //.. l'utilisateur n'a pas créé un nouvel "item

document.addEventListener('click', hideSection);

document.addEventListener('mousedown', moveHelper);


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

function moveHelper(event){
    if(!event.target.classList.contains('helper') || currentHelper == undefined || event.button) return;

    currentHelper.addEventListener('dragstart', prevent);
    document.addEventListener('selectstart', prevent);          // => bugfix: empêche les autres éléments du DOM d'être selectionnés accidentellement pendant qu'on déplace le helper

    function prevent(event){
        event.preventDefault();
    }

    let shiftX = event.offsetX;
    let shiftY = event.offsetY;

    moveAt(event.pageX, event.pageY);

    function moveAt(x, y){
        currentHelper.style.left = x - shiftX + 'px';
        currentHelper.style.top = y - shiftY + 'px';
    }

    function onMouseMove(event){
        moveAt(event.pageX, event.pageY);
    }

    document.addEventListener('mousemove', onMouseMove);

    document.addEventListener('mouseup', () => {
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('selectstart', prevent);
    });
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

    ulTarget.hidden = false;
        
    currentHelper.remove();
    currentHelper = undefined;
}


function cancelCreation(){ 
    currentHelper.remove();
    currentHelper = undefined;
}


function deleteItem(event){
    if(!event.target.classList.contains('delete-button') || currentHelper != undefined ) return;

    ulTarget = event.target.closest('UL');
    event.target.parentElement.remove();

    if(!ulTarget.firstElementChild) ulTarget.hidden = true;
}


/* ================================== SECTIONS ================================== */


function hideSection(event){
    if(currentHelper != undefined || event.target.tagName != 'H2') return;
    
    ulTarget = event.target.parentElement.nextElementSibling;
    if(!ulTarget.firstElementChild) return;
    
    ulTarget.hidden = !ulTarget.hidden;
}