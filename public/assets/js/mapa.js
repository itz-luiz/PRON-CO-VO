const map = L.map('map').setView([-19.9191, -43.9386], 13);

L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: '© <a href="https://www.mapbox.com/about/maps/">Mapbox</a> © <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'pk.eyJ1IjoiaXR6LWx1aXoiLCJhIjoiY21jN3h0a3VkMWJlZzJsb2J5a2xtcXdwciJ9.v_X6Kq_XlcCEvHQtOU9oDA'
}).addTo(map);

const categories = {
    'onibus': { name: 'Ponto de Ônibus', color: '#ff6347', icon: '🚌' },
    'metro': { name: 'Estação de Metrô', color: '#8A2BE2', icon: 'Ⓜ️' },
    'biblioteca': { name: 'Biblioteca', color: '#8e44ad', icon: '📚' },
    'escola': { name: 'Escola', color: '#3498db', icon: '🏫' },
    'hospital': { name: 'Hospital', color: '#e74c3c', icon: '🏥' },
    'upa': { name: 'UPA', color: '#f39c12', icon: '🚑' },
    'ubs': { name: 'UBS', color: '#2ecc71', icon: '🩺' },
    'posto-saude': { name: 'Posto de Saúde', color: '#27ae60', icon: '🏥' },
    'delegacia': { name: 'Delegacia', color: '#34495e', icon: '🚓' },
    'centro-cultural': { name: 'Centro Cultural', color: '#9b59b6', icon: '🎭' },
    'cras': { name: 'CRAS', color: '#e67e22', icon: '🤝' },
    'parque': { name: 'Parque', color: '#1abc9c', icon: '🌳' },
    'praca': { name: 'Praça', color: '#95a5a6', icon: '🪑' },
    'juventude': { name: 'Centro Juventude', color: '#16a085', icon: '🧑‍🎓' },
    'apoio-cidadao': { name: 'Apoio ao Cidadão', color: '#c0392b', icon: '📄' },
    'centro-comunitario': { name: 'Centro Comunitário', color: '#2980b9', icon: '🏘️' },
    'farmacia': { name: 'Farmácia', color: '#3498db', icon: '💊' },
    'restaurante': { name: 'Restaurante', color: '#e67e22', icon: '🍴' },
    'mecanica': { name: 'Mecânica', color: '#5D6D7E', icon: '🔧' },
    'lazer': { name: 'Lazer', color: '#8e44ad', icon: '🎢' },
    'shopping': { name: 'Shopping', color: '#d35400', icon: '🛍️' },
    'hotel': { name: 'Hotel', color: '#2980b9', icon: '🏨' }
    
};

const legend = L.control({ position: 'bottomright' });
legend.onAdd = function() {
    const div = L.DomUtil.create('div', 'legend');
    let legendHTML = '<h4>Legenda</h4>';
    for (const key in categories) {
        legendHTML += `<div><i style="background:${categories[key].color}">${categories[key].icon}</i>${categories[key].name}</div>`;
    }
    div.innerHTML = legendHTML;
    div.style.position = 'fixed';
    div.style.right = '10px';
    div.style.bottom = '30px';
    div.style.zIndex = '1000';
    return div;
};
legend.addTo(map);

function createCustomIcon(category) {
    const info = categories[category] || { color: '#3388ff', icon: '❓' };
    return L.divIcon({
        className: 'custom-icon',
        html: `<div style="background-color: ${info.color}; border-radius: 50%; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; color: white; font-size: 18px; font-weight: bold; box-shadow: 0 0 3px rgba(0,0,0,0.5);">${info.icon}</div>`,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
        popupAnchor: [0, -16]
    });
}

function createPopupContent(props) {
    return `<div class="info"><h3>${props.name}</h3><p>${props.description || ''}</p>${props.address ? `<p><b>Endereço:</b> ${props.address}</p>` : ''}${props.bairro ? `<p><b>Bairro:</b> ${props.bairro}</p>` : ''}</div>`;
}

function createTransportePopupContent(ponto) {
    return `
        <div class="info">
            <h3>${ponto.nome}</h3>
            <p><b>Tipo:</b> ${ponto.type === 'metro' ? 'Estação de Metrô' : 'Ponto de Ônibus'}</p>
            ${ponto.endereco ? `<p><b>Endereço:</b> ${ponto.endereco}</p>` : ''}
            <p><b>Bairro:</b> ${ponto.bairro}</p>
        </div>
    `;
}

let allMarkers = [];

async function loadEquipamentosData() {
    allMarkers.filter(m => m.options.type === 'equipamento').forEach(m => map.removeLayer(m));
    allMarkers = allMarkers.filter(m => m.options.type !== 'equipamento');

    try {
        const response = await fetch('http://pron-co-vo.onrender.com/equipamentosPublicos');
        const data = await response.json();
        data.forEach(item => {
            const props = item.properties;
            if (!props.latitude || !props.longitude) return;
            const marker = L.marker([props.latitude, props.longitude], {
                icon: createCustomIcon(props.category),
                category: props.category,
                type: 'equipamento'
            });
            marker.bindPopup(createPopupContent(props)).addTo(map);
            allMarkers.push(marker);
        });
    } catch (error) {
        console.error('Erro ao carregar equipamentos:', error);
    }
}

