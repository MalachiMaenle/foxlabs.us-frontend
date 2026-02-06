import {Component} from '@angular/core';

@Component({
    selector: 'app-gearbound',
    imports: [],
    templateUrl: './gearbound.html',
    styleUrl: './gearbound.css',
})
export class Gearbound {

}

function toggleMenu() {
    const mobileMenu = document.getElementById('mobileMenu');
    const hamburger = document.querySelector('.hamburger');

    if (mobileMenu && hamburger) {
        mobileMenu.classList.toggle('active');
        hamburger.classList.toggle('active');
    } else {
        console.log("wtf");
    }

}

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        const targetId = this.getAttribute('href');
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

function copyIP() {
    navigator.clipboard.writeText('play.gearbound.com');
    const btn = document.querySelector('.copy-btn');
    const originalText = btn.innerText;
    btn.innerText = 'COPIED!';
    btn.style.borderColor = "#30b27b";
    btn.style.color = "#30b27b";
    btn.style.background = "#0e0e0e";

    setTimeout(() => {
        btn.innerText = originalText;
        btn.style.borderColor = "";
        btn.style.color = "";
    }, 2000);
}

const serverIp = "gearbound.exphost.net";

fetch(`https://api.mcsrvstat.us/3/${serverIp}`)
    .then(response => response.json())
    .then(data => {
        const statusDiv = document.getElementById("server-status");
        const playerContainer = document.getElementById("player-container");

        if (data.online) {
            let latencyHtml = "";
            if (typeof data.debug.ping === 'number') {
                latencyHtml = `<p class="info-text">Ping: ${data.debug.ping}ms</p>`;
            }

            statusDiv.innerHTML = `
                        <div class="status-line online"><span>●</span> Online</div>
                        ${latencyHtml}
                        <p class="info-text">Players: <strong>${data.players.online}</strong> / ${data.players.max}</p>
                        <p class="info-text">Version: ${data.protocol.name || data.version}</p>
                    `;

            // Handle Player Heads
            if (data.players.list && data.players.list.length > 0) {
                let playersHtml = '<div class="player-list">';

                data.players.list.forEach(player => {
                    const avatarUrl = `https://mc-heads.net/avatar/${player.name}/48`;

                    playersHtml += `
                                <div class="player-item">
                                    <img src="${avatarUrl}" class="player-head" alt="${player.name}" onerror="this.src='https://mc-heads.net/avatar/MHF_Steve/48'">
                                    <span class="player-name" title="${player.name}">${player.name}</span>
                                </div>
                            `;
                });

                playersHtml += '</div>';
                playerContainer.innerHTML = '<div class="player-list-header">Who is online</div>' + playersHtml;
            } else {
                playerContainer.innerHTML = '<p class="info-text" style="margin-top:15px; font-style:italic;">No engineers on site.</p>';
            }

        } else {
            // Server is Offline
            statusDiv.innerHTML = '<div class="status-line offline">❌ Offline</div>';
            playerContainer.innerHTML = '';
        }
    })
    .catch(error => {
        console.error("Error fetching status:", error);
        document.getElementById("server-status").innerHTML = '<span style="color:#f16436">Failed to load satellite data.</span>';
    });

// @JS @GEARS @BACKGROUND
const gearLeft = document.getElementById('gearLeft');
const gearRight = document.getElementById('gearRight');

const baseSpeed = 0.05;
const scrollEffect = 0.2;
const parallaxSpeed = 0.35;

let totalScrollRotation = 0;
let lastScrollY = window.pageYOffset;

function animateGears() {
    const currentScrollY = window.pageYOffset;
    const time = Date.now();

    const deltaY = currentScrollY - lastScrollY;

    totalScrollRotation += Math.abs(deltaY) * scrollEffect;
    lastScrollY = currentScrollY;

    const rotationL = (time * baseSpeed) + totalScrollRotation;
    const rotationR = -rotationL

    const moveY = -currentScrollY * parallaxSpeed;

    if (gearLeft) gearLeft.style.transform = `translateY(${moveY}px) rotate(${rotationL}deg)`;
    if (gearRight) gearRight.style.transform = `translateY(${moveY}px) rotate(${rotationR}deg)`;

    requestAnimationFrame(animateGears);
}

animateGears();

// @LIST @TEAMS
const teamsData = [
    {
        name: "FoxyTown",
        color: "#E38839", // Brass
        members: ["port0001", "XicefireboyX", "Gamingfoxy81", "didamorte", "xPkz_", "TomReh", "Krumist_", "Warri0rDan"]
    },
    {
        name: "Anchor",
        color: "#bf70bc", // Modrinth Green
        members: ["PreChecked", "AsealGuy", "D505"]
    }
];

