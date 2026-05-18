const API_BASE_URL = 'http://localhost:5202/api';

// =========================================
// 1. КРАСИВІ СПОВІЩЕННЯ (TOAST)
// =========================================
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
    requestAnimationFrame(() => { toast.style.opacity = '1'; toast.style.transform = 'translateY(0)'; });
    setTimeout(() => {
        toast.style.opacity = '0'; toast.style.transform = 'translateY(20px)';
        setTimeout(() => { if (document.body.contains(toast)) document.body.removeChild(toast); }, 300); 
    }, 6000); 
}

// =========================================
// 2. МОДАЛКА CONFIRM (ВИДАЛЕННЯ)
// =========================================
function showConfirmModal(title, text, onConfirm) {
    const overlay = document.createElement('div');
    overlay.style.position = 'fixed'; overlay.style.top = '0'; overlay.style.left = '0'; overlay.style.width = '100%'; overlay.style.height = '100%';
    overlay.style.backgroundColor = 'rgba(15, 23, 42, 0.6)'; overlay.style.backdropFilter = 'blur(4px)';
    overlay.style.display = 'flex'; overlay.style.alignItems = 'center'; overlay.style.justifyContent = 'center';
    overlay.style.zIndex = '9999'; overlay.style.opacity = '0'; overlay.style.transition = 'opacity 0.2s ease-in-out';

    const modal = document.createElement('div');
    modal.style.background = 'white'; modal.style.padding = '30px'; modal.style.borderRadius = '16px';
    modal.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1)'; modal.style.textAlign = 'center'; modal.style.maxWidth = '320px'; modal.style.width = '90%';
    modal.style.transform = 'translateY(20px)'; modal.style.transition = 'transform 0.2s ease-in-out'; modal.style.fontFamily = "'Inter', sans-serif";

    modal.innerHTML = `
        <h3 style="margin: 0 0 10px 0; color: #0f172a; font-size: 20px;">${title}</h3>
        <p style="margin: 0 0 24px 0; color: #64748b; font-size: 15px; line-height: 1.5;">${text}</p>
    `;

    const btnContainer = document.createElement('div'); btnContainer.style.display = 'flex'; btnContainer.style.gap = '12px';

    const btnCancel = document.createElement('button'); btnCancel.innerText = 'Скасувати';
    btnCancel.style.flex = '1'; btnCancel.style.padding = '10px 0'; btnCancel.style.background = '#f1f5f9'; btnCancel.style.color = '#475569'; btnCancel.style.border = 'none'; btnCancel.style.borderRadius = '8px'; btnCancel.style.fontWeight = '600'; btnCancel.style.cursor = 'pointer';
    btnCancel.onclick = () => { overlay.style.opacity = '0'; modal.style.transform = 'translateY(20px)'; setTimeout(() => document.body.removeChild(overlay), 200); };

    const btnConfirm = document.createElement('button'); btnConfirm.innerText = 'Видалити';
    btnConfirm.style.flex = '1'; btnConfirm.style.padding = '10px 0'; btnConfirm.style.background = '#ef4444'; btnConfirm.style.color = 'white'; btnConfirm.style.border = 'none'; btnConfirm.style.borderRadius = '8px'; btnConfirm.style.fontWeight = '600'; btnConfirm.style.cursor = 'pointer';
    btnConfirm.onclick = () => { overlay.style.opacity = '0'; modal.style.transform = 'translateY(20px)'; setTimeout(() => document.body.removeChild(overlay), 200); onConfirm(); };

    btnContainer.appendChild(btnCancel); btnContainer.appendChild(btnConfirm); modal.appendChild(btnContainer); overlay.appendChild(modal); document.body.appendChild(overlay);
    requestAnimationFrame(() => { overlay.style.opacity = '1'; modal.style.transform = 'translateY(0)'; });
}

// =========================================
// 3. ОСНОВНА ЛОГІКА (КЛАС)
// =========================================
class AdsManager {
    constructor() {
        this.allAds = []; 
        this.showOnlyMine = false; 
        
        // Масиви для зберігання вибраних фотографій (Base64)
        this.createImages = []; 
        this.editImages = [];
        
        this.adsList = document.getElementById('adsList');
        this.addAdForm = document.getElementById('addAdForm');
        
        this.categoryLabels = {
            cpu: 'Процесор', mb: 'Мат. плата', ram: 'ОЗУ', gpu: 'Відеокарта',
            psu: 'Блок живлення', ssd: 'SSD', case: 'Корпус', cooler: 'Охолодження', headset: 'Гарнітура'
        };

        this.init();
    }

