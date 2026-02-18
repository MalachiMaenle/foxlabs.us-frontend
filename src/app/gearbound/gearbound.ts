import { Component, ViewEncapsulation, AfterViewInit, OnDestroy, NgZone } from '@angular/core';
import {NgOptimizedImage} from "@angular/common";

@Component({
    selector: 'app-gearbound',
    standalone: true,
    imports: [
        NgOptimizedImage
    ],
    templateUrl: './gearbound.html',
    styleUrl: './gearbound.css',
    encapsulation: ViewEncapsulation.None,
})
export class Gearbound implements AfterViewInit, OnDestroy {

    // -- Data --
    private serverIp = "gearbound.exphost.net";
    private animationFrameId: number | null = null;
    private galleryInterval: any = 0;

    scrollToSection(sectionId: string) {
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

    // Teams Data
    private teamsData = [
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

    // Gallery Data
    private galleryImages = [
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

    // Gallery State
    private isGalleryPaused = false;
    private isGalleryExpanded = false;
    private scrollVelocity = 0;
    private isHoveringGallery = false;
    private autoScrollTimeout: any = 0;
    private readonly AUTO_RESUME_DELAY = 4000;

    constructor(private ngZone: NgZone) {}

    ngAfterViewInit() {
        this.ngZone.runOutsideAngular(() => {
            this.initGears();
            this.initGalleryMomentum();
        });

        // Initialize UI logic
        this.renderTeams();
        this.renderGallery();
        this.initServerStatus();
        this.initCopyButton();
        this.initGalleryControls();
        this.initTabs();
    }

    ngOnDestroy() {
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
        }
        if (this.galleryInterval) {
            clearInterval(this.galleryInterval);
        }
    }

    // @GEARRS @INIT
    private initGears() {
        const scroller = document.querySelector('article');
        const gearLeft = document.getElementById('gearLeft');
        const gearRight = document.getElementById('gearRight');

        if (!scroller || !gearLeft || !gearRight) return;

        // @GEAR @CONFIG
        const parallaxSpeed = 0.35;

        const baseSpeed = 0.02;
        const scrollInputMult = 0.002;
        const friction = 0.994;

        let totalScrollRotation = 0;
        let rotationalVelocity = 0;
        let lastScrollY = scroller.scrollTop;

        const animate = () => {
            const currentScrollY = scroller.scrollTop;
            const deltaY = currentScrollY - lastScrollY;
            lastScrollY = currentScrollY;

            rotationalVelocity += Math.abs(deltaY) * scrollInputMult;
            rotationalVelocity *= friction;
            totalScrollRotation += rotationalVelocity;
            const rotationL = (performance.now() * baseSpeed) + totalScrollRotation;
            const rotationR = -rotationL;
            const moveY = -currentScrollY * parallaxSpeed;

            gearLeft.style.transform = `translateY(${moveY}px) rotate(${rotationL}deg)`;
            gearRight.style.transform = `translateY(${moveY}px) rotate(${rotationR}deg)`;

            this.animationFrameId = requestAnimationFrame(animate);
        };

        animate();
    }

    // @SERVER @STATUS
    private initServerStatus() {
        fetch(`https://api.mcsrvstat.us/3/${this.serverIp}`)
            .then(response => response.json())
            .then(data => {
                const statusDiv = document.getElementById("server-status");
                const playerContainer = document.getElementById("player-container");

                if (!statusDiv || !playerContainer) return;

                if (data.online) {
                    let latencyHtml = "";
                    if (data.debug && typeof data.debug.ping === 'number') {
                        latencyHtml = `<p class="info-text">Ping: ${data.debug.ping}ms</p>`;
                    }

                    statusDiv.innerHTML = `<div class="status-line online"><span>●</span> Online</div>${latencyHtml}<p class="info-text">Players: <strong>${data.players.online}</strong> / ${data.players.max}</p><p class="info-text">Version: ${data.protocol?.name || data.version}</p>`;

                    if (data.players.list && data.players.list.length > 0) {
                        let playersHtml = '<div class="player-list">';
                        data.players.list.forEach((player: any) => {
                            const avatarUrl = `https://mc-heads.net/avatar/${player.name}/48`;
                            playersHtml += `<div class="player-item"><img src="${avatarUrl}" class="player-head" alt="${player.name}" onerror="this.src='https://mc-heads.net/avatar/MHF_Steve/48'"><span class="player-name" title="${player.name}">${player.name}</span></div>`;
                        });
                        playersHtml += '</div>';
                        playerContainer.innerHTML = '<div class="player-list-header">Who is online</div>' + playersHtml;
                    } else {
                        playerContainer.innerHTML = '<p class="info-text" style="margin-top:15px; font-style:italic;">No engineers on site</p>';
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
    }

    // @COPY @IP
    private initCopyButton() {
        const btn = document.querySelector<HTMLButtonElement>('.copy-btn');
        if (btn) {
            btn.addEventListener('click', () => {
                navigator.clipboard.writeText(this.serverIp).then(() => {
                    const originalText = btn.innerText;
                    btn.innerText = 'COPIED!';
                    btn.style.borderColor = "#30b27b";
                    btn.style.color = "#30b27b";
                    btn.style.background = "#0e0e0e";

                    setTimeout(() => {
                        btn.innerText = originalText;
                        btn.style.borderColor = "";
                        btn.style.color = "";
                        btn.style.background = "";
                    }, 2000);
                }).catch(console.error);
            });
        }
    }

    // @TEAMS
    private renderTeams() {
        const container = document.getElementById('teams-grid');
        if (!container) return;

        let html = '';
        this.teamsData.forEach(team => {
            let membersHtml = '<div class="player-list">';
            team.members.forEach(member => {
                const avatarUrl = `https://mc-heads.net/avatar/${member}/48`;
                membersHtml += `
                    <div class="player-item">
                        <img src="${avatarUrl}" class="player-head" alt="${member}" onerror="this.src='https://mc-heads.net/avatar/MHF_Steve/48'">
                        <span class="player-name" title="${member}">${member}</span>
                    </div>`;
            });
            membersHtml += '</div>';
            html += `
                <div class="team-card" style="border-color: ${team.color}40;">
                    <h3 class="team-name" style="color: ${team.color}; border-color: ${team.color}66;">${team.name}</h3>
                    ${membersHtml}
                </div>`;
        });
        container.innerHTML = html;
    }

    // @GALLERY
    private renderGallery() {
        const container = document.getElementById('gallery-track');
        const track = document.getElementById('gallery-track');

        if (!container || !track) return;

        const renderSet = (list: any[]) => {
            return list.map(img => `<div class="gallery-item"><img src="${img.src}" alt="${img.title}" loading="lazy"><div class="gallery-caption"><h4>${img.title}</h4><p>${img.desc}</p></div></div>`).join('');
        };

        container.innerHTML = renderSet(this.galleryImages) + renderSet(this.galleryImages) + renderSet(this.galleryImages);

        track.addEventListener('scroll', () => this.handleGalleryScroll());
        track.addEventListener('mouseenter', () => this.isHoveringGallery = true);
        track.addEventListener('mouseleave', () => this.isHoveringGallery = false);

        track.addEventListener('wheel', (e) => {
            if (!this.isGalleryExpanded) {
                e.preventDefault();
                track.style.scrollBehavior = 'auto';
                this.scrollVelocity += e.deltaY * 0.5;
                this.handleUserInteraction();
            }
        }, { passive: false });

        track.addEventListener('click', (e: Event) => {
            const target = (e.target as HTMLElement).closest('.gallery-item') as HTMLElement;
            if (target && track.contains(target)) {
                this.handleUserInteraction();
                if (!this.isGalleryExpanded) {
                    const center = target.offsetLeft + (target.offsetWidth / 2) - (track.clientWidth / 2);
                    track.scrollTo({ left: center, behavior: 'smooth' });
                    this.scrollVelocity = 0;
                }
            }
        });

        setTimeout(() => {
            const singleSetWidth = track.scrollWidth / 3;
            track.scrollLeft = singleSetWidth;
            this.updateGalleryScaling();
            this.startGalleryAutoScroll();
        }, 100);
    }

    // @GALLERY @INIT @MOVEMENT
    private initGalleryMomentum() {
        const animate = () => {
            const track = document.getElementById('gallery-track');
            if (track) {
                if (!this.isGalleryExpanded && Math.abs(this.scrollVelocity) > 0.5) {
                    track.style.scrollBehavior = 'auto';
                    track.scrollLeft += this.scrollVelocity;
                    this.scrollVelocity *= 0.95;
                } else if (Math.abs(this.scrollVelocity) <= 0.5 && this.scrollVelocity !== 0) {
                    this.scrollVelocity = 0;
                    track.style.scrollBehavior = '';
                    this.snapToNearest(track);
                }
            }
            requestAnimationFrame(animate);
        };
        requestAnimationFrame(animate);
    }

    private handleGalleryScroll() {
        const track = document.getElementById('gallery-track');
        if (!track) return;
        const singleSetWidth = track.scrollWidth / 3;
        if (track.scrollLeft < 50) {
            track.scrollLeft += singleSetWidth;
        } else if (track.scrollLeft > singleSetWidth * 2) {
            track.scrollLeft -= singleSetWidth;
        }
        this.updateGalleryScaling();
    }

    private updateGalleryScaling() {
        if (this.isGalleryExpanded) return;
        const track = document.getElementById('gallery-track');
        if (!track) return;

        const items = track.querySelectorAll('.gallery-item') as NodeListOf<HTMLElement>;
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

    // @GALLERY @AUTO @SCROLL
    private startGalleryAutoScroll() {
        if (this.galleryInterval) clearInterval(this.galleryInterval);

        this.galleryInterval = setInterval(() => {
            if (!this.isGalleryPaused && !this.isGalleryExpanded && Math.abs(this.scrollVelocity) < 1) {
                const track = document.getElementById('gallery-track');
                if (!track) return;

                const items = track.querySelectorAll('.gallery-item') as NodeListOf<HTMLElement>;
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

                let nextIndex = bestIndex + 1;
                if (nextIndex >= items.length) nextIndex = 0;

                const targetItem = items[nextIndex];
                if (targetItem) {
                    const scrollPos = targetItem.offsetLeft + (targetItem.offsetWidth / 2) - (track.clientWidth / 2);
                    track.scrollTo({ left: scrollPos, behavior: 'smooth' });
                }
            }
        }, 5000);
    }

    // @GALLERY @SNAP
    private snapToNearest(track: HTMLElement) {
        const items = track.querySelectorAll('.gallery-item') as NodeListOf<HTMLElement>;
        let bestItem: HTMLElement | null = null;
        let minDist = Infinity;
        const centerPoint = track.scrollLeft + (track.clientWidth / 2);

        for (const item of items as any) {
            const itemCenter = item.offsetLeft + (item.offsetWidth / 2);
            const dist = Math.abs(centerPoint - itemCenter);
            if (dist < minDist) {
                minDist = dist;
                bestItem = item;
            }
        }

        if (bestItem) {
            const targetPos = (bestItem as HTMLElement).offsetLeft + ((bestItem as HTMLElement).offsetWidth / 2) - (track.clientWidth / 2);
            track.scrollTo({ left: targetPos, behavior: 'smooth' });
        }
    }

    private handleUserInteraction() {
        clearInterval(this.galleryInterval);
        if (this.isGalleryPaused) return;
        clearTimeout(this.autoScrollTimeout);
        this.autoScrollTimeout = setTimeout(() => {
            this.startGalleryAutoScroll();
        }, this.AUTO_RESUME_DELAY);
    }

    // @INIT @GALLERY @CONTROLLS
    private initGalleryControls() {
        const pauseBtn = document.getElementById('galleryPauseBtn');
        const expandBtn = document.getElementById('galleryExpandBtn');

        if (pauseBtn) {
            pauseBtn.addEventListener('click', () => this.toggleGalleryPause());
        }
        if (expandBtn) {
            expandBtn.addEventListener('click', () => this.toggleGalleryExpand());
        }
    }

    // @INIT @TABS
    private initTabs() {
        const tabBtns = document.querySelectorAll('.tab-btn');
        tabBtns.forEach(btn => {
            btn.addEventListener('click', (e: Event) => {
                const target = e.target as HTMLElement;

                if (target.parentElement) {
                    target.parentElement.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
                }
                target.classList.add('active');

                if (target.parentElement?.classList.contains('tabs')) {
                    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
                    let id = '';
                    if (target.textContent?.includes('Curse')) id = 'curse-help';
                    if (target.textContent?.includes('Modrinth')) id = 'modrinth-help';
                    if (target.textContent?.includes('Prism')) id = 'prism-help';

                    const content = document.getElementById(id);
                    if (content) content.classList.add('active');
                }
            });
        });
    }

    // @GALLERY @PAUSE
    private toggleGalleryPause() {
        this.isGalleryPaused = !this.isGalleryPaused;
        const btn = document.getElementById('galleryPauseBtn');
        if (!btn) return;

        if (this.isGalleryPaused) {
            btn.classList.add('active');
            btn.innerHTML = '<svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor"><path d="M3 2l10 5-10 5z"/></svg>';
            clearInterval(this.galleryInterval);
        } else {
            btn.classList.remove('active');
            btn.innerHTML = '<svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor"><rect x="3" y="2" width="3" height="10" rx="1" /><rect x="8" y="2" width="3" height="10" rx="1" /></svg>';
            this.startGalleryAutoScroll();
        }
    }

    // @GALLERY @EXPAND
    private toggleGalleryExpand() {
        const track = document.getElementById('gallery-track');
        const btn = document.getElementById('galleryExpandBtn');
        this.isGalleryExpanded = !this.isGalleryExpanded;

        if (!track || !btn) return;

        if (this.isGalleryExpanded) {
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
            this.updateGalleryScaling();
        }
    }
}