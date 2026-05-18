const API_BASE_URL = 'http://localhost:5202/api';

// =========================================
// 1. КРАСИВІ СПОВІЩЕННЯ ТА МОДАЛКИ (ІЗ ADS.JS)
// =========================================
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.innerText = message;
    toast.style.position = 'fixed'; toast.style.bottom = '30px'; toast.style.right = '30px';
    toast.style.backgroundColor = type === 'success' ? '#10b981' : '#ef4444'; 
    toast.style.color = 'white'; toast.style.padding = '14px 24px'; toast.style.borderRadius = '8px';
    toast.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)'; toast.style.fontFamily = "'Inter', sans-serif";
    toast.style.fontWeight = '600'; toast.style.fontSize = '14px'; toast.style.zIndex = '10000';
    toast.style.opacity = '0'; toast.style.transform = 'translateY(20px)'; toast.style.transition = 'all 0.3s';
    document.body.appendChild(toast);
    requestAnimationFrame(() => { toast.style.opacity = '1'; toast.style.transform = 'translateY(0)'; });
    setTimeout(() => {
        toast.style.opacity = '0'; toast.style.transform = 'translateY(20px)';
        setTimeout(() => { if (document.body.contains(toast)) document.body.removeChild(toast); }, 300); 
    }, 6000); 
}

function showConfirmModal(title, text, onConfirm) {
    const overlay = document.createElement('div');
    overlay.style.position = 'fixed'; overlay.style.top = '0'; overlay.style.left = '0'; overlay.style.width = '100%'; overlay.style.height = '100%';
    overlay.style.backgroundColor = 'rgba(15, 23, 42, 0.6)'; overlay.style.backdropFilter = 'blur(4px)';
    overlay.style.display = 'flex'; overlay.style.alignItems = 'center'; overlay.style.justifyContent = 'center';
    overlay.style.zIndex = '9999'; overlay.style.opacity = '0'; overlay.style.transition = 'opacity 0.2s';

    const modal = document.createElement('div');
    modal.style.background = 'white'; modal.style.padding = '30px'; modal.style.borderRadius = '16px';
    modal.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1)'; modal.style.textAlign = 'center'; modal.style.maxWidth = '320px'; modal.style.width = '90%';
    modal.style.transform = 'translateY(20px)'; modal.style.transition = 'transform 0.2s'; modal.style.fontFamily = "'Inter', sans-serif";

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

