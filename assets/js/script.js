let modalQt = 1;
const qs = (el) => document.querySelector(el);
const qsa = (el) => document.querySelectorAll(el);

// Listagem das Pizzas
pizzaJson.map((item, index)=>{
      let pizzaItem = qs('.models .pizza-item').cloneNode(true); //Clona a div

      pizzaItem.setAttribute('data-key', index); //seta um atributo
      pizzaItem.querySelector('.pizza-item--img img').src = item.img;
      pizzaItem.querySelector('.pizza-item--price').innerHTML = `R$ ${item.price.toFixed(2)}`; //Add o preço e 2 casas dec
      pizzaItem.querySelector('.pizza-item--name').innerHTML = item.name; //Add o nome da pizza
      pizzaItem.querySelector('.pizza-item--desc').innerHTML = item.description; //Add a descrição

      pizzaItem.querySelector('a').addEventListener('click', (e)=>{ //Add um evento de click para aparecer o modal
            e.preventDefault(); //Previne a ação padrao
            let key = e.target.closest('.pizza-item').getAttribute('data-key'); //Procura o item mais prox chamado pizza-item e pega o atributo datakey
            modalQt = 1;

            qs('.pizzaBig img').src = pizzaJson[key].img;
            qs('.pizzaInfo h1').innerHTML = pizzaJson[key].name; //Add as informações da pizza no modal
            qs('.pizzaInfo--desc').innerHTML = pizzaJson[key].description;
            qs('.pizzaInfo--actualPrice').innerHTML = `R$ ${pizzaJson[key].price.toFixed(2)}`;
            qs('.pizzaInfo--size.selected').classList.remove('selected'); //Remove o 'selecionado'

            qsa('.pizzaInfo--size').forEach((size, sizeIndex)=>{
                  if (sizeIndex == 2) { //Add o 'selecionado' na medida grande
                        size.classList.add('selected');
                  }
                  size.querySelector('span').innerHTML = pizzaJson[key].sizes[sizeIndex];
            });

            qs('.pizzaInfo--qt').innerHTML = modalQt;
            
            qs('.pizzaWindowArea').style.opacity = 0; //Seta a opacidade em 0
            qs('.pizzaWindowArea').style.display = 'flex'; //Tira o display NONE
            setTimeout(() => { //Seta um time e coloca opacidade 1
                  qs('.pizzaWindowArea').style.opacity = 1;
            }, 200);
      });

      qs('.pizza-area').append(pizzaItem); //Adiciona novos conteudos
});

//Eventos do Modal
function closeModal() {
      qs('.pizzaWindowArea').style.opacity = 0;
      setTimeout(() => {
            qs('.pizzaWindowArea').style.display = 'none';
      }, 500);
}

qsa('.pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton').forEach((item)=>{
      item.addEventListener('click', closeModal);
});