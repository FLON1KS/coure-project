const API_BASE_URL = '/api/auth';

function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.innerText = message;
    toast.style.position = 'fixed'; toast.style.bottom = '30px'; toast.style.right = '30px';
    toast.style.backgroundColor = type === 'success' ? '#10b981' : '#ef4444';
    toast.style.color = 'white'; toast.style.padding = '14px 24px'; toast.style.borderRadius = '8px';
    toast.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)';
    toast.style.fontFamily = "'Inter', sans-serif"; toast.style.fontWeight = '600'; toast.style.fontSize = '14px';
    toast.style.zIndex = '10000'; toast.style.opacity = '0'; toast.style.transform = 'translateY(20px)';
    toast.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';

    document.body.appendChild(toast);
    requestAnimationFrame(() => {
        toast.style.opacity = '1';
        toast.style.transform = 'translateY(0)';
    });

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(20px)';
        setTimeout(() => {
            if (document.body.contains(toast)) document.body.removeChild(toast);
        }, 300);
    }, 6000);
}

async function login() {
    const user = document.getElementById('username').value.trim();
    const pass = document.getElementById('password').value.trim();

    if (!user || !pass) return showToast('Введіть логін та пароль!', 'error');

    try {
        const response = await fetch(`${API_BASE_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: user, password: pass })
        });

        const result = await response.json();

        if (result.success) {
            localStorage.setItem('userName', result.data.username);
            localStorage.setItem('userRole', result.data.role);
            localStorage.setItem('authToken', result.data.token);
            window.location.href = '/index.html';
        } else {
            showToast(result.message || 'Помилка входу', 'error');
        }
    } catch {
        showToast('Помилка підключення до сервера. Перевірте, чи запущений C#.', 'error');
    }
}

async function register() {
    const user = document.getElementById('username').value.trim();
    const pass = document.getElementById('password').value.trim();

    if (!user || !pass) return showToast('Введіть логін та пароль!', 'error');

    try {
        const response = await fetch(`${API_BASE_URL}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: user, password: pass, role: 'User' })
        });

        const result = await response.json();

        if (result.success) {
            showToast("Реєстрація успішна! Тепер натисніть 'Увійти'.", 'success');
        } else {
            showToast(result.message || 'Помилка реєстрації', 'error');
        }
    } catch {
        showToast('Помилка підключення до сервера.', 'error');
    }
}
