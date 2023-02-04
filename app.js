//ссылки
const links = document.querySelectorAll('.link')

//элементы корзины
const cartBtn = document.querySelector('.cart_btn')
const cartList = document.querySelector('.shopping-cart-items')

//Форма контактов
const contactBtn = document.querySelector('.contact-btn');
const firstName = document.querySelector('.first-name');
const lastName = document.querySelector('.last-name');
const email = document.querySelector('.email');
const msg = document.querySelector('.message');

//Получение контейнеров
const cartContainer = document.querySelector('.container')
const confContainer = document.querySelector('.conf_container')
const itemContainer = document.querySelector('.item-container')

//загрузка товаров в корзине
let cart = JSON.parse(localStorage.getItem("CART")) || []
cartUpdate()

//Обработка нажатия на товар

links.forEach(link => {
    link.addEventListener('click', () => {
        links.forEach(ele => ele.classList.remove('active'))
        link.classList.add('active')
    })
})

// Динамические карточки

item.forEach(item => {
    itemContainer.innerHTML += `
    <div class="item-card" data-tags="#all, ${item.tags}" itemid="${item.name}" data-modal="1" id="${item.article}">
        <img src="${item.image}" alt="">
        <div class="content">
            <h1 class="item-name-fltr">${item.name}</h1>
            <a class="cost">${item.cost}</a>
            <span class="tags">${item.tags}</span>
        </div>
    </div>
    `;
})

//фильтрация товаров

const filters = document.querySelectorAll('.filter-btn');
filters.forEach(filterBtn => {
    filterBtn.addEventListener('click', () => {
        let id = filterBtn.getAttribute('id');
        let itemCards = document.querySelectorAll('.item-card');
        itemCards.forEach(card => {
            if (card.getAttribute('data-tags').includes(id)) {
                card.classList.remove('hide');
            } else {
                card.classList.add('hide');
            }
        })
        filters.forEach(btn => btn.classList.remove('active'));
        filterBtn.classList.add('active');
    })
})


//формируем модальное окно и конфигуратор в нем
document.addEventListener('DOMContentLoaded', function () {

    /* Записываем в переменные массив элементов-кнопок и подложку.
       Подложке зададим id, чтобы не влиять на другие элементы с классом overlay*/
    let modalButtons = document.querySelectorAll('.item-card'),
        closeButtons = document.querySelectorAll('.js-modal-close');
    let boxid = 0
    let itemname

    /* Перебираем массив кнопок */
    modalButtons.forEach(function (elem) {
        /* Назначаем каждой кнопке обработчик клика */
        elem.addEventListener('click', function (e) {
            /* Предотвращаем стандартное действие элемента. */
            e.preventDefault();

            document.getElementsByTagName("body")[0].style.overflow = 'hidden';
            let modalId = this.getAttribute('data-modal'),
                modalElem = document.querySelector('.modal[data-modal="' + modalId + '"]');
            itemname = this.getAttribute('itemid')
            document.querySelector('.buy-price').innerHTML = '';
            confContainer.innerHTML = ``
            item.forEach(item => {
                if (item.name === itemname) {
                    item.configurations.forEach(conf => {
                        confContainer.innerHTML += `
                    <div class="box" itemid="${conf.article}" about="${conf.cost}">                        
                        <div class="image">
                            <img src="${conf.image}" alt="">
                        </div>
                        <div class="title">${conf.name}</div>
                        <div class="description">

                            <div class="textcols-row">
                        <div class="price">Стоимость: ${conf.cost}</div>
                        </div>
                            <div class="textcols-row">
                                <div class="textcols-item">
                                    Оперативная память
                                </div>
                                <div class="textcols-item">
                                    Процессор
                                </div>
                            </div>
                            <div class="textcols-row">
                                <div class="textcols-item-sub">
                                    ${conf.Mem}
                                </div>
                                <div class="textcols-item-sub">
                                    ${conf.CPU}
                                </div>
                            </div>

                            <div class="textcols-row">
                                <div class="textcols-item">
                                    Материнская плата
                                </div>
                                <div class="textcols-item">
                                    Видеокарта
                                </div>
                            </div>
                            <div class="textcols-row">
                                <div class="textcols-item-sub">
                                    ${conf.MB}
                                </div>
                                <div class="textcols-item-sub">
                                    ${conf.GPU}
                                </div>
                            </div>
                        </div>

                    </div>`
                    })
                }
            })
            //Подсветка выбранного варианта товара
            const boxes = document.querySelectorAll('.box');
            boxes.forEach(oneBox => {
                oneBox.addEventListener('click', () => {
                    boxid = oneBox.getAttribute('itemid');
                    boxes.forEach(box => box.classList.remove('active'));
                    oneBox.classList.add('active');
                    document.querySelector('.buy-price').innerHTML =
                        'Итого: ' + oneBox.getAttribute('about');
                })
            })
            /* После того как нашли нужное модальное окно, добавим класс
                 окну, чтобы показать их. */

            modalElem.classList.add('active');

        }); // end click

    }); // end foreach
    //Кнопка "добавить в корзину"
    document.querySelector('.buy-btn').addEventListener('click', () => {
        //Если уже есть
        if (boxid === 0 || cart.some(itemInCart => itemInCart.article === Number(boxid))) {
            swal({
                title: "Ошибка",
                type: 'warning',
                text: 'Товар уже в корзине',
                confirmButtonColor: "#ff3759"
            })
            //иначе
        } else {
            item.forEach(item => {
                if (item.name === itemname) {
                    cart.push({...item.configurations[boxid % 10 - 1], numbersInCart: 1})
                    document.querySelector('.total-count').innerHTML = cart.length.toString()
                    cartUpdate()
                }
            })
            closeModal()
        }
        boxid = 0
    })

    closeButtons.forEach(function (item) {

        item.addEventListener('click', function (e) {
            closeModal()
        });

    }); // end foreach

    document.body.addEventListener('keyup', function (e) {
        let key = e.keyCode;
        if (key === 27) {
            closeModal()
        }
    }, false);
}); // end ready