function showEditModal(ad, onSave) {
    const overlay = document.createElement('div');
    overlay.style.position = 'fixed'; overlay.style.top = '0'; overlay.style.left = '0'; overlay.style.width = '100%'; overlay.style.height = '100%';
    overlay.style.backgroundColor = 'rgba(15, 23, 42, 0.6)'; overlay.style.backdropFilter = 'blur(4px)';
    overlay.style.display = 'flex'; overlay.style.alignItems = 'center'; overlay.style.justifyContent = 'center';
    overlay.style.zIndex = '9999'; overlay.style.opacity = '0'; overlay.style.transition = 'opacity 0.2s';

    const modal = document.createElement('div');
    modal.style.background = 'white'; modal.style.padding = '30px'; modal.style.borderRadius = '16px';
    modal.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1)'; modal.style.maxWidth = '400px'; modal.style.width = '90%';
    modal.style.transform = 'translateY(20px)'; modal.style.transition = 'transform 0.2s'; modal.style.fontFamily = "'Inter', sans-serif";

    modal.innerHTML = `
        <h3 style="margin: 0 0 20px 0; color: #0f172a; text-align: center; font-size: 20px;">Редагувати оголошення</h3>
        <input type="text" id="editTitle" value="${ad.title || ad.name}" placeholder="Назва" style="width:100%; padding:10px; margin-bottom:12px; border:1px solid #cbd5e1; border-radius:8px; outline:none;">
        <textarea id="editDesc" rows="3" placeholder="Опис" style="width:100%; padding:10px; margin-bottom:12px; border:1px solid #cbd5e1; border-radius:8px; outline:none; resize:none;">${ad.description}</textarea>
        <input type="number" id="editPrice" value="${ad.price}" placeholder="Ціна" style="width:100%; padding:10px; margin-bottom:12px; border:1px solid #cbd5e1; border-radius:8px; outline:none;">
        <input type="text" id="editContact" value="${ad.contactInfo || ''}" placeholder="Контакти" style="width:100%; padding:10px; margin-bottom:12px; border:1px solid #cbd5e1; border-radius:8px; outline:none;">
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
        if(marketplaceApp.editImages.length === 0) return showToast("Оголошення повинно мати хоча б одне фото!", "error");
        const updatedData = {
            title: document.getElementById('editTitle').value,
            description: document.getElementById('editDesc').value,
            price: parseFloat(document.getElementById('editPrice').value),
            contactInfo: document.getElementById('editContact').value,
            category: document.getElementById('editCategory').value,
            imageBase64: JSON.stringify(marketplaceApp.editImages)
        };
        overlay.style.opacity = '0'; modal.style.transform = 'translateY(20px)'; setTimeout(() => document.body.removeChild(overlay), 200);
        onSave(updatedData); 
    };

    btnContainer.appendChild(btnCancel); btnContainer.appendChild(btnSave); modal.appendChild(btnContainer); overlay.appendChild(modal); document.body.appendChild(overlay);
    requestAnimationFrame(() => { overlay.style.opacity = '1'; modal.style.transform = 'translateY(0)'; });

    marketplaceApp.renderEditImages();
    document.getElementById('editPhoto').addEventListener('change', async (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;
        const base64s = await Promise.all(files.map(f => marketplaceApp.fileToBase64(f)));
        marketplaceApp.editImages.push(...base64s);
        marketplaceApp.renderEditImages();
        e.target.value = ''; 
    });
}

// =========================================
// 2. ОСНОВНИЙ КЛАС ДОДАТКУ
// =========================================
class MarketplaceApp {
    constructor() {
        this.allItems = [];
        this.currentCategory = 'all';
        this.editImages = []; 

        this.labelsMapping = {
            cpu: 'Процесор', mb: 'Мат. плата', ram: 'ОЗУ', gpu: 'Відеокарта',
            psu: 'Блок живлення', ssd: 'SSD', case: 'Корпус', cooler: 'Охолодження', headset: 'Гарнітура'
        };

        this.init();
    }

    async init() {
        this.checkAuth();
        this.setupEventListeners();
        await this.fetchEverything();
    }

    fileToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader(); reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result); reader.onerror = error => reject(error);
        });
    }

    renderEditImages() {
        const container = document.getElementById('editImagePreviews');
        if(!container) return;
        container.innerHTML = this.editImages.map((img, i) => `
            <div style="position:relative; width:70px; height:70px; border-radius:8px; border: 1px solid #e2e8f0;">
                <img src="${img}" style="width:100%; height:100%; object-fit:cover; border-radius:8px;">
                <button type="button" onclick="marketplaceApp.removeEditImage(${i})" style="position:absolute; top:-6px; right:-6px; background:#ef4444; color:white; border:none; border-radius:50%; width:20px; height:20px; cursor:pointer; font-weight:bold; font-size:10px; display:flex; align-items:center; justify-content:center; padding-bottom: 2px;">✕</button>
            </div>
        `).join('');
    }

    removeEditImage(index) {
        this.editImages.splice(index, 1);
        this.renderEditImages();
    }

    async fetchEverything() {
        const endpoints = [
            { url: 'hardware/cpus', type: 'cpu', label: 'Процесор' },
            { url: 'hardware/motherboards', type: 'mb', label: 'Мат. плата' },
            { url: 'hardware/rams', type: 'ram', label: 'ОЗУ' },
            { url: 'hardware/gpus', type: 'gpu', label: 'Відеокарта' },
            { url: 'hardware/powersupplies', type: 'psu', label: 'Блок живлення' },
            { url: 'hardware/ssds', type: 'ssd', label: 'SSD' },
            { url: 'hardware/cases', type: 'case', label: 'Корпус' },
            { url: 'hardware/coolers', type: 'cooler', label: 'Охолодження' },
            { url: 'hardware/headsets', type: 'headset', label: 'Гарнітура' },
            { url: 'ads', type: 'ad', label: 'Б/В Оголошення' } 
        ];

        try {
            const responses = await Promise.all(endpoints.map(e => fetch(`${API_BASE_URL}/${e.url}`, { cache: 'no-cache' })));
            const dataObjects = await Promise.all(responses.map(r => r.json()));

            this.allItems = dataObjects.flatMap((response, index) => {
                const itemsList = response.data || response.Data || []; 
                return itemsList.map(item => {
                    const isAdItem = endpoints[index].type === 'ad';
                    const finalCategory = isAdItem ? item.category : endpoints[index].type;
                    return {
                        ...item,
                        category: finalCategory,
                        isAd: isAdItem,
                        categoryLabel: isAdItem ? (this.labelsMapping[finalCategory] || 'Товар') : endpoints[index].label
                    };
                });
            });

            this.allItems.sort(() => Math.random() - 0.5);
            this.updatePriceLimits();
            this.applyFilters(); 
        } catch (err) {
            const grid = document.getElementById('marketGrid');
            if (grid) grid.innerHTML = "<p style='color: #ef4444; text-align: center; grid-column: 1 / -1; margin-top: 40px;'>Помилка зв'язку з сервером.</p>";
        }
    }

    renderItems(items) {
        const grid = document.getElementById('marketGrid');
        if (!grid) return;

        window.currentMarketItems = items;

        if (items.length === 0) {
            grid.innerHTML = '<p style="grid-column: 1 / -1; text-align: center; color: #64748b; margin-top: 40px; font-size: 18px;">За вашим запитом нічого не знайдено 😔</p>';
            return;
        }

        const currentUser = localStorage.getItem('userName');
        const currentRole = localStorage.getItem('userRole');

        grid.innerHTML = items.map((item, index) => {
            let firstImageUrl = '';
            if (item.imageBase64) {
                try {
                    const parsed = JSON.parse(item.imageBase64);
                    firstImageUrl = Array.isArray(parsed) ? parsed[0] : item.imageBase64;
                } catch (e) { firstImageUrl = item.imageBase64; }
            }

            const imageHtml = firstImageUrl 
                ? `<img src="${firstImageUrl}" style="width: 100%; height: 180px; object-fit: cover; border-radius: 8px; margin-bottom: 15px;" alt="Фото">` 
                : `<div style="width: 100%; height: 180px; background: #f1f5f9; border-radius: 8px; margin-bottom: 15px; display: flex; align-items: center; justify-content: center; color: #94a3b8; font-size: 40px;">💻</div>`;

            // ТУТ ВАЖЛИВА ЗМІНА: Переносимо плашку в правий нижній кут картки
            const badgeStyle = `position: absolute; top: auto; bottom: 15px; right: 15px; left: auto; z-index: 5; margin: 0; ${item.isAd ? 'background: #e0f2fe; color: #0369a1;' : 'background: #f1f5f9; color: #475569;'}`;

            const canEditDelete = item.isAd && (currentRole === 'Admin' || currentUser === item.ownerUsername);
            
            const actionsHtml = canEditDelete ? `
                <div style="position:absolute; top:10px; right:10px; display:flex; gap:8px; z-index: 10;">
                    <button onclick="event.stopPropagation(); marketplaceApp.openEdit(${item.id})" style="background:#f59e0b; color:white; border:none; padding:6px 12px; border-radius:6px; cursor:pointer; font-weight:600; font-size:13px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">Редагувати</button>
                    <button onclick="event.stopPropagation(); marketplaceApp.deleteAd(${item.id})" style="background:#ef4444; color:white; border:none; padding:6px 12px; border-radius:6px; cursor:pointer; font-weight:600; font-size:13px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">Видалити</button>
                </div>
            ` : '';

            // Додали padding-bottom: 45px до item-card, щоб текст не ховався під плашку
            return `
            <div class="item-card" style="cursor: pointer; padding-bottom: 45px; ${item.isAd ? 'border-left: 4px solid #0284c7;' : ''}" onclick="showItemDetails(${index})">
                ${actionsHtml}
                ${imageHtml}
                <p class="item-name">${item.name || item.title}</p>
                <p class="item-price">${item.price.toLocaleString()} грн.</p>
                <div class="item-desc">
    ${item.technicalSpecs ? `<span style="color: #0f172a; font-weight: 600;">⚙️ ${item.technicalSpecs}</span><br><br>` : ''}
    ${item.description || 'Нове комплектуюче з офіційного каталогу.'}
