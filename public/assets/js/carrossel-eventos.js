document.addEventListener('DOMContentLoaded', function() {
    const carousel = document.getElementById('carousel');
    const indicatorsContainer = document.getElementById('indicators');
    const prevBtn = document.querySelector('.prev');
    const nextBtn = document.querySelector('.next');
    const slideActions = document.getElementById('slideActions');
    const updateBtn = document.querySelector('.update-btn');
    const deleteBtn = document.querySelector('.delete-btn');

    let currentIndex = 0;
    let slides = [];

    // Fetch slides from json-server
    function fetchSlides() {
        fetch('http://pron-co-vo.onrender.com/eventos')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erro na requisição');
                }
                return response.json();
            })
            .then(data => {
                slides = data;
                if (slides.length === 0) {
                    showNoEventsMessage();
                } else {
                    initializeCarousel();
                }
            })
            .catch(error => {
                console.error('Erro ao carregar eventos:', error);
                showErrorMessage(error.message);
            });
    }

    function showNoEventsMessage() {
        carousel.innerHTML = `
            <div class="carousel-item active">
                <div class="error-message">
                    <p>Nenhum evento encontrado</p>
                </div>
            </div>
        `;
        indicatorsContainer.innerHTML = '';
        slideActions.style.display = 'none';
    }

    function showErrorMessage(message) {
        carousel.innerHTML = `
            <div class="carousel-item active">
                <div class="error-message">
                    <p>Não foi possível carregar os eventos</p>
                    <p>${message}</p>
                </div>
            </div>
        `;
        indicatorsContainer.innerHTML = '';
        slideActions.style.display = 'none';
    }

    function initializeCarousel() {
        // Clear existing content
        carousel.innerHTML = '';
        indicatorsContainer.innerHTML = '';

        // Create slides
        slides.forEach((slide, index) => {
            const slideElement = document.createElement('div');
            slideElement.className = `carousel-item ${index === 0 ? 'active' : ''}`;
            slideElement.dataset.id = slide.id;
            slideElement.innerHTML = `
                <a href="#"><img src="${slide.image || 'https://via.placeholder.com/800x400?text=Evento'}" 
                     alt="${slide.title || 'Evento'}"></a>
                <a href="#"><div class="carousel-content">
                    <h3 class="carousel-title">${slide.title || 'Evento'}</h3>
                    <p class="carousel-subtitle">${slide.subtitle || 'Descrição do evento'}</p>
                    <p class="carousel-date">${slide.date || 'Data a confirmar'}</p>
                </div></a>
            `;
            carousel.appendChild(slideElement);

            // Create indicator
            const indicator = document.createElement('div');
            indicator.className = `carousel-indicator ${index === 0 ? 'active' : ''}`;
            indicator.addEventListener('click', () => goToSlide(index));
            indicatorsContainer.appendChild(indicator);
        });

        if (slides.length > 0) {
            slideActions.style.display = 'flex';
        } else {
            slideActions.style.display = 'none';
        }
    }

    function updateCarousel() {
        const items = document.querySelectorAll('.carousel-item');
        const indicators = document.querySelectorAll('.carousel-indicator');

        items.forEach((item, index) => {
            item.classList.toggle('active', index === currentIndex);
        });

        indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === currentIndex);
        });
    }

    function goToSlide(index) {
        if (slides.length === 0) return;
        
        // Handle wrap-around
        if (index >= slides.length) {
            currentIndex = 0;
        } else if (index < 0) {
            currentIndex = slides.length - 1;
        } else {
            currentIndex = index;
        }
        
        updateCarousel();
    }

    function nextSlide() {
        goToSlide(currentIndex + 1);
    }

    function prevSlide() {
        goToSlide(currentIndex - 1);
    }

    function deleteCurrentSlide() {
        if (slides.length === 0) return;
        
        const currentSlideId = slides[currentIndex].id;

        if (confirm('Tem certeza que deseja excluir este evento?')) {
            fetch(`http://pron-co-vo.onrender.com/eventos/${currentSlideId}`, {
                method: 'DELETE'
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erro ao excluir evento');
                }
                fetchSlides(); // Recarrega os slides após exclusão
            })
            .catch(error => {
                console.error('Erro:', error);
                alert('Ocorreu um erro ao excluir o evento');
            });
        }
    }

    function editCurrentSlide() {
        if (slides.length === 0) return;
        
        const currentSlide = slides[currentIndex];
        // Aqui você pode implementar a lógica para abrir um modal de edição
        // ou redirecionar para uma página de edição
        alert(`Editando: ${currentSlide.title}\nImplemente um formulário de edição aqui.`);
    }

    // Event listeners
    nextBtn.addEventListener('click', nextSlide);
    prevBtn.addEventListener('click', prevSlide);
    updateBtn.addEventListener('click', editCurrentSlide);
    deleteBtn.addEventListener('click', deleteCurrentSlide);

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight') {
            nextSlide();
        } else if (e.key === 'ArrowLeft') {
            prevSlide();
        }
    });

    // Initialize the carousel
    fetchSlides();
});