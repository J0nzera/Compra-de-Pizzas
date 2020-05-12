let cart = [];
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
            modalQt = 1; //reseta o modal para 1
            modalKey = key; //Salva qual a pizza esta selecionada

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

            qs('.pizzaInfo--qt').innerHTML = modalQt; //Adiciona a variavel no pizzaInfo
            
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

qsa('.pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton').forEach((item)=>{ //Botão cancelar
      item.addEventListener('click', closeModal);
});

qs('.pizzaInfo--qtmenos').addEventListener('click', ()=>{ //Botão Menos
      if (modalQt > 1) {
            modalQt--;
            qs('.pizzaInfo--qt').innerHTML = modalQt;
      }
});

qs('.pizzaInfo--qtmais').addEventListener('click', () => { //Botão Mais
      modalQt++;
      qs('.pizzaInfo--qt').innerHTML = modalQt;
});

qsa('.pizzaInfo--size').forEach((size, sizeIndex) => { //Seleção de pequeno, medio e grande
      size.addEventListener('click', (e)=>{
            qs('.pizzaInfo--size.selected').classList.remove('selected'); //Remove o 'selecionado'
            size.classList.add('selected');
      })
});

qs('.pizzaInfo--addButton').addEventListener('click', ()=>{ //Botao add carrinho
      let size = qs('.pizzaInfo--size.selected').getAttribute('data-key');
      let identifier = pizzaJson[modalKey].id+'@'+size; //Identificador
      let key = cart.findIndex((item) => item.identifier == identifier); //verifica se ja tem a pizza no carrinho

      if (key > -1) { //se tiver a msm pizza ele adiciona +1
            cart[key].qt += modalQt;
      } else { //senao adiciona uma nova
            cart.push({
                  identifier,
                  id: pizzaJson[modalKey].id,
                  size,
                  qt: modalQt
            });
      }
      
      updateCart();
      closeModal();
});

qs('.menu-openner').addEventListener('click', ()=>{ //Carrinho mobile
      if (cart.length > 0) {
            qs('aside').style.left = '0';
      }
});

qs('.menu-closer').addEventListener('click', ()=>{
      qs('aside').style.left = '100vw';
});

function updateCart() {
      qs('.menu-openner span').innerHTML = cart.length;

      if (cart.length > 0) { //Caso tenha item no carrinho, sera mostrado
            qs('aside').classList.add('show');
            qs('.cart').innerHTML = ''; //Zera

            let subtotal = 0;
            let desconto = 0;
            let total = 0;

            for (let i in cart) {
                  let pizzaItem = pizzaJson.find((item) => item.id == cart[i].id);
                  subtotal += pizzaItem.price * cart[i].qt;

                  let cartItem = qs('.models .cart--item').cloneNode(true); //Clona e adiciona

                  cartItem.querySelector('img').src = pizzaItem.img; //Adicina img ao carrinho
                  cartItem.querySelector('.cart--item-nome').innerHTML = `${pizzaItem.name} ${pizzaItem.sizes[cart[i].size]}`; //Add nome e tamanho
                  cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qt; //Add quantidade
                  cartItem.querySelector('.cart--item-qtmenos').addEventListener('click', ()=>{
                        if (cart[i].qt > 1) {
                              cart[i].qt--;
                        } else {
                              cart.splice(i, 1); //Remove o item do carrinho
                        }
                        updateCart();
                  });
                  cartItem.querySelector('.cart--item-qtmais').addEventListener('click', () => {
                        cart[i].qt++;
                        updateCart();
                  });

                  qs('.cart').append(cartItem);
            }

            desconto = subtotal * 0.1;
            total = subtotal - desconto;

            qs('.subtotal span:last-child').innerHTML = `R$ ${subtotal.toFixed(2)}`;
            qs('.desconto span:last-child').innerHTML = `R$ ${desconto.toFixed(2)}`;
            qs('.total span:last-child').innerHTML = `R$ ${total.toFixed(2)}`;

      } else {
            qs('aside').classList.remove('show');
            qs('aside').style.left = '100vw';
      }
}