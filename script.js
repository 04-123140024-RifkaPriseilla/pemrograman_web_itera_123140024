const form = document.getElementById('taskForm');
const taskList = document.getElementById('taskList');
const incompleteCount = document.getElementById('incompleteCount');
const search = document.getElementById('search');
const filterButtons = document.querySelectorAll('.filter-btn');

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let currentFilter = 'all';

function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function renderTasks(filter = '', show = currentFilter) {
    taskList.innerHTML = '';
    let filteredTasks = tasks.filter(task =>
        task.name.toLowerCase().includes(filter.toLowerCase()) ||
        task.subject.toLowerCase().includes(filter.toLowerCase())
    );

    if (show === 'completed') filteredTasks = filteredTasks.filter(t => t.completed);
    else if (show === 'incomplete') filteredTasks = filteredTasks.filter(t => !t.completed);

    filteredTasks.forEach((task, index) => {
        const li = document.createElement('li');
        li.className = 'task' + (task.completed ? ' completed' : '');
        li.innerHTML = `
            <div>
                <strong>${task.name}</strong> - ${task.subject}<br>
                <small>Deadline: ${task.deadline}</small>
            </div>
            <div>
                <button class="done-btn" onclick="toggleTask(${index})">✔</button>
                <button class="edit-btn" onclick="editTask(${index})">✎</button>
                <button class="delete-btn" onclick="deleteTask(${index})">🗑</button>
            </div>
        `;
        taskList.appendChild(li);
    });

    incompleteCount.textContent = tasks.filter(t => !t.completed).length;
}

function validateForm(name, subject, deadline) {
    let valid = true;
    const nameError = document.getElementById('nameError');
    const subjectError = document.getElementById('subjectError');
    const deadlineError = document.getElementById('deadlineError');

    nameError.textContent = '';
    subjectError.textContent = '';
    deadlineError.textContent = '';

    if (!name.trim()) {
        nameError.textContent = 'Nama tugas wajib diisi';
        valid = false;
    }
    if (!subject.trim()) {
        subjectError.textContent = 'Mata kuliah wajib diisi';
        valid = false;
    }
    if (!deadline) {
        deadlineError.textContent = 'Deadline wajib diisi';
        valid = false;
    } else {
        const today = new Date().toISOString().split('T')[0];
        if (deadline < today) {
            deadlineError.textContent = 'Deadline tidak boleh tanggal yang sudah lewat';
            valid = false;
        }
    }
    return valid;
}

form.addEventListener('submit', e => {
    e.preventDefault();
    const name = document.getElementById('taskName').value;
    const subject = document.getElementById('subject').value;
    const deadline = document.getElementById('deadline').value;

    if (!validateForm(name, subject, deadline)) return;

    tasks.push({ name, subject, deadline, completed: false });
    saveTasks();
    renderTasks();
    form.reset();
});

function toggleTask(index) {
    tasks[index].completed = !tasks[index].completed;
    saveTasks();
    renderTasks(search.value);
}

function deleteTask(index) {
    tasks.splice(index, 1);
    saveTasks();
    renderTasks(search.value);
}

function editTask(index) {
    const newName = prompt('Ubah nama tugas:', tasks[index].name);
    const newSubject = prompt('Ubah mata kuliah:', tasks[index].subject);
    const newDeadline = prompt('Ubah deadline (YYYY-MM-DD):', tasks[index].deadline);
    if (newName && newSubject && newDeadline) {
        tasks[index].name = newName;
        tasks[index].subject = newSubject;
        tasks[index].deadline = newDeadline;
        saveTasks();
        renderTasks(search.value);
    }
}

filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelector('.filter-btn.active').classList.remove('active');
        btn.classList.add('active');
        currentFilter = btn.getAttribute('data-filter');
        renderTasks(search.value, currentFilter);
    });
});

search.addEventListener('input', () => renderTasks(search.value, currentFilter));

renderTasks();