</div>

                <span class="badge" style="${badgeStyle}">${item.categoryLabel}</span>
            </div>
            `;
        }).join('');
    }

    openEdit(id) {
        const ad = this.allItems.find(a => a.id === id && a.isAd);
        if (!ad) return;

        this.editImages = [];
        if (ad.imageBase64) {
            try {
                this.editImages = JSON.parse(ad.imageBase64);
                if (!Array.isArray(this.editImages)) this.editImages = [ad.imageBase64]; 
            } catch (e) { this.editImages = [ad.imageBase64]; }
        }

        showEditModal(ad, async (updatedData) => {
            const token = localStorage.getItem('authToken');
            try {
                const response = await fetch(`${API_BASE_URL}/ads/${id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                    body: JSON.stringify(updatedData)
                });

                if (response.ok) {
                    showToast('Оголошення оновлено!', 'success');
                    this.fetchEverything(); // Перезавантажуємо головну
                } else if (response.status === 403) { showToast('У вас немає прав на редагування!', 'error'); } 
                else { showToast('Помилка оновлення.', 'error'); }
            } catch (error) { showToast('Помилка з\'єднання з сервером.', 'error'); }
        });
    }

    async deleteAd(id) {
        showConfirmModal('Видалення оголошення', 'Ви впевнені, що хочете видалити це оголошення?', async () => {
            const token = localStorage.getItem('authToken');
            try {
                const response = await fetch(`${API_BASE_URL}/ads/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
                if (response.ok) { 
                    showToast('Оголошення успішно видалено', 'success'); 
                    this.fetchEverything(); 
                } 
                else if (response.status === 403) { showToast('У вас немає прав на видалення!', 'error'); } 
                else { showToast('Помилка видалення.', 'error'); }
            } catch (error) { showToast('Помилка з\'єднання.', 'error'); }
        });
    }

    updatePriceLimits() {
        const minInput = document.getElementById('minPrice');
        const maxInput = document.getElementById('maxPrice');
        if (!minInput || !maxInput || this.allItems.length === 0) return;
        const categoryItems = this.currentCategory === 'all' ? this.allItems : this.allItems.filter(item => item.category === this.currentCategory);
        if (categoryItems.length === 0) { minInput.placeholder = "0"; maxInput.placeholder = "0"; return; }
        const prices = categoryItems.map(item => item.price);
        minInput.placeholder = Math.min(...prices); maxInput.placeholder = Math.max(...prices);
    }

    applyFilters() {
        const minInput = document.getElementById('minPrice');
        const maxInput = document.getElementById('maxPrice');
        const min = minInput && minInput.value !== '' ? parseFloat(minInput.value) : (minInput ? parseFloat(minInput.placeholder) : 0);
        const max = maxInput && maxInput.value !== '' ? parseFloat(maxInput.value) : (maxInput ? parseFloat(maxInput.placeholder) : Infinity);

        const filtered = this.allItems.filter(item => {
            let matchesType = (this.currentCategory === 'all') || (item.category === this.currentCategory);
            return matchesType && (item.price >= min && item.price <= max);
        });
        this.renderItems(filtered);
    }

    setupEventListeners() {
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.currentCategory = e.target.dataset.type;
                document.getElementById('minPrice').value = ''; document.getElementById('maxPrice').value = '';
                this.updatePriceLimits(); this.applyFilters();
            });
        });
        const applyBtn = document.getElementById('applyBtn');
        if (applyBtn) applyBtn.addEventListener('click', () => this.applyFilters());
    }

    checkAuth() {
        const userName = localStorage.getItem('userName');
        const userRole = localStorage.getItem('userRole');
        const authWidget = document.getElementById('authWidget');
        const userIcon = document.getElementById('userIcon');
        const authMainText = document.getElementById('authMainText');
        const authSubText = document.getElementById('authSubText');

        if (userName && authWidget && authMainText && authSubText) {
            authMainText.textContent = `${userName}`; 
            authMainText.style.color = '#1d4ed8';
            authSubText.style.display = 'block'; 
            authWidget.style.background = '#eff6ff'; 
            authWidget.style.border = '1px solid #bfdbfe'; 
            if (userIcon) userIcon.setAttribute('stroke', '#2563eb'); 
            
            // --- СУВОРІШИЙ, "ДОРОСЛИЙ" БЕЙДЖ АДМІНІСТРАТОРА ---
            if (userRole === 'Admin') {
                let badge = document.getElementById('adminPanelBadge');
                if (!badge) {
                    badge = document.createElement('div');
                    badge.id = 'adminPanelBadge';
                    badge.innerHTML = '🛡️ Режим адміністратора';
                    badge.style = 'background: #0f172a; color: #f8fafc; padding: 6px 14px; border-radius: 8px; font-weight: 600; font-size: 13px; margin-left: 20px; letter-spacing: 0.3px; border: 1px solid #334155;';
                    
                    const headerH1 = document.querySelector('.header h1');
                    if (headerH1) headerH1.insertAdjacentElement('afterend', badge);
                }
            }
        } else if (authWidget && authMainText) {
            authWidget.style.background = '#f1f5f9'; 
            authWidget.style.border = '1px solid transparent';
            if (userIcon) userIcon.setAttribute('stroke', '#64748b'); 
            authMainText.textContent = 'Увійти / Зареєструватися';
            authMainText.style.color = '#475569';
            if (authSubText) authSubText.style.display = 'none'; 
            
            const badge = document.getElementById('adminPanelBadge');
            if (badge) badge.remove();
        }
    }
}

// =========================================
// ДЕТАЛІ ТОВАРУ ТА ВИХІД
// =========================================
window.showItemDetails = (index) => {
    const item = window.currentMarketItems[index];
    if (!item) return;

    let images = [];
    if (item.imageBase64) {
        try { const parsed = JSON.parse(item.imageBase64); images = Array.isArray(parsed) ? parsed : [item.imageBase64]; } 
        catch (e) { images = [item.imageBase64]; }
    }
    let currentImgIndex = 0;

    const overlay = document.createElement('div');
    overlay.style.position = 'fixed'; overlay.style.top = '0'; overlay.style.left = '0'; overlay.style.width = '100%'; overlay.style.height = '100%';
    overlay.style.backgroundColor = 'rgba(15, 23, 42, 0.7)'; overlay.style.backdropFilter = 'blur(4px)';
    overlay.style.display = 'flex'; overlay.style.alignItems = 'center'; overlay.style.justifyContent = 'center';
    overlay.style.zIndex = '10000'; overlay.style.opacity = '0'; overlay.style.transition = 'opacity 0.2s';
    overlay.onclick = (e) => { if(e.target === overlay) document.body.removeChild(overlay); };

    const modal = document.createElement('div');
    modal.style.background = 'white'; modal.style.borderRadius = '16px'; modal.style.boxShadow = '0 25px 50px -12px rgba(0, 0, 0, 0.25)';
    modal.style.width = '100%'; modal.style.maxWidth = '600px'; modal.style.maxHeight = '90vh';
    modal.style.overflowY = 'auto'; modal.style.position = 'relative';
    modal.style.transform = 'translateY(20px)'; modal.style.transition = 'transform 0.2s'; modal.style.fontFamily = "'Inter', sans-serif";

    const closeBtn = document.createElement('button'); closeBtn.innerHTML = '✕';
    closeBtn.style.position = 'absolute'; closeBtn.style.top = '15px'; closeBtn.style.right = '15px'; closeBtn.style.background = 'rgba(0,0,0,0.5)'; closeBtn.style.color = 'white'; closeBtn.style.border = 'none'; closeBtn.style.borderRadius = '50%'; closeBtn.style.width = '32px'; closeBtn.style.height = '32px'; closeBtn.style.cursor = 'pointer'; closeBtn.style.zIndex = '10'; closeBtn.style.fontWeight = 'bold';
    closeBtn.onclick = () => document.body.removeChild(overlay);
    modal.appendChild(closeBtn);

    if (images.length > 0 && images[0] !== "") {
        const imageSection = document.createElement('div');
        imageSection.style.position = 'relative'; imageSection.style.width = '100%'; imageSection.style.height = '350px';
        imageSection.style.background = '#f8fafc'; imageSection.style.display = 'flex'; imageSection.style.alignItems = 'center'; imageSection.style.justifyContent = 'center';

        const imgEl = document.createElement('img');
        imgEl.style.width = '100%'; imgEl.style.height = '100%'; imgEl.style.objectFit = 'contain'; imgEl.src = images[currentImgIndex];
        imageSection.appendChild(imgEl);

        if (images.length > 1) {
            const btnPrev = document.createElement('button'); btnPrev.innerHTML = '❮';
            btnPrev.style.position = 'absolute'; btnPrev.style.left = '10px'; btnPrev.style.top = '50%'; btnPrev.style.transform = 'translateY(-50%)'; btnPrev.style.background = 'rgba(255,255,255,0.8)'; btnPrev.style.border = 'none'; btnPrev.style.borderRadius = '50%'; btnPrev.style.width = '40px'; btnPrev.style.height = '40px'; btnPrev.style.cursor = 'pointer'; btnPrev.style.fontSize = '18px';
            const btnNext = document.createElement('button'); btnNext.innerHTML = '❯';
            btnNext.style.position = 'absolute'; btnNext.style.right = '10px'; btnNext.style.top = '50%'; btnNext.style.transform = 'translateY(-50%)'; btnNext.style.background = 'rgba(255,255,255,0.8)'; btnNext.style.border = 'none'; btnNext.style.borderRadius = '50%'; btnNext.style.width = '40px'; btnNext.style.height = '40px'; btnNext.style.cursor = 'pointer'; btnNext.style.fontSize = '18px';
            
            const counter = document.createElement('div'); counter.innerText = `1 / ${images.length}`;
            counter.style.position = 'absolute'; counter.style.bottom = '10px'; counter.style.background = 'rgba(0,0,0,0.6)'; counter.style.color = 'white'; counter.style.padding = '4px 10px'; counter.style.borderRadius = '12px'; counter.style.fontSize = '12px';

            btnPrev.onclick = (e) => { e.stopPropagation(); currentImgIndex = (currentImgIndex - 1 + images.length) % images.length; imgEl.src = images[currentImgIndex]; counter.innerText = `${currentImgIndex + 1} / ${images.length}`; };
            btnNext.onclick = (e) => { e.stopPropagation(); currentImgIndex = (currentImgIndex + 1) % images.length; imgEl.src = images[currentImgIndex]; counter.innerText = `${currentImgIndex + 1} / ${images.length}`; };
            imageSection.appendChild(btnPrev); imageSection.appendChild(btnNext); imageSection.appendChild(counter);
        }
        modal.appendChild(imageSection);
    }

    const infoSection = document.createElement('div'); infoSection.style.padding = '24px';
    const dateStr = item.createdAt ? new Date(item.createdAt).toLocaleDateString('uk-UA') : '';
    infoSection.innerHTML = `
        <span style="background: ${item.isAd ? '#e0f2fe' : '#f1f5f9'}; color: ${item.isAd ? '#0369a1' : '#475569'}; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: bold; margin-bottom: 12px; display: inline-block;">${item.categoryLabel}</span>
        <h2 style="margin: 0 0 10px 0; font-size: 22px; color: #0f172a; line-height: 1.3;">${item.name || item.title}</h2>
        <div style="font-size: 28px; font-weight: 800; color: #2563eb; margin-bottom: 20px;">${item.price.toLocaleString()} грн.</div>
        <p style="color: #475569; line-height: 1.6; margin-bottom: 24px; font-size: 15px; white-space: pre-wrap;">${item.description || 'Опис відсутній. Це нове комплектуюче з офіційного каталогу магазину.'}</p>
        <div style="background: #f8fafc; padding: 16px; border-radius: 8px; border: 1px solid #e2e8f0; font-size: 14px; color: #0f172a;">
            <h4 style="margin: 0 0 10px 0; color: #475569; text-transform: uppercase; font-size: 12px; letter-spacing: 0.5px;">Характеристики та контакти</h4>
            <div style="display: flex; flex-direction: column; gap: 8px;">
                ${item.socket ? `<div><span style="color:#64748b; width:120px; display:inline-block;">Сокет:</span> <b>${item.socket}</b></div>` : ''}
                ${item.ramType ? `<div><span style="color:#64748b; width:120px; display:inline-block;">Тип пам'яті:</span> <b>${item.ramType}</b></div>` : ''}
                ${item.capacity ? `<div><span style="color:#64748b; width:120px; display:inline-block;">Об'єм:</span> <b>${item.capacity} GB</b></div>` : ''}
                ${item.isAd ? `<hr style="border: 0; height: 1px; background: #e2e8f0; margin: 8px 0;">` : ''}
                ${item.ownerUsername ? `<div><span style="color:#64748b; width:120px; display:inline-block;">👤 Продавець:</span> <b>${item.ownerUsername}</b></div>` : ''}
                ${item.contactInfo ? `<div><span style="color:#64748b; width:120px; display:inline-block;">📞 Зв'язок:</span> <b style="color:#2563eb;">${item.contactInfo}</b></div>` : ''}
                ${dateStr ? `<div><span style="color:#64748b; width:120px; display:inline-block;">🕒 Додано:</span> <b>${dateStr}</b></div>` : ''}
            </div>
        </div>
    `;
    modal.appendChild(infoSection); overlay.appendChild(modal); document.body.appendChild(overlay);
    requestAnimationFrame(() => { overlay.style.opacity = '1'; modal.style.transform = 'translateY(0)'; });
};

window.toggleAuth = () => { if (localStorage.getItem('userName')) { showLogoutModal(); } else { window.location.href = 'login.html'; } };

function showLogoutModal() {
    const overlay = document.createElement('div'); overlay.style.position = 'fixed'; overlay.style.top = '0'; overlay.style.left = '0'; overlay.style.width = '100%'; overlay.style.height = '100%'; overlay.style.backgroundColor = 'rgba(15, 23, 42, 0.6)'; overlay.style.backdropFilter = 'blur(4px)'; overlay.style.display = 'flex'; overlay.style.alignItems = 'center'; overlay.style.justifyContent = 'center'; overlay.style.zIndex = '9999'; overlay.style.opacity = '0'; overlay.style.transition = 'opacity 0.2s';
    const modal = document.createElement('div'); modal.style.background = 'white'; modal.style.padding = '30px'; modal.style.borderRadius = '16px'; modal.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1)'; modal.style.textAlign = 'center'; modal.style.maxWidth = '320px'; modal.style.width = '90%'; modal.style.transform = 'translateY(20px)'; modal.style.transition = 'transform 0.2s';
    modal.innerHTML = `<h3 style="margin: 0 0 10px 0; color: #0f172a; font-size: 20px;">Вихід з акаунту</h3><p style="margin: 0 0 24px 0; color: #64748b; font-size: 15px; line-height: 1.5;">Ви впевнені, що хочете вийти? Вам доведеться вводити пароль знову.</p>`;
    const btnContainer = document.createElement('div'); btnContainer.style.display = 'flex'; btnContainer.style.gap = '12px';
    const btnCancel = document.createElement('button'); btnCancel.innerText = 'Скасувати'; btnCancel.style.flex = '1'; btnCancel.style.padding = '10px 0'; btnCancel.style.background = '#f1f5f9'; btnCancel.style.color = '#475569'; btnCancel.style.border = 'none'; btnCancel.style.borderRadius = '8px'; btnCancel.style.fontWeight = '600'; btnCancel.style.cursor = 'pointer'; btnCancel.onclick = () => { overlay.style.opacity = '0'; modal.style.transform = 'translateY(20px)'; setTimeout(() => document.body.removeChild(overlay), 200); };
    const btnConfirm = document.createElement('button'); btnConfirm.innerText = 'Вийти'; btnConfirm.style.flex = '1'; btnConfirm.style.padding = '10px 0'; btnConfirm.style.background = '#ef4444'; btnConfirm.style.color = 'white'; btnConfirm.style.border = 'none'; btnConfirm.style.borderRadius = '8px'; btnConfirm.style.fontWeight = '600'; btnConfirm.style.cursor = 'pointer'; btnConfirm.onclick = () => { localStorage.removeItem('userName'); localStorage.removeItem('userRole'); localStorage.removeItem('authToken'); window.location.reload(); };
    btnContainer.appendChild(btnCancel); btnContainer.appendChild(btnConfirm); modal.appendChild(btnContainer); overlay.appendChild(modal); document.body.appendChild(overlay);
    requestAnimationFrame(() => { overlay.style.opacity = '1'; modal.style.transform = 'translateY(0)'; });
}

window.onload = () => { window.marketplaceApp = new MarketplaceApp(); };