//Закрытие модального окна
function closeModal() {
    document.getElementsByTagName("body")[0].style.overflow = 'visible';
    document.querySelector('.modal.active').classList.remove('active');
}

//подготовка отправки сообщения контакта
contactBtn.addEventListener('click', () => {
    resetColor(firstName, lastName, email, msg, null)
    if (changeColor(firstName, lastName, email, msg, null)) {
        fetch('/mail', {
            method: 'post',
            headers: new Headers({'Content-Type': 'application/json'}),
            body: JSON.stringify({
                firstname: firstName.value,
                lastname: lastName.value,
                email: email.value,
                msg: msg.value,
            })
        })
            .then(res => res.json())
            .then(data => {
                if (data === 'Thanks for your message. I will reply to you within 2 working days')
                    swal({
                        type: 'success',
                        title: data,
                        showConfirmButton: false,
                        timer: 3000})
                else
                    swal({
                        type: 'error',
                        title: data,
                        showConfirmButton: false,
                        timer: 3000})
            })


    }
})

//Сброс цвета после валидации
function resetColor(firstNameCheck, lastNameCheck, emailCheck, msgCheck, telefonNumberCheck) {
    [firstNameCheck, lastNameCheck, emailCheck, msgCheck, telefonNumberCheck].forEach(object => {
        if (object !== null) {
            object.style.background = "rgb(0,0,0)"
            object.style.border = '1px solid #ff3559';
        }
    })
}

//Валидация и перекраска
function changeColor(firstNameCheck, lastNameCheck, emailCheck, msgCheck, telefonNumberCheck) {
    let flag = true
    if (firstNameCheck !== null)
        if (!(firstNameCheck.value.length && /^[a-zа-яё-]{3,16}$/i.test(firstNameCheck.value))) {
            firstNameCheck.style.background = "rgba(255,0,0,0.09)"
            flag = false
        }
    if (lastNameCheck !== null)
        if (!(lastNameCheck.value.length && /^[a-zа-яё-]{3,16}$/i.test(lastNameCheck.value))) {
            lastNameCheck.style.background = "rgba(255,0,0,0.09)"
            flag = false
        }
    if (emailCheck !== null)
        if (!(emailCheck.value.length && /^[A-Z0-9._%+-]+@[A-Z0-9-]+.+.[A-Z]{2,4}$/i.test(emailCheck.value))) {
            emailCheck.style.background = "rgba(255,0,0,0.09)"
            flag = false
        }
    if (msgCheck !== null)
        if (!(msgCheck.value.length)) {
            msgCheck.style.background = "rgba(255,0,0,0.09)"
            flag = false
        }
    if (telefonNumberCheck !== null) {
        if (!(telefonNumberCheck.value.length && /^((\+7|7|8)+([0-9]){10})$/.test(telefonNumberCheck.value))) {
            telefonNumberCheck.style.background = "rgba(255,0,0,0.09)"
            flag = false
        }
    }
    return flag
}

//Закрытие корзины
let c = false
window.addEventListener('click', function (e) {
    if (!document.querySelector('.shopping-cart').contains(e.target) && !document.querySelector('.cart_btn').contains(e.target) && c === false) {
        // Ниже код, который нужно выполнить при срабатывании события.
        document.querySelector('.container').style.display = 'none'
    } else {
        c = false
    }
});