    init() {
        this.loadAds();
        
        if(this.addAdForm) {
            this.addAdForm.addEventListener('submit', (e) => this.handleFormSubmit(e));
        }

        // Логіка додавання фотографій при створенні оголошення
        const photoInput = document.getElementById('adPhoto');
        if (photoInput) {
            photoInput.addEventListener('change', async (e) => {
                const files = Array.from(e.target.files);
                if (files.length === 0) return;

                const base64s = await Promise.all(files.map(f => this.fileToBase64(f)));
                this.createImages.push(...base64s); // Додаємо нові фото до старих
                this.renderCreateImages();
                e.target.value = ''; // Очищаємо інпут, щоб можна було вибрати той самий файл ще раз
            });
        }

        const btnAll = document.getElementById('showAllAdsBtn');
        const btnMine = document.getElementById('showMyAdsBtn');

        if(btnAll && btnMine) {
            btnAll.addEventListener('click', () => {
                this.showOnlyMine = false;
                btnAll.style.background = '#2563eb'; btnAll.style.color = 'white'; btnAll.style.border = 'none';
                btnMine.style.background = '#f1f5f9'; btnMine.style.color = '#475569'; btnMine.style.border = '1px solid #cbd5e1';
                this.renderAds();
            });

            btnMine.addEventListener('click', () => {
                const currentUser = localStorage.getItem('userName');
                if(!currentUser) return showToast('Будь ласка, увійдіть в акаунт!', 'error');
                
                this.showOnlyMine = true;
                btnMine.style.background = '#2563eb'; btnMine.style.color = 'white'; btnMine.style.border = 'none';
                btnAll.style.background = '#f1f5f9'; btnAll.style.color = '#475569'; btnAll.style.border = '1px solid #cbd5e1';
                this.renderAds();
            });
        }
    }

    fileToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    }

    // --- ФУНКЦІЇ ДЛЯ МАЛЮВАННЯ ПРЕВ'Ю ---
    renderCreateImages() {
        const container = document.getElementById('createImagePreviews');
        if(!container) return;
        
        container.innerHTML = this.createImages.map((img, i) => `
            <div style="position:relative; width:80px; height:80px; border-radius:8px; border: 1px solid #e2e8f0; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
                <img src="${img}" style="width:100%; height:100%; object-fit:cover; border-radius:8px;">
                <button type="button" onclick="adsManager.removeCreateImage(${i})" style="position:absolute; top:-6px; right:-6px; background:#ef4444; color:white; border:none; border-radius:50%; width:22px; height:22px; cursor:pointer; font-weight:bold; font-size:12px; display:flex; align-items:center; justify-content:center; padding-bottom: 2px;">✕</button>
            </div>
        `).join('');
    }

    removeCreateImage(index) {
        this.createImages.splice(index, 1); // Видаляємо конкретне фото з масиву
        this.renderCreateImages(); // Перемальовуємо
    }

    renderEditImages() {
        const container = document.getElementById('editImagePreviews');
        if(!container) return;
        
        container.innerHTML = this.editImages.map((img, i) => `
            <div style="position:relative; width:70px; height:70px; border-radius:8px; border: 1px solid #e2e8f0;">
                <img src="${img}" style="width:100%; height:100%; object-fit:cover; border-radius:8px;">
                <button type="button" onclick="adsManager.removeEditImage(${i})" style="position:absolute; top:-6px; right:-6px; background:#ef4444; color:white; border:none; border-radius:50%; width:20px; height:20px; cursor:pointer; font-weight:bold; font-size:10px; display:flex; align-items:center; justify-content:center; padding-bottom: 2px;">✕</button>
            </div>
        `).join('');
    }

    removeEditImage(index) {
        this.editImages.splice(index, 1);
        this.renderEditImages();
    }
    // -----------------------------------

    async loadAds() {
        try {
            const response = await fetch(`${API_BASE_URL}/ads`, { cache: 'no-cache' });
            const result = await response.json();
            this.allAds = result.data || result.Data || [];
            this.renderAds();
        } catch (error) {
            if (this.adsList) this.adsList.innerHTML = '<p style="color: #ef4444; text-align: center;">Помилка завантаження оголошень.</p>';
        }
    }

    renderAds() {
        if (!this.adsList) return;
        
        const currentUser = localStorage.getItem('userName');
        const currentRole = localStorage.getItem('userRole');

        const adsToDisplay = this.showOnlyMine 
            ? this.allAds.filter(ad => ad.ownerUsername === currentUser)
            : this.allAds;

        if (adsToDisplay.length === 0) {
            this.adsList.innerHTML = '<p style="text-align: center; color: #64748b;">Оголошень не знайдено.</p>';
            return;
        }

        this.adsList.innerHTML = adsToDisplay.map(ad => {
            const date = new Date(ad.createdAt).toLocaleDateString('uk-UA');
            
            let images = [];
            if (ad.imageBase64) {
                try {
                    images = JSON.parse(ad.imageBase64);
                    if (!Array.isArray(images)) images = [ad.imageBase64]; 
                } catch (e) { images = [ad.imageBase64]; }
            }

            const imagesHtml = images.length > 0 
                ? `<div style="display:flex; gap:10px; overflow-x:auto; margin-bottom:15px; padding-bottom:8px;">
                     ${images.map(img => `<img src="${img}" style="height:200px; min-width:200px; max-width: 250px; object-fit:cover; border-radius:8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">`).join('')}
                   </div>` 
                : '';
            
            const canEditDelete = (currentRole === 'Admin' || currentUser === ad.ownerUsername);
            const actionsHtml = canEditDelete ? `
                <div style="position:absolute; top:10px; right:10px; display:flex; gap:8px; z-index: 10;">
                    <button onclick="adsManager.openEdit(${ad.id})" style="background:#f59e0b; color:white; border:none; padding:6px 12px; border-radius:6px; cursor:pointer; font-weight:600; font-size:13px;">Редагувати</button>
                    <button onclick="adsManager.deleteAd(${ad.id})" style="background:#ef4444; color:white; border:none; padding:6px 12px; border-radius:6px; cursor:pointer; font-weight:600; font-size:13px;">Видалити</button>
                </div>
            ` : '';

  return `
                <div class="ad-card" style="position:relative; background:white; padding:20px; padding-bottom:45px; border-radius:12px; box-shadow:0 4px 6px rgba(0,0,0,0.05); margin-bottom:20px;">
                    ${actionsHtml}
                    ${imagesHtml}
                    <h3 style="margin:0 0 10px 0; color:#0f172a; padding-right: 160px;">${ad.title}</h3>
                    <p style="color:#475569; margin:10px 0; line-height: 1.5;">${ad.description}</p>
                    <div style="font-size:20px; font-weight:800; color:#2563eb; margin-bottom:15px;">${ad.price} грн</div>
                    <div style="font-size:13px; color:#64748b;">📞 Контакт: ${ad.contactInfo} <br> 🕒 Додано: ${date} <br> 👤 Продавець: <b style="color: #0f172a;">${ad.ownerUsername}</b></div>
                    
                    <span style="position: absolute; bottom: 15px; right: 15px; background: #e0f2fe; color: #0369a1; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: bold; margin: 0;">
                        ${this.categoryLabels[ad.category] || 'Товар'}
                    </span>
                </div>
            `;
        }).join('');
    }

    async handleFormSubmit(e) {
        e.preventDefault(); 
        const token = localStorage.getItem('authToken');
        
        if (!token) return showToast("Тільки авторизовані користувачі можуть створювати оголошення!", "error");
        
        // Тепер ми перевіряємо наш масив, а не input
        if (this.createImages.length === 0) return showToast("Будь ласка, додайте хоча б одну фотографію!", "error");

        try {
            const newAd = {
                title: document.getElementById('adTitle').value,
                description: document.getElementById('adDesc').value,
                price: parseFloat(document.getElementById('adPrice').value),
                contactInfo: document.getElementById('adContact').value,
                category: document.getElementById('adCategory').value,
                imageBase64: JSON.stringify(this.createImages) // Відправляємо наш масив!
            };

            const response = await fetch(`${API_BASE_URL}/ads`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify(newAd)
            });

            if (response.ok) {
                this.addAdForm.reset(); 
                this.createImages = []; // Очищаємо масив
                this.renderCreateImages(); // Стирання мініатюр
                this.loadAds(); 
                showToast('Оголошення успішно опубліковано!', 'success');
            } else if (response.status === 401) {
                showToast('Помилка авторизації. Переввійдіть в акаунт.', 'error');
            } else {
                showToast('Сталася помилка при збереженні.', 'error');
            }
        } catch (error) { showToast('Помилка відправки даних.', 'error'); }
    }

    // --- ЛОГІКА РЕДАГУВАННЯ ОГОЛОШЕННЯ ---
    openEdit(id) {
        const ad = this.allAds.find(a => a.id === id);
        if (!ad) return;

        // Розпаковуємо старі фото в масив для редагування
        this.editImages = [];
        if (ad.imageBase64) {
            try {
                this.editImages = JSON.parse(ad.imageBase64);
                if (!Array.isArray(this.editImages)) this.editImages = [ad.imageBase64]; 
            } catch (e) { this.editImages = [ad.imageBase64]; }
        }

        const overlay = document.createElement('div');
        overlay.style.position = 'fixed'; overlay.style.top = '0'; overlay.style.left = '0'; overlay.style.width = '100%'; overlay.style.height = '100%';
        overlay.style.backgroundColor = 'rgba(15, 23, 42, 0.6)'; overlay.style.backdropFilter = 'blur(4px)';
        overlay.style.display = 'flex'; overlay.style.alignItems = 'center'; overlay.style.justifyContent = 'center';
        overlay.style.zIndex = '9999'; overlay.style.opacity = '0'; overlay.style.transition = 'opacity 0.2s ease-in-out';

        const modal = document.createElement('div');
        modal.style.background = 'white'; modal.style.padding = '30px'; modal.style.borderRadius = '16px';
        modal.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1)'; modal.style.maxWidth = '400px'; modal.style.width = '90%';
        modal.style.transform = 'translateY(20px)'; modal.style.transition = 'transform 0.2s ease-in-out'; modal.style.fontFamily = "'Inter', sans-serif";

        modal.innerHTML = `
            <h3 style="margin: 0 0 20px 0; color: #0f172a; text-align: center; font-size: 20px;">Редагувати оголошення</h3>
            <input type="text" id="editTitle" value="${ad.title}" placeholder="Назва" style="width:100%; padding:10px; margin-bottom:12px; border:1px solid #cbd5e1; border-radius:8px; outline:none;">
            <textarea id="editDesc" rows="3" placeholder="Опис" style="width:100%; padding:10px; margin-bottom:12px; border:1px solid #cbd5e1; border-radius:8px; outline:none; resize:none;">${ad.description}</textarea>
            <input type="number" id="editPrice" value="${ad.price}" placeholder="Ціна" style="width:100%; padding:10px; margin-bottom:12px; border:1px solid #cbd5e1; border-radius:8px; outline:none;">
            <input type="text" id="editContact" value="${ad.contactInfo}" placeholder="Контакти" style="width:100%; padding:10px; margin-bottom:12px; border:1px solid #cbd5e1; border-radius:8px; outline:none;">
            <select id="editCategory" style="width:100%; padding:10px; margin-bottom:12px; border:1px solid #cbd5e1; border-radius:8px; outline:none;">
                <option value="cpu" ${ad.category === 'cpu' ? 'selected' : ''}>Процесор</option>
                <option value="mb" ${ad.category === 'mb' ? 'selected' : ''}>Мат. плата</option>
                <option value="ram" ${ad.category === 'ram' ? 'selected' : ''}>ОЗУ</option>
                <option value="gpu" ${ad.category === 'gpu' ? 'selected' : ''}>Відеокарта</option>
                <option value="psu" ${ad.category === 'psu' ? 'selected' : ''}>Блок живлення</option>
                <option value="ssd" ${ad.category === 'ssd' ? 'selected' : ''}>SSD</option>
                <option value="case" ${ad.category === 'case' ? 'selected' : ''}>Корпус</option>
                <option value="cooler" ${ad.category === 'cooler' ? 'selected' : ''}>Охолодження</option>
                <option value="headset" ${ad.category === 'headset' ? 'selected' : ''}>Гарнітура</option>
            </select>
            
            <label style="display:block; font-size:12px; color:#64748b; margin-bottom:5px;">Фотографії:</label>
            <div id="editImagePreviews" style="display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 10px;"></div>
            <div style="margin-bottom: 20px;">
                <label for="editPhoto" style="display: inline-block; padding: 8px 12px; background: #e2e8f0; color: #475569; border-radius: 8px; cursor: pointer; font-weight: 600; font-size: 13px;">+ Додати ще фото</label>
                <input type="file" id="editPhoto" accept="image/*" multiple style="display: none;">
            </div>
        `;

        const btnContainer = document.createElement('div'); btnContainer.style.display = 'flex'; btnContainer.style.gap = '12px';

        const btnCancel = document.createElement('button'); btnCancel.innerText = 'Скасувати';
        btnCancel.style.flex = '1'; btnCancel.style.padding = '10px 0'; btnCancel.style.background = '#f1f5f9'; btnCancel.style.color = '#475569'; btnCancel.style.border = 'none'; btnCancel.style.borderRadius = '8px'; btnCancel.style.fontWeight = '600'; btnCancel.style.cursor = 'pointer';
        btnCancel.onclick = () => { overlay.style.opacity = '0'; modal.style.transform = 'translateY(20px)'; setTimeout(() => document.body.removeChild(overlay), 200); };

        const btnSave = document.createElement('button'); btnSave.innerText = 'Зберегти';
        btnSave.style.flex = '1'; btnSave.style.padding = '10px 0'; btnSave.style.background = '#2563eb'; btnSave.style.color = 'white'; btnSave.style.border = 'none'; btnSave.style.borderRadius = '8px'; btnSave.style.fontWeight = '600'; btnSave.style.cursor = 'pointer';
        btnSave.onclick = async () => {
            if(this.editImages.length === 0) return showToast("Оголошення повинно мати хоча б одне фото!", "error");

            const updatedData = {
                title: document.getElementById('editTitle').value,
                description: document.getElementById('editDesc').value,
                price: parseFloat(document.getElementById('editPrice').value),
                contactInfo: document.getElementById('editContact').value,
                category: document.getElementById('editCategory').value,
                imageBase64: JSON.stringify(this.editImages) // Зберігаємо поточний стан масиву
            };

            const token = localStorage.getItem('authToken');
            try {
                const response = await fetch(`${API_BASE_URL}/ads/${id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                    body: JSON.stringify(updatedData)
                });

                if (response.ok) {
                    showToast('Оголошення оновлено!', 'success');
                    this.loadAds(); 
                    overlay.style.opacity = '0'; modal.style.transform = 'translateY(20px)'; setTimeout(() => document.body.removeChild(overlay), 200);
                } else { showToast('Помилка оновлення.', 'error'); }
            } catch (error) { showToast('Помилка з\'єднання з сервером.', 'error'); }
        };

        btnContainer.appendChild(btnCancel); btnContainer.appendChild(btnSave); modal.appendChild(btnContainer); overlay.appendChild(modal); document.body.appendChild(overlay);
        requestAnimationFrame(() => { overlay.style.opacity = '1'; modal.style.transform = 'translateY(0)'; });

        // Активуємо логіку додавання нових фото в модалці
        this.renderEditImages();
        document.getElementById('editPhoto').addEventListener('change', async (e) => {
            const files = Array.from(e.target.files);
            if (files.length === 0) return;
            const base64s = await Promise.all(files.map(f => this.fileToBase64(f)));
            this.editImages.push(...base64s);
            this.renderEditImages();
            e.target.value = ''; 
        });
    }

    async deleteAd(id) {
        showConfirmModal('Видалення оголошення', 'Ви впевнені, що хочете видалити це оголошення?', async () => {
            const token = localStorage.getItem('authToken');
            try {
                const response = await fetch(`${API_BASE_URL}/ads/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
                if (response.ok) { showToast('Оголошення успішно видалено', 'success'); this.loadAds(); } 
                else { showToast('Помилка видалення.', 'error'); }
            } catch (error) { showToast('Помилка з\'єднання.', 'error'); }
        });
    }
}

// Глобальна змінна, щоб HTML-кнопки (видалити хрестиком) могли викликати методи класу
window.adsManager = new AdsManager();