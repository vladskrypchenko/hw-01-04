// ======= MODAL WINDOW =======
const openModalBtn = document.getElementById('openModal');
const modal = document.getElementById('modal');
const closeModalBtn = document.querySelector('.close');

openModalBtn?.addEventListener('click', () => {
  modal.classList.remove('hidden');
  modal.style.display = 'block';
});

closeModalBtn?.addEventListener('click', () => {
  modal.classList.add('hidden');
  modal.style.display = 'none';
});

window.addEventListener('click', (e) => {
  if (e.target == modal) {
    modal.classList.add('hidden');
    modal.style.display = 'none';
  }
});

window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    modal.classList.add('hidden');
    modal.style.display = 'none';
  }
});

// ======= FETCH POSTS API =======
const fetchBtn = document.getElementById('fetch-posts');
const postsList = document.getElementById('posts-list');
const limitInput = document.getElementById('limit');
const message = document.getElementById('message');

let currentPage = 1;
let totalPosts = 100;

fetchBtn?.addEventListener('click', async () => {
  const limit = parseInt(limitInput.value, 10);
  if (!limit || limit < 1) {
    message.textContent = 'Введіть коректну кількість постів.';
    return;
  }

  const maxPage = Math.ceil(totalPosts / limit);
  if (currentPage > maxPage) {
    message.textContent = 'Усі пости вже завантажено.';
    return;
  }

  const url = `https://jsonplaceholder.typicode.com/posts?_limit=${limit}&_page=${currentPage}`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();

    if (data.length === 0) {
      message.textContent = 'Більше постів немає для завантаження.';
      return;
    }

    data.forEach(post => {
      const li = document.createElement('li');
      li.innerHTML = `<strong>${post.title}</strong><p>${post.body}</p>`;
      postsList.appendChild(li);
    });

    message.textContent = '';
    currentPage++;
    fetchBtn.textContent = 'Завантажити ще';
  } catch (err) {
    console.error(err);
    message.textContent = 'Помилка при завантаженні даних.';
  }
});

// ======= SWIPER INITIALIZATION =======
document.addEventListener('DOMContentLoaded', () => {
    const swiper = new Swiper('.mySwiper', {
        // Optional parameters
        slidesPerView: 1,
        spaceBetween: 30,
        loop: true,
        pagination: {
          el: '.swiper-pagination',
          clickable: true,
        },
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        },
        breakpoints: {
            // when window width is >= 640px
            640: {
              slidesPerView: 2,
              spaceBetween: 20
            },
            // when window width is >= 1024px
            1024: {
              slidesPerView: 3,
              spaceBetween: 30
            }
        }
      });
});

// ======= FORM HANDLING =======
document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contactForm');

    if (contactForm) {
        contactForm.addEventListener('submit', function(event) {
            event.preventDefault(); // Prevent page reload

            const formData = {};
            let allFieldsFilled = true;

            // Access form elements using the elements property
            const elements = this.elements;
            for (let i = 0; i < elements.length; i++) {
                const element = elements[i];
                if (element.name) { // Consider only elements with a name attribute
                    if (element.required && !element.value.trim()) {
                        allFieldsFilled = false;
                    }
                    formData[element.name] = element.value.trim();
                }
            }

            if (!allFieldsFilled) {
                alert('Будь ласка, заповніть усі обов\'язкові поля.');
                return;
            }

            // If all fields are filled, collect data
            console.log('Form Data:', formData);

            // Save to localStorage
            let submissions = JSON.parse(localStorage.getItem('formSubmissions')) || [];
            submissions.push(formData);
            localStorage.setItem('formSubmissions', JSON.stringify(submissions));
            console.log('Submissions in localStorage:', submissions);

            alert('Форма успішно відправлена!');
            this.reset(); // Reset form fields
        });
    }
});

// ======= EXPAND/COLLAPSE TEXT =======
document.addEventListener('DOMContentLoaded', () => {
    const toggleButton = document.getElementById('toggleTextButton');
    const expandableText = document.getElementById('expandableText');

    if (toggleButton && expandableText) {
        toggleButton.addEventListener('click', () => {
            expandableText.classList.toggle('expanded');
            if (expandableText.classList.contains('expanded')) {
                toggleButton.textContent = 'Згорнути';
            } else {
                toggleButton.textContent = 'Читати далі';
            }
        });
    }
});

