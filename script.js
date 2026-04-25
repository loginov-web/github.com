
 const burger = document.getElementById('burger');
        const navLinks = document.getElementById('nav-links');




        const themeIcons = document.querySelectorAll('.theme-icon');
        const themeButtons = document.querySelectorAll('.theme-toggle');

        const setTheme = (isDark) => {
            if (isDark) {
                document.body.setAttribute('data-theme', 'dark');
                localStorage.setItem('theme', 'dark');
                themeIcons.forEach(icon => icon.textContent = '🌙');
            } else {
                document.body.removeAttribute('data-theme');
                localStorage.setItem('theme', 'light');
                themeIcons.forEach(icon => icon.textContent = '☀️');
            }
        };

       
        const savedTheme = localStorage.getItem('theme');
        setTheme(savedTheme !== 'light');

        const toggleTheme = () => {
            const isCurrentlyDark = document.body.hasAttribute('data-theme');
            setTheme(!isCurrentlyDark);
        };

      
        themeButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                toggleTheme();
            });
        });




        // 3. Управление меню 
        const toggleMenu = (state) => {
            const isActive = typeof state === 'boolean' ? state : !navLinks.classList.contains('active');
            navLinks.classList.toggle('active', isActive);
            burger.classList.toggle('active', isActive);
        };

        burger.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleMenu();
        });

        // 4. Закрытие при клике вне меню
        document.addEventListener('click', ({ target }) => {
            if (!navLinks.contains(target) && !burger.contains(target)) {
                toggleMenu(false);
            }
        });

     
        navLinks.addEventListener('click', (e) => {
            if (e.target.tagName === 'A') {
                toggleMenu(false);
            }
        });



        // МОДАЛЬНЫЕ ОКНА И СЛАЙДЕР


        // 1. ИНИЦИАЛИЗАЦИЯ 
        const modalSimple = document.getElementById("photoModal");
        const modalSlider = document.getElementById("modalSlide");
        const track = document.getElementById('sliderTrack');
        const slides = [...document.querySelectorAll('.slide')]; // Превращаем в массив для удобства
        const mImg = document.getElementById('mImg');
        const modalImg = document.getElementById("modalImg");

        let currentIndex = 0;

        // 2. УПРАВЛЕНИЕ СОСТОЯНИЕМ 
        const toggleScroll = (disable) => {
            document.body.style.overflow = disable ? "hidden" : "auto";
        };

        const closeModal = () => {
            modalSimple?.style.setProperty('display', 'none');
            modalSlider?.classList.remove('active');
            toggleScroll(false);
        };

        // 3. ЛОГИКА ОДИНОЧНОГО ФОТО 
        const openModal = (src) => {
            if (!modalSimple || !modalImg) return;
            modalSimple.style.display = "flex";
            modalImg.src = src;
            toggleScroll(true);
        };

        // 4. ЛОГИКА СЛАЙДЕРА 
        const updateGallery = () => {
            if (!slides.length) return;

            const isMobile = window.innerWidth <= 768;
            const total = slides.length;

            slides.forEach((slide, i) => {
                let offset = i - currentIndex;

              
                if (offset > total / 2) offset -= total;
                if (offset < -total / 2) offset += total;

                const absOffset = Math.abs(offset);
                const { style } = slide; 

                if (isMobile) {
                    style.transform = `translateX(${offset * 105}%) scale(${absOffset === 0 ? 1 : 0.8})`;
                    style.opacity = absOffset === 0 ? "1" : "0.4";
                    style.filter = "none";
                } else {
                    const x = offset * 420;
                    const z = absOffset * -400;
                    const rot = offset * -35;
                    style.transform = `translateX(${x}px) translateZ(${z}px) rotateY(${rot}deg)`;
                    style.opacity = absOffset > 2 ? "0" : "1";
                    style.filter = `blur(${absOffset * 4}px)`;
                }

                style.zIndex = 100 - absOffset;
                style.pointerEvents = offset === 0 ? "auto" : "none";
            });
        };

        // Навигация 
        const moveSlide = (dir) => {
            currentIndex = (currentIndex + dir + slides.length) % slides.length;
            updateGallery();
        };

        window.modalNav = (dir) => {
            moveSlide(dir);
            if (mImg) mImg.src = slides[currentIndex].querySelector('img').src;
        };

        // Открытие слайдера 
        slides.forEach((slide, i) => {
            slide.addEventListener('click', () => {
                currentIndex = i;
                updateGallery();
                if (mImg) mImg.src = slide.querySelector('img').src;
                modalSlider?.classList.add('active');
                toggleScroll(true);
            });
        });

        // 5. ОБРАБОТКА КЛИКОВ 
        window.addEventListener('click', ({ target }) => {
            if (target === modalSimple || target === modalSlider) {
                closeModal();
            }
        });

        document.querySelectorAll('.close-modal, .closeModal').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                closeModal();
            });
        });

        // 6. КЛАВИАТУРА И ТАЧ-СОБЫТИЯ
        window.addEventListener('keydown', ({ key }) => {
            if (key === "Escape") closeModal();

            const isSliderActive = modalSlider?.classList.contains('active');
            if (key === "ArrowRight") isSliderActive ? window.modalNav(1) : moveSlide(1);
            if (key === "ArrowLeft") isSliderActive ? window.modalNav(-1) : moveSlide(-1);
        });

      
        let touchStartX = 0;
        const handleTouch = (e, callback) => {
            if (e.type === 'touchstart') {
                touchStartX = e.changedTouches[0].screenX;
            } else {
                const diff = touchStartX - e.changedTouches[0].screenX;
                if (Math.abs(diff) > 50) callback(diff > 0 ? 1 : -1);
            }
        };

        [track, modalSlider].forEach(el => {
            if (!el) return;
            el.addEventListener('touchstart', (e) => handleTouch(e), { passive: true });
            el.addEventListener('touchend', (e) => handleTouch(e, el === track ? moveSlide : window.modalNav));
        });

        window.addEventListener('resize', updateGallery);
        updateGallery();



        // 1. ЗАРПЛАТНЫЕ ОЖИДАНИЯ 
        const oSlider = document.getElementById('offer-slider');
        const oImg = document.getElementById('offer-img');
        const oVal = document.getElementById('res-val');
        const oTicks = document.querySelectorAll('.offer-ticks span');

        const oData = [
            { label: "No offer", img: "img/нет_офера.webp" },
            { label: "80 т.р.", img: "img/80.webp" },
            { label: "100 т.р.", img: "img/100.webp" },
            { label: "120 т.р.", img: "img/120.webp" },
            { label: "140 т.р.", img: "img/140.webp" }
        ];

        const updateOffer = () => {
            if (!oSlider) return;

            
            if (window.innerWidth <= 768) oSlider.value = 2;

            const i = oSlider.value;
            const { label, img } = oData[i]; 

            if (oVal) oVal.textContent = label;
            if (oImg) oImg.src = img;

            oTicks.forEach((t, idx) => t.classList.toggle('active', idx == i));
        };

      
        window.setOffer = (idx) => {
            if (oSlider) {
                oSlider.value = idx;
                updateOffer();
            }
        };

        if (oSlider) {
            oSlider.addEventListener('input', updateOffer);
            window.addEventListener('resize', updateOffer);
            updateOffer();
        }


        // 2. ПРОГРЕССБАР 

        const moveProgressBar = () => {
            const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
            const winScroll = window.pageYOffset || scrollTop;
            const height = scrollHeight - clientHeight;
            const scrolled = (winScroll / height) * 100;

            const bar = document.getElementById("myBar");
            if (bar) bar.style.width = `${scrolled}%`; 
        };

        window.addEventListener('scroll', moveProgressBar);


        // 3. КНОПКА "НАВЕРХ" (Back to Top)

        const btnTop = document.getElementById('backToTop');
        const footer = document.querySelector('.footer');
        let scrollTimeout;

        window.addEventListener('scroll', () => {
            if (!btnTop) return;

            const { scrollY, innerHeight, innerWidth } = window;

            if (scrollY > 400) {
                btnTop.classList.add('active');

               
                clearTimeout(scrollTimeout);
                scrollTimeout = setTimeout(() => btnTop.classList.remove('active'), 3000);
            } else {
                btnTop.classList.remove('active');
            }

            // Умный отступ от футера
            if (footer) {
                const { top } = footer.getBoundingClientRect();
                if (top < innerHeight) {
                    btnTop.style.bottom = `${innerHeight - top + 20}px`;
                } else {
                    btnTop.style.bottom = innerWidth < 768 ? '20px' : '25px';
                }
            }
        });

        btnTop?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));


        //  4. ТЕСТ НА ВОЗРАСТ (Dog Age)

        const dogElements = {
            modal: document.getElementById("modalDogAge"),
            trigger: document.querySelector(".modal-dog-trigger"),
            close: document.querySelector(".modal-dog-close"),
            calcBtn: document.getElementById("modalDogCalcBtn"),
            resetBtn: document.getElementById("modalDogResetBtn"),
            input: document.getElementById("modalDogInput"),
            resultArea: document.getElementById("modalDogResultArea"),
            form: document.getElementById("modalDogForm")
        };

        const getYearWord = (age) => {
            const [last, lastTwo] = [age % 10, age % 100]; 
            if (lastTwo >= 11 && lastTwo <= 14) return "лет";
            if (last === 1) return "год";
            return (last >= 2 && last <= 4) ? "года" : "лет";
        };

        const closeDogModal = () => {
            const { modal, resultArea, form, input } = dogElements;
            if (modal) modal.style.display = "none";
            document.body.style.overflow = "auto";
            if (resultArea) resultArea.style.display = "none";
            if (form) form.style.display = "block";
            if (input) input.value = "";
        };

        dogElements.trigger?.addEventListener('click', () => {
            dogElements.modal.style.display = "flex";
            document.body.style.overflow = "hidden";
            setTimeout(() => dogElements.input?.focus(), 100);
        });

        dogElements.close?.addEventListener('click', closeDogModal);

        window.addEventListener('click', ({ target }) => {
            if (target === dogElements.modal) closeDogModal();
        });

        dogElements.calcBtn?.addEventListener('click', () => {
            const age = parseInt(dogElements.input.value);
            const resultText = document.getElementById("modalDogResultText");
            const dogImg = document.getElementById("modalDogImg");

            if (age > 0 && age < 120) {
                const dogYears = age * 7;
                resultText.innerHTML = `В собачьем мире тебе бы исполнилось <br><b>${dogYears} ${getYearWord(dogYears)}!</b>`;
                if (dogImg) dogImg.src = `a_narisui_774_etu_sobaku_z.png`;

                dogElements.form.style.display = "none";
                dogElements.resultArea.style.display = "block";
            } else {
                alert("Пожалуйста, введите реальный возраст");
            }
        });

        dogElements.input?.addEventListener("keypress", (e) => {
            if (e.key === "Enter") {
                e.preventDefault();
                dogElements.calcBtn.click();
            }
        });

        dogElements.resetBtn?.addEventListener('click', () => {
            dogElements.input.value = "";
            dogElements.resultArea.style.display = "none";
            dogElements.form.style.display = "block";
            dogElements.input.focus();
        });


        // 5. КОПИРОВАНИЕ ПОЧТЫ

        window.copyText = async () => {
            const email = document.getElementById('email')?.innerText;
            const tooltip = document.getElementById("myTooltip");

            if (!email) return;

            try {
                await navigator.clipboard.writeText(email);
                if (tooltip) {
                    tooltip.innerHTML = "Скопировано!";
                    setTimeout(() => tooltip.innerHTML = "Копировать", 2000);
                }
            } catch (err) {
                console.error("Ошибка копирования:", err);
            }
        };