//открытие корзины
cartBtn.addEventListener('click', () => {
    cartContainer.style.display = 'block'
    cartUpdate()
})

//перерисовка корзины
function cartUpdate() {
    cartList.innerHTML = ''
    cart = cart.filter(item => item.numbersInCart !== 0)
    if (cart.length === 0) {
        cartList.innerHTML = 'Товаров нет'
    } else {
        cart.forEach(cartItem => {
            cartList.innerHTML += `<li class="clearfix">
                <img src=${cartItem.image} alt="item1" />
                <span class="item-name">${cartItem.name}</span>
                
                <div class="units" id="units">
                    <div class="btn minus" onclick="changeNumberOfUnits('minus', ${cartItem.article} )">-</div>
                    <div class="number">${cartItem.numbersInCart}</div>
                    <div class="btn plus" onclick="changeNumberOfUnits('plus', ${cartItem.article} )">+</div>
                </div>
                <span class="item-price">${cartItem.cost}</span>
            </li>`
        })
    }
    renderSubtotal()
    localStorage.setItem("CART", JSON.stringify(cart))
}

//перерисовка субпараметров
// function renderSubtotal() {
//     let totalPrice = 0, totalItems = 0
//
//     cart.forEach(item => {
//         totalPrice += item.numbersInCart * Number(item.cost.slice(0, item.cost.length - 1))
//         totalItems += item.numbersInCart
//     })
//     document.getElementById("TotalCount").innerHTML = 'Total ' + totalItems
//     document.getElementById("TotalCost").innerHTML = totalPrice + "р"
//     document.querySelector('.total-count').innerHTML = cart.length.toString()
// }

//кнопки + и - в корзине
function changeNumberOfUnits(action, id) {
    c = true
    cart = cart.map((item) => {
        let numbersInCart = item.numbersInCart

        if (item.article === id) {
            if (action === "minus") {
                numbersInCart--
            }
            if (action === "plus" && numbersInCart < 10) {
                numbersInCart++
            }
        }
        return {
            ...item, numbersInCart,
        }
    })
    console.log(cart)
    cartUpdate()
}

//отправка заказа на почту
document.getElementById('Checkout').addEventListener('click', () => {
    (async () => {
        const {value: formValues} = await swal({
            title: "<h5 style='color:#cbcbcb'>Ordering: " + document.getElementById("TotalCost").innerHTML + "</h5>",
            background: "#1d1d1d",
            confirmButtonColor: "#ff3559",
            showCancelButton: true,
            html:
                '<div style="color: #cbcbcb">Firstname</div>' +
                '<input id="swal-input1" class="swal2-input" style="border: 1px solid #ff3559">' +
                '<div style="color: #cbcbcb">Lastname</div>' +
                '<input id="swal-input2" class="swal2-input" style="border: 1px solid #ff3559">' +
                '<div style="color: #cbcbcb">Email</div>' +
                '<input id="swal-input3" class="swal2-input" style="border: 1px solid #ff3559">' +
                '<div style="color: #cbcbcb">Number</div>' +
                '<input id="swal-input4" class="swal2-input" style="border: 1px solid #ff3559">',
            focusConfirm: false,
            preConfirm: () => {
                resetColor(document.getElementById('swal-input1'), document.getElementById('swal-input2'), document.getElementById('swal-input3'), null, document.getElementById('swal-input4'))
                if (changeColor(document.getElementById('swal-input1'), document.getElementById('swal-input2'), document.getElementById('swal-input3'), null, document.getElementById('swal-input4')))
                    return {
                        "firstname": document.getElementById('swal-input1').value,
                        "lastname": document.getElementById('swal-input2').value,
                        "email": document.getElementById('swal-input3').value,
                        "telefonNumber": document.getElementById('swal-input4').value,
                        "order": cart
                    }
                else return false
            }
        })
        console.log(formValues)
        if (formValues) {
            fetch('/buying', {
                method: 'post',
                headers: new Headers({'Content-Type': 'application/json'}),
                body: JSON.stringify(formValues)
            })
                .then(res => res.json())
                .then(data => {
                    if (data === 'Thanks you! All good'){
                        swal({
                            type: 'success',
                            title: data,
                            showConfirmButton: false,
                            timer: 3000})
                        localStorage.clear()
                        cart=[]
                        cartUpdate()
                        //document.querySelector('.total-count').innerHTML = cart.length.toString()
                    }
                    else
                        swal({
                            type: 'error',
                            title: data,
                            showConfirmButton: false,
                            timer: 3000})
                })
        }
    })()
})