// ======= TODO APP (MockAPI) =======
document.addEventListener('DOMContentLoaded', () => {
    const todoApiUrl = 'https://6823368a65ba05803395c1eb.mockapi.io/api/hneu'; 
    const addTodoForm = document.getElementById('addTodoForm');
    const newTodoInput = document.getElementById('newTodoInput');
    const todoList = document.getElementById('todoList');
    const filterButtonsContainer = document.querySelector('.todo-filters');

    let allTodos = []; // Массив для хранения всех задач с сервера
    let currentFilter = 'all'; // Текущий активный фильтр

    // --- Render TODO item ---
    function renderTodoItem(todo) {
        const li = document.createElement('li');
        li.dataset.id = todo.id;
        if (todo.completed) { // Предполагаем, что API может вернуть completed
            li.classList.add('completed');
        }

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = todo.completed || false;
        checkbox.classList.add('complete-checkbox');
        checkbox.addEventListener('change', () => toggleTodoStatus(todo.id, checkbox.checked, todo.name)); // todo.name передаем для PUT

        const textSpan = document.createElement('span');
        textSpan.classList.add('todo-text');
        textSpan.textContent = todo.name; // Используем name как текст задачи
        // textSpan.addEventListener('click', () => toggleTodoStatus(todo.id, !checkbox.checked, todo.name)); // Альтернативный способ отметки

        const deleteButton = document.createElement('button');
        deleteButton.classList.add('delete-todo-btn');
        deleteButton.innerHTML = '&times;'; // Крестик
        deleteButton.addEventListener('click', () => deleteTodoItem(todo.id));

        li.appendChild(checkbox);
        li.appendChild(textSpan);
        li.appendChild(deleteButton);
        todoList.appendChild(li);
    }

    // --- Render Filtered TODOs ---
    function renderFilteredTodos() {
        todoList.innerHTML = ''; // Очищаем список перед рендерингом
        let todosToRender = allTodos;

        if (currentFilter === 'active') {
            todosToRender = allTodos.filter(todo => !todo.completed);
        } else if (currentFilter === 'completed') {
            todosToRender = allTodos.filter(todo => todo.completed);
        }
        // Если 'all', то todosToRender остается allTodos

        todosToRender.forEach(todo => renderTodoItem(todo));
    }

    // --- Fetch TODOs --- (GET)
    async function fetchTodos() {
        try {
            const response = await fetch(todoApiUrl);
            if (!response.ok) throw new Error(`Cannot fetch todos: ${response.status}`);
            allTodos = await response.json(); // Сохраняем все задачи
            // Убедимся, что у каждой задачи есть свойство completed
            allTodos = allTodos.map(todo => ({ ...todo, completed: todo.completed || false }));
            renderFilteredTodos(); // Рендерим согласно текущему фильтру (изначально 'all')
        } catch (error) {
            console.error('Error fetching todos:', error);
            todoList.innerHTML = '<li>Не вдалося завантажити завдання.</li>';
        }
    }

    // --- Add TODO --- (POST)
    async function addTodo(todoText) {
        const newTodo = {
            name: todoText, // Используем name для текста
            completed: false, // По умолчанию не выполнено
            // createdAt: new Date().toISOString() // MockAPI обычно сам ставит дату
        };
        try {
            const response = await fetch(todoApiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newTodo)
            });
            if (!response.ok) throw new Error(`Cannot add todo: ${response.status}`);
            const addedTodo = await response.json();
            allTodos.push({...addedTodo, completed: addedTodo.completed || false }); // Добавляем в общий массив
            renderFilteredTodos(); // Перерисовываем список с учетом фильтра
        } catch (error) {
            console.error('Error adding todo:', error);
        }
    }

    // --- Toggle TODO Status --- (PUT)
    async function toggleTodoStatus(todoId, isCompleted, todoName) {
        const updatedTodo = {
            name: todoName, // API требует name для PUT, судя по структуре
            completed: isCompleted 
        };
        try {
            const response = await fetch(`${todoApiUrl}/${todoId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedTodo)
            });
            if (!response.ok) throw new Error(`Cannot update todo: ${response.status}`);
            // Обновляем статус в локальном массиве allTodos
            const todoIndex = allTodos.findIndex(t => t.id === todoId);
            if (todoIndex > -1) {
                allTodos[todoIndex].completed = isCompleted;
            }
            renderFilteredTodos(); // Перерисовываем список
        } catch (error) {
            console.error('Error updating todo:', error);
        }
    }

    // --- Delete TODO --- (DELETE)
    async function deleteTodoItem(todoId) {
        try {
            const response = await fetch(`${todoApiUrl}/${todoId}`, { method: 'DELETE' });
            if (!response.ok) throw new Error(`Cannot delete todo: ${response.status}`);
            // Удаляем элемент из локального массива allTodos
            allTodos = allTodos.filter(t => t.id !== todoId);
            renderFilteredTodos(); // Перерисовываем список
        } catch (error) {
            console.error('Error deleting todo:', error);
        }
    }

    // --- Event Listeners ---
    if (addTodoForm) {
        addTodoForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const todoText = newTodoInput.value.trim();
            if (todoText) {
                addTodo(todoText);
                newTodoInput.value = '';
            }
        });
    }

    // --- Filter Buttons Event Listener ---
    if (filterButtonsContainer) {
        filterButtonsContainer.addEventListener('click', (e) => {
            if (e.target.matches('.filter-btn')) {
                const filterValue = e.target.dataset.filter;
                if (filterValue !== currentFilter) {
                    currentFilter = filterValue;
                    // Обновляем активную кнопку
                    filterButtonsContainer.querySelector('.filter-btn.active').classList.remove('active');
                    e.target.classList.add('active');
                    renderFilteredTodos();
                }
            }
        });
    }

    // Initial fetch
    fetchTodos();
});

// document.addEventListener('DOMContentLoaded', () => {
//     // Модальное окно
//     const modal = document.getElementById('modal');
//     const openModalButton = document.getElementById('openModal');
//     const closeButton = document.querySelector('.modal .close');
// 
//     if (openModalButton) {
//         openModalButton.onclick = function() {
//             modal.classList.remove('hidden');
//         }
//     }
// 
//     if (closeButton) {
//         closeButton.onclick = function() {
//             modal.classList.add('hidden');
//         }
//     }
// 
//     window.onclick = function(event) {
//         if (event.target == modal) {
//             modal.classList.add('hidden');
//         }
//     }
// 
//     // Загрузка постов
//     const fetchPostsButton = document.getElementById('fetch-posts');
//     const postsList = document.getElementById('posts-list');
//     const limitInput = document.getElementById('limit');
//     const messageElement = document.getElementById('message');
// 
//     if (fetchPostsButton) {
//         fetchPostsButton.addEventListener('click', fetchPosts);
//     }
// 
//     async function fetchPosts() {
//         const limit = limitInput.value || 5;
//         const apiUrl = `https://jsonplaceholder.typicode.com/posts?_limit=${limit}`;
//         
//         messageElement.textContent = 'Загрузка постів...';
//         messageElement.style.color = 'blue';
// 
//         try {
//             const response = await fetch(apiUrl);
//             if (!response.ok) {
//                 throw new Error(`HTTP error! status: ${response.status}`);
//             }
//             const posts = await response.json();
//             
//             postsList.innerHTML = ''; // Очистка списка перед добавлением новых постов
//             
//             if (posts.length === 0) {
//                 messageElement.textContent = 'Пости не знайдені.';
//                 messageElement.style.color = 'orange';
//                 return;
//             }
// 
//             posts.forEach(post => {
//                 const listItem = document.createElement('li');
//                 listItem.innerHTML = `<h4>${post.title}</h4><p>${post.body}</p>`;
//                 postsList.appendChild(listItem);
//             });
//             messageElement.textContent = 'Пости успішно завантажені!';
//             messageElement.style.color = 'green';
// 
//         } catch (error) {
//             console.error('Fetch error:', error);
//             postsList.innerHTML = '';
//             messageElement.textContent = `Помилка завантаження: ${error.message}`;
//             messageElement.style.color = 'red';
//         }
//     }
// });