async function loadTransporteData() {
    allMarkers.filter(m => m.options.type === 'transporte').forEach(m => map.removeLayer(m));
    allMarkers = allMarkers.filter(m => m.options.type !== 'transporte');

    try {
        const response = await fetch('http://pron-co-vo.onrender.com/pontosDeTransporte');
        const data = await response.json();
        data.forEach(ponto => {
            if (!ponto.latitude || !ponto.longitude) return;
            const marker = L.marker([ponto.latitude, ponto.longitude], {
                icon: createCustomIcon(ponto.type),
                category: ponto.type,
                type: 'transporte'
            });
            marker.bindPopup(createTransportePopupContent(ponto)).addTo(map);
            allMarkers.push(marker);
        });
    } catch (error) {
        console.error('Erro ao carregar pontos de transporte:', error);
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.getElementById('menu-toggle');
    const sidebar = document.getElementById('sidebar');
    const closeSidebar = document.getElementById('closeSidebar');
    const body = document.body;
    const reloadMapBtn = document.getElementById('reloadMap');
    const filterToggle = document.getElementById('filterToggle');
    const categoryFilter = document.getElementById('categoryFilter');
    const crudModal = document.getElementById('crudModal');
    const openCrud = document.getElementById('openCrud');
    const closeCrud = document.getElementById('closeCrud');

    menuToggle.addEventListener('click', () => body.classList.toggle('sidebar-open'));
    closeSidebar.addEventListener('click', () => body.classList.remove('sidebar-open'));
    reloadMapBtn.addEventListener('click', e => { 
        e.preventDefault(); 
        loadEquipamentosData(); 
        loadTransporteData(); 
    });
    filterToggle.addEventListener('click', e => { e.preventDefault(); categoryFilter.style.display = categoryFilter.style.display === 'block' ? 'none' : 'block'; });

    openCrud.onclick = e => { e.preventDefault(); crudModal.style.display = 'block'; body.classList.remove('sidebar-open'); };
    closeCrud.onclick = () => crudModal.style.display = 'none';

    window.onclick = function(e) {
        if (e.target === crudModal) crudModal.style.display = 'none';
    };

    initCategoryFilters();
});

function initCategoryFilters() {
    const filtersContainer = document.getElementById('category-filters');
    filtersContainer.innerHTML = '';
    for (const key in categories) {
        const filter = document.createElement('div');
        filter.className = 'category-filter-item';
        filter.innerHTML = `<input type="checkbox" id="filter-${key}" checked data-category="${key}"><label for="filter-${key}"><span style="color:${categories[key].color}">${categories[key].icon}</span> ${categories[key].name}</label>`;
        filtersContainer.appendChild(filter);
        document.getElementById(`filter-${key}`).addEventListener('change', function() {
            const category = this.getAttribute('data-category');
            const isChecked = this.checked;
            allMarkers.forEach(marker => {
                if (marker.options.category === category) {
                    if (isChecked) map.addLayer(marker);
                    else map.removeLayer(marker);
                }
            });
        });
    }
}

const form = document.getElementById('crudForm');
const list = document.getElementById('equipamentosList');
const categorySelect = document.getElementById('category');

for (const key in categories) {
    if (key !== 'onibus' && key !== 'metro') {
        const option = document.createElement('option');
        option.value = key;
        option.textContent = categories[key].name;
        categorySelect.appendChild(option);
    }
}

async function fetchEquipamentos() {
    const res = await fetch('http://pron-co-vo.onrender.com/equipamentosPublicos');
    const data = await res.json();
    renderEquipamentos(data);
}

function renderEquipamentos(data) {
    list.innerHTML = '';
    data.forEach(e => {
        const li = document.createElement('li');
        li.innerHTML = `
            ${e.properties.name} (${e.properties.category})
            <div>
                <button onclick="editEquip('${e.id}')">Editar</button>
                <button onclick="deleteEquip('${e.id}')">Excluir</button>
            </div>
        `;
        list.appendChild(li);
    });
}

form.onsubmit = async function(e) {
    e.preventDefault();
    const id = document.getElementById('editId').value;
    const body = {
        properties: {
            name: document.getElementById('name').value,
            description: document.getElementById('description').value,
            address: document.getElementById('address').value,
            bairro: document.getElementById('bairro').value,
            latitude: parseFloat(document.getElementById('latitude').value),
            longitude: parseFloat(document.getElementById('longitude').value),
            category: document.getElementById('category').value
        }
    };
    const url = id ? `http://pron-co-vo.onrender.com/equipamentosPublicos/${id}` : 'http://pron-co-vo.onrender.com/equipamentosPublicos';
    const method = id ? 'PUT' : 'POST';

    await fetch(url, { method, headers: {'Content-Type': 'application/json'}, body: JSON.stringify(body) });
    form.reset();
    document.getElementById('editId').value = '';
    crudModal.style.display = 'none';
    fetchEquipamentos();
    loadEquipamentosData();
};

window.editEquip = async function(id) {
    const res = await fetch(`http://pron-co-vo.onrender.com/equipamentosPublicos/${id}`);
    const data = await res.json();
    document.getElementById('editId').value = id;
    document.getElementById('name').value = data.properties.name;
    document.getElementById('description').value = data.properties.description || '';
    document.getElementById('address').value = data.properties.address || '';
    document.getElementById('bairro').value = data.properties.bairro || '';
    document.getElementById('latitude').value = data.properties.latitude;
    document.getElementById('longitude').value = data.properties.longitude;
    document.getElementById('category').value = data.properties.category;
    crudModal.style.display = 'block';
};

window.deleteEquip = async function(id) {
    if (confirm('Tem certeza que deseja excluir este equipamento?')) {
        await fetch(`http://pron-co-vo.onrender.com/equipamentosPublicos/${id}`, { method: 'DELETE' });
        fetchEquipamentos();
        loadEquipamentosData();
    }
};

fetchEquipamentos();
loadEquipamentosData();
loadTransporteData();