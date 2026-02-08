import {Component, signal} from '@angular/core';
import {App} from "../app";

@Component({
    selector: 'app-gearbound',
    imports: [],
    templateUrl: './gearbound.html',
    styleUrl: './gearbound.css',
})

export class Gearbound {

}

const serverIp = "gearbound.exphost.net";
const teamsData = [
    {
        name: "FoxyTown",
        color: "#E38839", // Brass
        members: ["port0001", "XicefireboyX", "Gamingfoxy81", "didamorte", "xPkz_", "TomReh", "Krumist_", "Warri0rDan", "AnderZytolga"]
    },
    {
        name: "Anchor",
        color: "#bf70bc", // Modrinth Green
        members: ["PreChecked", "AsealGuy", "D505"]
    }
];
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

function copyIP() {
    navigator.clipboard.writeText(serverIp).then(text => {
        const btn = document.querySelector<HTMLButtonElement>('.copy-btn');

        if (!btn) {
            console.log("Element copy-btn was returned null")
        } else {
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
    }).catch(err => {
        console.error("Failed to copy IP:", err);
    });
}
document.addEventListener('DOMContentLoaded', () => {
    const btn = document.querySelector<HTMLButtonElement>('.copy-btn');
    if (btn) {
        btn.addEventListener('click', copyIP);
    }
});

fetch(`https://api.mcsrvstat.us/3/${serverIp}`)
    .then(response => response.json())
    .then(data => {
        const statusDiv = document.getElementById("server-status");
        const playerContainer = document.getElementById("player-container");

        if (!statusDiv || !playerContainer) {
            console.error("Exception in server status");
            return;
        }

        if (data.online) {
            let latencyHtml = "";
            if (typeof data.debug.ping === 'number') {
                latencyHtml = `<p class="info-text">Ping: ${data.debug.ping}ms</p>`;
            }

            statusDiv.innerHTML = `<div class="status-line online"><span>●</span> Online</div>${latencyHtml}<p class="info-text">Players: <strong>${data.players.online}</strong> / ${data.players.max}</p><p class="info-text">Version: ${data.protocol.name || data.version}</p>`;

            if (data.players.list && data.players.list.length > 0) {
                let playersHtml = '<div class="player-list">';

                // @ts-ignore
                data.players.list.forEach(player => {
                    const avatarUrl = `https://mc-heads.net/avatar/${player.name}/48`;

                    playersHtml += `<div class="player-item"><img src="${avatarUrl}" class="player-head" alt="${player.name}" onerror="this.src='https://mc-heads.net/avatar/MHF_Steve/48'"><span class="player-name" title="${player.name}">${player.name}</span></div>`;
                });

                playersHtml += '</div>';
                playerContainer.innerHTML = '<div class="player-list-header">Who is online</div>' + playersHtml;
            } else {
                playerContainer.innerHTML = '<p class="info-text" style="margin-top:15px; font-style:italic;">No engineers on site.</p>';
            }

        } else {
            statusDiv.innerHTML = '<div class="status-line offline">❌ Offline</div>';
            playerContainer.innerHTML = '';
        }
    })
    .catch(error => {
        const statusDiv = document.getElementById("server-status");

        if (statusDiv) {
            statusDiv.innerHTML = '<span style="color:#f16436">Failed to load satellite data.</span>';
        }
        console.error("Error fetching status:", error);
    });

window.addEventListener('DOMContentLoaded', () => {
    const gearLeft = document.getElementById('gearLeft') as HTMLElement | null;
    const gearRight = document.getElementById('gearRight') as HTMLElement | null;
    console.log(gearLeft);
    console.log(gearRight);

    const baseSpeed = 0.05;
    const scrollEffect = 0.2;
    const parallaxSpeed = 0.35;

    let totalScrollRotation = 0;
    let lastScrollY = window.pageYOffset;

    function animateGears() {
        const currentScrollY = window.pageYOffset;

        const deltaY = currentScrollY - lastScrollY;

        totalScrollRotation += Math.abs(deltaY) * scrollEffect;
        lastScrollY = currentScrollY;

        const rotationL = (performance.now() * baseSpeed) + totalScrollRotation;
        const rotationR = -rotationL;

        const moveY = -currentScrollY * parallaxSpeed;

        if(gearLeft) gearLeft.style.transform = `translateY(${moveY}px) rotate(${rotationL}deg)`;
        if(gearRight) gearRight.style.transform = `translateY(${moveY}px) rotate(${rotationR}deg)`;

        requestAnimationFrame(animateGears);
    }
    animateGears();

    function renderTeams() {
        const container = document.getElementById('teams-grid');
        let html = '';

        if (!container) {
            console.error('Exception in renderTeams()');
            return;
        }

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

    let galleryInterval = 0;
    let isGalleryPaused = false;
    let isGalleryExpanded = false;
    let scrollVelocity = 0;
    let isHoveringGallery = false;
    let autoScrollTimeout = 0;
    const AUTO_RESUME_DELAY = 4000;

    interface GalleryImage {
        src: string;
        title: string;
        desc: string;
    }

    function renderGallery() {
        const container = document.getElementById('gallery-track');
        const track = document.getElementById('gallery-track');

        if (!container || !track) {
            console.error('Exception in renderGallery()');
            return;
        }

        const renderSet = (list: GalleryImage[]) => {
            return list.map(img => `<div class="gallery-item"><img src="${img.src}" alt="${img.title}" loading="lazy"><div class="gallery-caption"><h4>${img.title}</h4><p>${img.desc}</p></div></div>`).join('');
        };

        container.innerHTML = renderSet(galleryImages) + renderSet(galleryImages) + renderSet(galleryImages);

        track.addEventListener('scroll', handleGalleryScroll);

        track.addEventListener('mouseenter', () => isHoveringGallery = true);
        track.addEventListener('mouseleave', () => isHoveringGallery = false);

        track.addEventListener('wheel', (e) => {
            if(!isGalleryExpanded) {
                e.preventDefault();
                track.style.scrollBehavior = 'auto';
                scrollVelocity += e.deltaY * 0.5;
                handleUserInteraction();
            }
        }, { passive: false });


        const items = track.querySelectorAll('.gallery-item') as NodeListOf<HTMLElement>;;
        items.forEach(item => {
            item.onclick = function() {
                handleUserInteraction();

                if(!isGalleryExpanded) {
                    const center = item.offsetLeft + (item.offsetWidth / 2) - (track.clientWidth / 2);
                    track.scrollTo({ left: center, behavior: 'smooth' });
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
        const track = document.getElementById('gallery-track') as HTMLElement;

        if(!isGalleryExpanded && Math.abs(scrollVelocity) > 0.5) {
            track.style.scrollBehavior = 'auto';
            track.scrollLeft += scrollVelocity;
            scrollVelocity *= 0.95;
        } else if (Math.abs(scrollVelocity) <= 0.5 && scrollVelocity !== 0) {
            scrollVelocity = 0;
            track.style.scrollBehavior = '';
            snapToNearest(track);
        }
        requestAnimationFrame(animateMomentumScroll);
    }

    function snapToNearest(track: HTMLElement) {
        const items = track.querySelectorAll('.gallery-item') as NodeListOf<HTMLElement>;
        let bestItem: HTMLElement | null = null;
        let minDist = Infinity;
        const centerPoint = track.scrollLeft + (track.clientWidth / 2);

        for (const item of items) {
            const itemCenter = item.offsetLeft + (item.offsetWidth / 2);
            const dist = Math.abs(centerPoint - itemCenter);
            if(dist < minDist) {
                minDist = dist;
                bestItem = item;
            }
        }

        if(bestItem) {
            const targetPos = bestItem.offsetLeft + (bestItem.offsetWidth / 2) - (track.clientWidth / 2);
            track.scrollTo({ left: targetPos, behavior: 'smooth' });
        }
    }

    function handleGalleryScroll() {
        const track = document.getElementById('gallery-track') as HTMLElement;
        const singleSetWidth = track.scrollWidth / 3;

        if (track.scrollLeft < 50) {
            track.scrollLeft += singleSetWidth;
        }
        else if (track.scrollLeft > singleSetWidth * 2) {
            track.scrollLeft -= singleSetWidth;
        }
        updateGalleryScaling();
    }

    function updateGalleryScaling() {
        if (isGalleryExpanded) return;

        const track = document.getElementById('gallery-track') as HTMLElement;
        if (!track) return;
        const items = track.querySelectorAll('.gallery-item') as NodeListOf<HTMLElement>;
        if (!items) return;
        const centerPoint = track.scrollLeft + (track.clientWidth / 2);

        items.forEach(item => {
            const itemCenter = item.offsetLeft + (item.offsetWidth / 2);
            const distance = Math.abs(centerPoint - itemCenter);

            const maxDist = 600;

            let scale = 0.85;
            let opacity = 0.5;

            if (distance < maxDist) {
                const ratio = 1 - (distance / maxDist);
                scale = 0.85 + (0.30 * ratio);
                opacity = 0.5 + (0.5 * ratio);
            }

            if (distance < 200) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }

            item.style.transform = `scale(${scale})`;
            item.style.opacity = opacity.toString();
        });
    }

    function startGalleryAutoScroll() {
        if(galleryInterval) clearInterval(galleryInterval);

        galleryInterval = setInterval(() => {
            if(!isGalleryPaused && !isGalleryExpanded && Math.abs(scrollVelocity) < 1) {
                const track = document.getElementById('gallery-track');
                if(!track)
                {console.error("startGalleryAutoScroll track = null"); return;}
                const items = track.querySelectorAll('.gallery-item') as NodeListOf<HTMLElement>;

                let bestIndex = 0;
                let minDistance = Infinity;
                const centerPoint = track.scrollLeft + (track.clientWidth / 2);

                items.forEach((item, index) => {
                    const itemCenter = item.offsetLeft + (item.offsetWidth / 2);
                    const dist = Math.abs(centerPoint - itemCenter);
                    if(dist < minDistance) {
                        minDistance = dist;
                        bestIndex = index;
                    }
                });

                let nextIndex = bestIndex + 1;
                if(nextIndex >= items.length) nextIndex = 0;

                const targetItem = items[nextIndex];
                const scrollPos = targetItem.offsetLeft + (targetItem.offsetWidth / 2) - (track.clientWidth / 2);

                track.scrollTo({ left: scrollPos, behavior: 'smooth' });
            }
        }, 5000); //ms
    }

    function toggleGalleryPause() {
        isGalleryPaused = !isGalleryPaused;
        const btn = document.getElementById('galleryPauseBtn');
        if(!btn)
        {console.error("toggleGalleryPause btn = null"); return;}
        if(isGalleryPaused) {
            btn.classList.add('active');
            btn.innerHTML = '<svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor"><path d="M3 2l10 5-10 5z"/></svg>'; // Play Icon
            clearInterval(galleryInterval);
        } else {
            btn.classList.remove('active');
            btn.innerHTML = '<svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor"><rect x="3" y="2" width="3" height="10" rx="1" /><rect x="8" y="2" width="3" height="10" rx="1" /></svg>'; // Pause Icon
            startGalleryAutoScroll();
        }
    }

    function toggleGalleryExpand() {
        const track = document.getElementById('gallery-track');
        const btn = document.getElementById('galleryExpandBtn');
        isGalleryExpanded = !isGalleryExpanded;
        if(!btn)
        {console.error("toggleGalleryExpand btn = null"); return;}
        if(!track)
        {console.error("toggleGalleryExpand track = null"); return;}

        if(isGalleryExpanded) {
            track.classList.add('expanded');
            btn.classList.add('active');

            const items = track.querySelectorAll('.gallery-item') as NodeListOf<HTMLElement>;
            items.forEach(item => {
                item.style.transform = '';
                item.style.opacity = '';
                item.classList.remove('active');
            });
        } else {
            track.classList.remove('expanded');
            btn.classList.remove('active');
            updateGalleryScaling();
        }
    }

    function toggleScrollbar() {
        document.body.classList.toggle('hide-scrollbar');
        const btn = document.getElementById('galleryScrollbarBtn');
        if(!btn)
        {console.error("toggleScrollbar btn = null"); return;}
        btn.classList.toggle('active');
    }

    renderGallery();
});