// @JS @TEAMS
function renderTeams() {
    const container = document.getElementById('teams-grid');
    let html = '';

    teamsData.forEach(team => {
        let membersHtml = '<div class="player-list">';
        team.members.forEach(member => {
            const avatarUrl = `https://mc-heads.net/avatar/${member}/48`;
            membersHtml += `
                        <div class="player-item">
                            <img src="${avatarUrl}" class="player-head" alt="${member}" onerror="this.src='https://mc-heads.net/avatar/MHF_Steve/48'">
                            <span class="player-name" title="${member}">${member}</span>
                        </div>
                    `;
        });
        membersHtml += '</div>';

        html += `
                    <div class="team-card" style="border-color: ${team.color}40;">
                        <h3 class="team-name" style="color: ${team.color}; border-color: ${team.color}66;">${team.name}</h3>
                        ${membersHtml}
                    </div>
                `;
    });

    container.innerHTML = html;
}

renderTeams();

// @LIST @GALLERY
const galleryImages = [
    {
        src: "https://via.placeholder.com/1200x800/2d2d2d/eebb66?text=Central+Station",
        title: "Central Station",
        desc: "The heart of the railway network."
    },
    {
        src: "https://via.placeholder.com/1200x800/3d2d2d/ea936b?text=Nether+Fortress+Base",
        title: "Nether Hub",
        desc: "Dangerous industrial complex."
    },
    {
        src: "https://via.placeholder.com/1200x800/2d3d2d/4dd39e?text=Bio-Dome",
        title: "The Bio-Dome",
        desc: "Preserving nature in glass."
    },
    {
        src: "https://via.placeholder.com/1200x800/2d2d3d/84abe7?text=Sky+Factory",
        title: "Sky Factory",
        desc: "High altitude assembly lines."
    },
    {
        src: "https://via.placeholder.com/1200x800/403030/eebb66?text=Steam+Engine",
        title: "Steam Power Plant",
        desc: "Providing SU for the masses."
    }
];

// @JS @GALLERY
let galleryInterval;
let isGalleryPaused = false;
let isGalleryExpanded = false;
let scrollVelocity = 0;
let isHoveringGallery = false;
let autoScrollTimeout;
const AUTO_RESUME_DELAY = 4000; // 4 seconds

function renderGallery() {
    const container = document.getElementById('gallery-track');

    const renderSet = (list) => {
        return list.map(img => `
                    <div class="gallery-item">
                        <img src="${img.src}" alt="${img.title}" loading="lazy">
                        <div class="gallery-caption">
                            <h4>${img.title}</h4>
                            <p>${img.desc}</p>
                        </div>
                    </div>
                `).join('');
    };

    container.innerHTML = renderSet(galleryImages) + renderSet(galleryImages) + renderSet(galleryImages);

    const track = document.getElementById('gallery-track');
    track.addEventListener('scroll', handleGalleryScroll);

    track.addEventListener('mouseenter', () => isHoveringGallery = true);
    track.addEventListener('mouseleave', () => isHoveringGallery = false);

    track.addEventListener('wheel', (e) => {
        if (!isGalleryExpanded) {
            e.preventDefault();
            handleUserInteraction();
            scrollVelocity += e.deltaY * 0.25;
        }
    }, {passive: false});

    const items = track.querySelectorAll('.gallery-item');
    items.forEach(item => {
        item.onclick = function () {
            handleUserInteraction();

            if (!isGalleryExpanded) {
                const center = item.offsetLeft + (item.offsetWidth / 2) - (track.clientWidth / 2);
                track.scrollTo({left: center, behavior: 'smooth'});
                scrollVelocity = 0;
            }
        }
    });

    animateMomentumScroll();
    setTimeout(() => {
        const singleSetWidth = track.scrollWidth / 3;
        track.scrollLeft = singleSetWidth;
        updateGalleryScaling();
        startGalleryAutoScroll();
    }, 100);
}

function handleUserInteraction() {
    clearInterval(galleryInterval);

    if (isGalleryPaused) return;

    clearTimeout(autoScrollTimeout);
    autoScrollTimeout = setTimeout(() => {
        startGalleryAutoScroll();
    }, AUTO_RESUME_DELAY);
}

function animateMomentumScroll() {
    const track = document.getElementById('gallery-track');

    if (!isGalleryExpanded && Math.abs(scrollVelocity) > 0.5) {
        track.scrollLeft += scrollVelocity;
        scrollVelocity *= 0.95;
    } else if (Math.abs(scrollVelocity) <= 0.5 && scrollVelocity !== 0) {
        scrollVelocity = 0;
        snapToNearest(track);
    }
    requestAnimationFrame(animateMomentumScroll);
}

