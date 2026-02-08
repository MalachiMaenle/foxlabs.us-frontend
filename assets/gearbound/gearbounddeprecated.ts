document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        const targetId = anchor.getAttribute('href');
        if (!targetId) return;
        const targetElement = document.querySelector(targetId);

        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });
            history.pushState(null, null, targetId);
        }
    });
});

function toggleMenu() {
    const hamburger = document.querySelector<HTMLButtonElement>(".hamburger");
    const mobileMenu = document.getElementById("mobileMenu");

    if (!hamburger || !mobileMenu) {
        console.error("Nav element not found")
    } else {
        const toggleMenu = () => {
            hamburger.classList.toggle("active");
            mobileMenu.classList.toggle("active");
        }

        hamburger.addEventListener("click", toggleMenu);

        const mobileLinks = mobileMenu.querySelectorAll<HTMLAnchorElement>("a");

        mobileLinks.forEach(link => {
            link.addEventListener("click", toggleMenu);
        });
    }
}

function openTab(tabId: string) {
    const contents = document.querySelectorAll('.tab-content');
    contents.forEach(content => content.classList.remove('active'));

    const buttons = document.querySelectorAll('.tab-btn');
    buttons.forEach(btn => btn.classList.remove('active'));
    document.getElementById(tabId).classList.add('active');

    buttons.forEach(btn => {
        if (btn.getAttribute('onclick').includes(tabId)) {
            btn.classList.add('active');
        }
    });
}


// @LIST @GALLERY

// @JS @GALLERY
