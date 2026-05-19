const API_BASE_URL = '/api';

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

function escapeHtml(value) {
    return String(value ?? '')
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#039;');
}

class MarketplaceApp {
    constructor() {
        this.currentCategory = 'all';
        this.editImages = [];
        this.detailsImages = [];
        this.detailsImageIndex = 0;
        this.init();
    }

    async init() {
        this.checkAuth();
        this.setupEventListeners();
        await this.updatePriceLimits();
        await this.loadGrid();
    }

    setupEventListeners() {
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.currentCategory = e.target.dataset.type;
                document.getElementById('minPrice').value = '';
                document.getElementById('maxPrice').value = '';
                await this.updatePriceLimits();
                await this.loadGrid();
            });
        });

        const applyBtn = document.getElementById('applyBtn');
        if (applyBtn) applyBtn.addEventListener('click', () => this.loadGrid());
    }

    buildMarketQuery(includePrices = true) {
        const params = new URLSearchParams();
        params.set('category', this.currentCategory);

        if (includePrices) {
            const minValue = document.getElementById('minPrice')?.value;
            const maxValue = document.getElementById('maxPrice')?.value;
            if (minValue) params.set('minPrice', minValue);
            if (maxValue) params.set('maxPrice', maxValue);
        }

        const userName = localStorage.getItem('userName');
        const userRole = localStorage.getItem('userRole');
        if (userName) params.set('userName', userName);
        if (userRole) params.set('userRole', userRole);

        return params;
    }

    async updatePriceLimits() {
        const minInput = document.getElementById('minPrice');
        const maxInput = document.getElementById('maxPrice');
        if (!minInput || !maxInput) return;

        const params = new URLSearchParams();
        params.set('category', this.currentCategory);

        try {
            const response = await fetch(`/market/price-limits?${params.toString()}`, { cache: 'no-cache' });
            const limits = await response.json();
            minInput.placeholder = limits.min ?? 0;
            maxInput.placeholder = limits.max ?? 0;
        } catch {
            minInput.placeholder = '0';
            maxInput.placeholder = '0';
        }
    }

    async loadGrid() {
        const grid = document.getElementById('marketGrid');
        if (!grid) return;

        try {
            const response = await fetch(`/market/grid?${this.buildMarketQuery().toString()}`, { cache: 'no-cache' });
            if (!response.ok) throw new Error('grid');
            grid.innerHTML = await response.text();
        } catch {
            grid.innerHTML = "<p style='color: #ef4444; text-align: center; grid-column: 1 / -1; margin-top: 40px;'>Помилка зв'язку з сервером.</p>";
        }
    }

    async openDetails(key) {
        const params = this.buildMarketQuery(false);
        params.set('key', key);

        try {
            const response = await fetch(`/market/details?${params.toString()}`, { cache: 'no-cache' });
            if (!response.ok) throw new Error('details');

            const overlay = document.createElement('div');
            overlay.id = 'detailsOverlay';
            overlay.style.position = 'fixed'; overlay.style.top = '0'; overlay.style.left = '0'; overlay.style.width = '100%'; overlay.style.height = '100%';
            overlay.style.backgroundColor = 'rgba(15, 23, 42, 0.7)'; overlay.style.backdropFilter = 'blur(4px)';
            overlay.style.display = 'flex'; overlay.style.alignItems = 'center'; overlay.style.justifyContent = 'center';
            overlay.style.zIndex = '10000'; overlay.style.opacity = '0'; overlay.style.transition = 'opacity 0.2s';
            overlay.onclick = (e) => { if (e.target === overlay) this.closeDetails(); };
            overlay.innerHTML = await response.text();

            document.body.appendChild(overlay);
            requestAnimationFrame(() => { overlay.style.opacity = '1'; });
            this.prepareDetailsGallery();
        } catch {
            showToast('Не вдалося відкрити деталі товару.', 'error');
        }
    }

    prepareDetailsGallery() {
        const gallery = document.getElementById('detailsGallery');
        if (!gallery) {
            this.detailsImages = [];
            return;
        }

        try {
            this.detailsImages = JSON.parse(gallery.dataset.images || '[]');
        } catch {
            this.detailsImages = [];
        }

        this.detailsImageIndex = 0;
        this.refreshDetailsImage();
    }

    prevDetailImage(event) {
        event?.stopPropagation();
        if (this.detailsImages.length <= 1) return;
        this.detailsImageIndex = (this.detailsImageIndex - 1 + this.detailsImages.length) % this.detailsImages.length;
        this.refreshDetailsImage();
    }

    nextDetailImage(event) {
        event?.stopPropagation();
        if (this.detailsImages.length <= 1) return;
        this.detailsImageIndex = (this.detailsImageIndex + 1) % this.detailsImages.length;
        this.refreshDetailsImage();
    }

    refreshDetailsImage() {
        const image = document.getElementById('detailsImage');
        const counter = document.getElementById('detailsCounter');
        if (image && this.detailsImages.length > 0) image.src = this.detailsImages[this.detailsImageIndex];
        if (counter) counter.innerText = `${this.detailsImageIndex + 1} / ${this.detailsImages.length}`;
    }

    closeDetails() {
        const overlay = document.getElementById('detailsOverlay');
        if (overlay) document.body.removeChild(overlay);
    }

    async openEdit(id) {
        try {
            const response = await fetch(`${API_BASE_URL}/ads/${id}`, { cache: 'no-cache' });
            const result = await response.json();
            if (!result.success) throw new Error(result.message);

            const ad = result.data;
            this.editImages = ad.images || [];
            this.showEditModal(ad);
        } catch {
            showToast('Не вдалося відкрити редагування.', 'error');
        }
    }

    showEditModal(ad) {
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
            <input type="text" id="editTitle" value="${escapeHtml(ad.title)}" placeholder="Назва" style="width:100%; padding:10px; margin-bottom:12px; border:1px solid #cbd5e1; border-radius:8px; outline:none;">
            <textarea id="editDesc" rows="3" placeholder="Опис" style="width:100%; padding:10px; margin-bottom:12px; border:1px solid #cbd5e1; border-radius:8px; outline:none; resize:none;">${escapeHtml(ad.description)}</textarea>
            <input type="number" id="editPrice" value="${ad.price}" placeholder="Ціна" style="width:100%; padding:10px; margin-bottom:12px; border:1px solid #cbd5e1; border-radius:8px; outline:none;">
            <input type="text" id="editContact" value="${escapeHtml(ad.contactInfo)}" placeholder="Контакти" style="width:100%; padding:10px; margin-bottom:12px; border:1px solid #cbd5e1; border-radius:8px; outline:none;">
            <select id="editCategory" style="width:100%; padding:10px; margin-bottom:12px; border:1px solid #cbd5e1; border-radius:8px; outline:none;">
                ${this.categoryOptions(ad.category)}
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
        btnSave.onclick = async () => this.saveEdit(ad.id, overlay, modal);

        btnContainer.appendChild(btnCancel); btnContainer.appendChild(btnSave); modal.appendChild(btnContainer); overlay.appendChild(modal); document.body.appendChild(overlay);
        requestAnimationFrame(() => { overlay.style.opacity = '1'; modal.style.transform = 'translateY(0)'; });

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

    categoryOptions(selected) {
        const options = [
            ['cpu', 'Процесор'], ['mb', 'Мат. плата'], ['ram', 'ОЗУ'], ['gpu', 'Відеокарта'],
            ['psu', 'Блок живлення'], ['ssd', 'SSD'], ['case', 'Корпус'], ['cooler', 'Охолодження'], ['headset', 'Гарнітура']
        ];

        return options.map(([value, text]) =>
            `<option value="${value}" ${selected === value ? 'selected' : ''}>${text}</option>`
        ).join('');
    }

    async saveEdit(id, overlay, modal) {
        if (this.editImages.length === 0) return showToast('Оголошення повинно мати хоча б одне фото!', 'error');

        const token = localStorage.getItem('authToken');
        const updatedData = {
            title: document.getElementById('editTitle').value,
            description: document.getElementById('editDesc').value,
            price: parseFloat(document.getElementById('editPrice').value),
            contactInfo: document.getElementById('editContact').value,
            category: document.getElementById('editCategory').value,
            images: this.editImages
        };

        try {
            const response = await fetch(`${API_BASE_URL}/ads/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify(updatedData)
            });

            if (response.ok) {
                showToast('Оголошення оновлено!', 'success');
                overlay.style.opacity = '0'; modal.style.transform = 'translateY(20px)';
                setTimeout(() => document.body.removeChild(overlay), 200);
                await this.loadGrid();
            } else if (response.status === 403) {
                showToast('У вас немає прав на редагування!', 'error');
            } else {
                showToast('Помилка оновлення.', 'error');
            }
        } catch {
            showToast('Помилка з\'єднання з сервером.', 'error');
        }
    }

    async deleteAd(id) {
        showConfirmModal('Видалення оголошення', 'Ви впевнені, що хочете видалити це оголошення?', async () => {
            const token = localStorage.getItem('authToken');
            try {
                const response = await fetch(`${API_BASE_URL}/ads/${id}`, {
                    method: 'DELETE',
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (response.ok) {
                    showToast('Оголошення успішно видалено', 'success');
                    await this.loadGrid();
                } else if (response.status === 403) {
                    showToast('У вас немає прав на видалення!', 'error');
                } else {
                    showToast('Помилка видалення.', 'error');
                }
            } catch {
                showToast('Помилка з\'єднання.', 'error');
            }
        });
    }

    fileToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    }

    renderEditImages() {
        const container = document.getElementById('editImagePreviews');
        if (!container) return;

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

window.toggleAuth = () => {
    if (localStorage.getItem('userName')) {
        showLogoutModal();
    } else {
        window.location.href = '/login.html';
    }
};

window.addEventListener('load', () => {
    window.marketplaceApp = new MarketplaceApp();
});