function snapToNearest(track) {
    // Find the item closest to center
    const items = track.querySelectorAll('.gallery-item');
    let bestItem = null;
    let minDist = Infinity;
    const centerPoint = track.scrollLeft + (track.clientWidth / 2);

    items.forEach(item => {
        const itemCenter = item.offsetLeft + (item.offsetWidth / 2);
        const dist = Math.abs(centerPoint - itemCenter);
        if (dist < minDist) {
            minDist = dist;
            bestItem = item;
        }
    });

    if (bestItem) {
        const targetPos = bestItem.offsetLeft + (bestItem.offsetWidth / 2) - (track.clientWidth / 2);
        track.scrollTo({left: targetPos, behavior: 'smooth'});
    }
}

function handleGalleryScroll() {
    const track = document.getElementById('gallery-track');
    const singleSetWidth = track.scrollWidth / 3;

    if (track.scrollLeft < 50) { // Small threshold
        track.scrollLeft += singleSetWidth;
    } else if (track.scrollLeft > singleSetWidth * 2) {
        track.scrollLeft -= singleSetWidth;
    }
    updateGalleryScaling();
}

function updateGalleryScaling() {
    if (isGalleryExpanded) return;

    const track = document.getElementById('gallery-track');
    const items = track.querySelectorAll('.gallery-item');
    const centerPoint = track.scrollLeft + (track.clientWidth / 2);

    items.forEach(item => {
        const itemCenter = item.offsetLeft + (item.offsetWidth / 2);
        const distance = Math.abs(centerPoint - itemCenter);

        const maxDist = 600;

        let scale = 0.85;
        let opacity = 0.5;

        if (distance < maxDist) {
            const ratio = 1 - (distance / maxDist);
            scale = 0.85 + (0.30 * ratio); // Interpolate between 0.85 and 1.15
            opacity = 0.5 + (0.5 * ratio);
        :
            number
        }

        // Add 'active' class to closest item for caption visibility
        if (distance < 200) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }

        item.style.transform = `scale(${scale})`;
        item.style.opacity = opacity;
    });
}

function startGalleryAutoScroll() {
    if (galleryInterval) clearInterval(galleryInterval);

    galleryInterval = setInterval(() => {
        // Only auto-scroll if not expanded AND not currently being scrolled by user (velocity low)
        if (!isGalleryPaused && !isGalleryExpanded && Math.abs(scrollVelocity) < 1) {
            const track = document.getElementById('gallery-track');
            const items = track.querySelectorAll('.gallery-item');

            // Find current centered item index
            let bestIndex = 0;
            let minDistance = Infinity;
            const centerPoint = track.scrollLeft + (track.clientWidth / 2);

            items.forEach((item, index) => {
                const itemCenter = item.offsetLeft + (item.offsetWidth / 2);
                const dist = Math.abs(centerPoint - itemCenter);
                if (dist < minDistance) {
                    minDistance = dist;
                    bestIndex = index;
                }
            });

            // Move to next index, loop to 0 if at end
            let nextIndex = bestIndex + 1;
            if (nextIndex >= items.length) nextIndex = 0;

            const targetItem = items[nextIndex];
            // Scroll so target is centered
            // center = offsetLeft + width/2 - screenWidth/2
            const scrollPos = targetItem.offsetLeft + (targetItem.offsetWidth / 2) - (track.clientWidth / 2);

            track.scrollTo({left: scrollPos, behavior: 'smooth'});
        }
    }, 5000); // 5 Seconds
}

function toggleGalleryPause() {
    isGalleryPaused = !isGalleryPaused;
    const btn = document.getElementById('galleryPauseBtn');
    if (isGalleryPaused) {
        btn.classList.add('active');
        btn.innerHTML = '<svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor"><path d="M3 2l10 5-10 5z"/></svg>'; // Play Icon
        clearInterval(galleryInterval); // Immediately stop interval
    } else {
        btn.classList.remove('active');
        btn.innerHTML = '<svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor"><rect x="3" y="2" width="3" height="10" rx="1" /><rect x="8" y="2" width="3" height="10" rx="1" /></svg>'; // Pause Icon
        startGalleryAutoScroll(); // Resume immediately
    }
}

function toggleGalleryExpand() {
    const track = document.getElementById('gallery-track');
    const btn = document.getElementById('galleryExpandBtn');
    isGalleryExpanded = !isGalleryExpanded;

    if (isGalleryExpanded) {
        track.classList.add('expanded');
        btn.classList.add('active');

        // Reset transforms for grid view
        const items = track.querySelectorAll('.gallery-item');
        items.forEach(item => {
            item.style.transform = '';
            item.style.opacity = '';
            // Force remove active class to clear borders
            item.classList.remove('active');
        });
    } else {
        track.classList.remove('expanded');
        btn.classList.remove('active');
        updateGalleryScaling(); // Re-apply carousel scaling
    }
}

renderGallery();
