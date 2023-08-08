document.addEventListener('click', helper);     // => Event listener sur tout le document: pas très utile ici... l'event 'click' ne provoque rien sur les éléments
                                                //.. parents du "add-button", on a donc pas besoin de le "catch" spécifiquement à cet endroit là en partant du DOM

document.addEventListener('click', deleteItem); // => En revanche, celui du "delete-button" DOIT être sur le document car il n'existe pas encore tant que
                                                //.. l'utilisateur n'a pas créé un nouvel "item"

let currentTarget;                              
let currentHelper;




function helper(event){
    if(currentHelper != undefined) return;

    if(event.target.classList.contains('add-button')){
        currentTarget = event.target.parentElement.nextElementSibling;     // => On récupère le <ul> le + proche (voir HTML)


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

        document.body.append(helper);
        helper.focus();
        currentHelper = helper;

        confirm.addEventListener('click', createItem);
        cancel.addEventListener('click', cancelCreation); 
    }
    else return;   
    
}


function createItem(){
    let input = document.querySelector('.helper-input');

    let item = document.createElement('div');
    item.classList.add('item');

    let li = document.createElement('li');
    li.innerHTML = input.value;
    let deleteButton = document.createElement('div');
    deleteButton.classList.add('delete-button');
    deleteButton.innerHTML = "X";


    item.insertAdjacentElement('afterbegin', li);
    item.insertAdjacentElement('beforeend', deleteButton);
    
    currentTarget.append(item);
    
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

