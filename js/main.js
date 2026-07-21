/**
 * main.js
 * -------
 * Lê window.SITE_CONTENT (definido em data/content.js, gerado por build.js) e
 * renderiza as seções dinâmicas (#about-content, #experience-timeline,
 * #projects-grid) de acordo com o idioma ativo. Também aplica as strings de
 * interface estáticas (nav, hero, títulos de seção etc) via [data-i18n].
 *
 * Não usa fetch() em nenhum momento -> funciona abrindo o index.html direto
 * (file://), sem precisar de servidor.
 */

const ACCENT_CLASSES = {
    copper: "bg-copper/20",
    olive: "bg-olive/20",
    indigo: "bg-indigo-500/20",
    blue: "bg-blue-500/20",
    yellow: "bg-yellow-600/20",
    zinc: "bg-zinc-500/20",
};

const LINK_ICON = {
    github: "ph-github-logo",
    demo: "ph-arrow-up-right",
    live: "ph-link",
    video: "ph-youtube-logo",
    gallery: "ph-images",
};

const ICON_COLOR_CLASS = { olive: "text-olive-light", copper: "text-copper" };

const LANG_STORAGE_KEY = "portfolio-lang";
const SUPPORTED_LANGS = ["pt", "en"];

function getInitialLang() {
    try {
        const saved = window.localStorage.getItem(LANG_STORAGE_KEY);
        if (saved && SUPPORTED_LANGS.includes(saved)) return saved;
    } catch (e) { /* localStorage pode falhar em file:// em alguns navegadores; ignora */ }
    const nav = (navigator.language || "pt").toLowerCase();
    return nav.startsWith("en") ? "en" : "pt";
}

let currentLang = getInitialLang();

function el(html) {
    const t = document.createElement("template");
    t.innerHTML = html.trim();
    return t.content.firstElementChild;
}

/* ---------------- ABOUT ---------------- */

function renderAbout(data) {
    const container = document.getElementById("about-content");
    if (!container) return;
    if (!data || !data.about) {
        container.innerHTML = `<p class="text-red-400 font-mono text-sm">Conteúdo de about/ não encontrado. Rode "node build.js".</p>`;
        return;
    }
    const about = data.about;
    const tagsHtml = about.tags.map((tag) => {
        const color = ICON_COLOR_CLASS[tag.color] || "";
        return `<span class="px-3 py-1.5 bg-graphite-light border border-graphite-lighter rounded text-sm text-zinc-300 flex items-center gap-2">
                    <i class="ph ${tag.icon} ${color}"></i> ${tag.label}
                </span>`;
    }).join("");

    container.innerHTML = `
        <div class="lg:col-span-5 relative group">
            <div class="absolute -inset-2 bg-gradient-to-r from-copper/20 to-olive/20 rounded blur opacity-0 group-hover:opacity-100 transition duration-500"></div>
            <div class="relative rounded aspect-[4/5] overflow-hidden border border-graphite-lighter bg-graphite flex items-center justify-center grayscale hover:grayscale-0 transition duration-500">
                <img src="${about.photo}" onerror="this.onerror=null;this.src='https://placehold.co/600x800/1C1C1C/C07F45?font=Montserrat&text=Engenharia+%26%0ACriatividade'" alt="Retrato" class="w-full h-full object-cover">
                <div class="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-copper m-4"></div>
                <div class="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-copper m-4"></div>
            </div>
        </div>
        <div class="lg:col-span-7 flex flex-col gap-6 text-lg" data-about-body>
            ${about.bodyHtml}
            <div class="mt-2">
                <h3 class="font-mono text-copper text-sm mb-4 uppercase tracking-widest" data-i18n="about.interestsLabel"></h3>
                <div class="flex flex-wrap gap-3">${tagsHtml}</div>
            </div>
        </div>`;

    // primeiro <p> em destaque (zinc-300), demais em zinc-400 - igual ao layout original
    const paragraphs = container.querySelectorAll("[data-about-body] > p");
    paragraphs.forEach((p, i) => p.classList.add(i === 0 ? "text-zinc-300" : "text-zinc-400", "leading-relaxed"));

    applyI18nTo(container);
}

/* ---------------- EXPERIENCES ---------------- */

function renderExperienceCard(exp, index) {
    const isEven = index % 2 === 0;
    const dotClasses = exp.current
        ? "w-8 h-8 rounded-full border-4 border-copper my-4 md:my-0"
        : "w-6 h-6 rounded-full border-2 border-zinc-600 my-4 md:my-0";
    const dotInner = exp.current ? `<div class="w-full h-full rounded-full bg-copper animate-pulse"></div>` : "";

    const stacksHtml = exp.stacks
        .map((s) => `<span class="text-xs font-mono text-zinc-300 bg-graphite px-2 py-1 rounded">${s}</span>`)
        .join("");

    const cardAlignClass = isEven ? "" : "text-left md:text-right";
    const cardBorderClass = exp.current ? "border border-copper/30" : "";
    const periodClass = exp.current ? "text-copper" : "text-zinc-500";
    const tagsAlignClass = isEven ? "" : "justify-start md:justify-end";

    const cardHtml = `
        <div class="order-1 glass-card rounded p-6 md:w-5/12 shadow-card ${cardBorderClass} transition-all hover:-translate-y-1 ${cardAlignClass}">
            <div class="flex justify-between items-center mb-2">
                <h3 class="font-bold text-xl text-white">${exp.title}</h3>
            </div>
            <h4 class="font-mono text-sm ${periodClass} mb-4">${exp.company} • ${exp.period}</h4>
            <div class="text-zinc-400 text-sm mb-4">${exp.descriptionHtml}</div>
            <div class="flex flex-wrap gap-2 mt-4 ${tagsAlignClass}">${stacksHtml}</div>
        </div>`;

    const dotHtml = `<div class="z-20 flex items-center order-1 bg-graphite shadow-xl ${dotClasses}">${dotInner}</div>`;
    const spacerHtml = `<div class="order-1 md:w-5/12"></div>`;

    return el(`
        <div class="relative z-10 w-full mb-12 flex flex-col md:flex-row items-center justify-between group">
            ${isEven ? spacerHtml + dotHtml + cardHtml : cardHtml + dotHtml + spacerHtml}
        </div>`);
}

function renderExperiences(data) {
    const container = document.getElementById("experience-timeline");
    if (!container) return;
    container.innerHTML = "";
    if (!data || !data.experiences.length) {
        container.innerHTML = `<p class="text-center text-zinc-500 font-mono text-sm">Nenhuma experiência cadastrada em experiences/</p>`;
        return;
    }
    data.experiences.forEach((exp, i) => container.appendChild(renderExperienceCard(exp, i)));
}

/* ---------------- PROJECTS ---------------- */

function renderCarousel(project) {
    if (!project.images.length) {
        const label = UI_STRINGS[currentLang]["projects.noImages"];
        return `<div class="h-48 flex items-center justify-center bg-graphite-light text-zinc-600 font-mono text-xs text-center px-4">${label} projects/${project.slug}/images/</div>`;
    }
    const imgsHtml = project.images
        .map((src, i) => `<img src="${src}" alt="${project.title} screenshot ${i + 1}" class="${i === 0 ? "is-active" : ""}" loading="lazy">`)
        .join("");
    const dotsHtml = project.images
        .map((_, i) => `<button type="button" class="${i === 0 ? "is-active" : ""}" data-dot="${i}" aria-label="Imagem ${i + 1}"></button>`)
        .join("");
    const navHtml = project.images.length > 1
        ? `<button type="button" class="project-carousel-nav prev" data-nav="prev" aria-label="Anterior"><i class="ph ph-caret-left"></i></button>
           <button type="button" class="project-carousel-nav next" data-nav="next" aria-label="Próxima"><i class="ph ph-caret-right"></i></button>`
        : "";

    return `<div class="project-carousel" data-carousel data-index="0">
                ${imgsHtml}
                ${navHtml}
                <div class="project-carousel-dots">${dotsHtml}</div>
            </div>`;
}

function wireCarousel(cardEl, project) {
    const carousel = cardEl.querySelector("[data-carousel]");
    if (!carousel || project.images.length <= 1) return;

    const imgs = [...carousel.querySelectorAll("img")];
    const dots = [...carousel.querySelectorAll("[data-dot]")];

    function goTo(index) {
        const n = imgs.length;
        const wrapped = ((index % n) + n) % n;
        imgs.forEach((img, i) => img.classList.toggle("is-active", i === wrapped));
        dots.forEach((dot, i) => dot.classList.toggle("is-active", i === wrapped));
        carousel.dataset.index = String(wrapped);
    }

    carousel.querySelector('[data-nav="prev"]')?.addEventListener("click", () => goTo(Number(carousel.dataset.index) - 1));
    carousel.querySelector('[data-nav="next"]')?.addEventListener("click", () => goTo(Number(carousel.dataset.index) + 1));
    dots.forEach((dot) => dot.addEventListener("click", () => goTo(Number(dot.dataset.dot))));

    const timer = setInterval(() => goTo(Number(carousel.dataset.index) + 1), 5000);
    cardEl.dataset.carouselTimer = String(timer);
}

function renderProjectCard(project) {
    const stackHtml = project.stack
        .map((s) => `<span class="text-[10px] uppercase tracking-wider font-mono px-2 py-1 bg-graphite border border-zinc-700 rounded text-zinc-300">${s}</span>`)
        .join("");

    const linksHtml = project.links
        .map((link, i) => `
            <a href="${link.href}" target="_blank" rel="noopener" class="text-sm text-zinc-300 hover:text-copper flex items-center gap-1 transition-colors ${i > 0 ? "ml-auto" : ""}">
                <i class="ph ${LINK_ICON[link.type] || "ph-link"}"></i> ${link.label || link.type}
            </a>`)
        .join("");

    const accentTint = ACCENT_CLASSES[project.accent] || ACCENT_CLASSES.copper;

    const card = el(`
        <div class="glass-card rounded overflow-hidden flex flex-col group border border-graphite-lighter hover:border-copper/50 transition-colors">
            <div class="relative">
                <div class="absolute inset-0 ${accentTint} group-hover:bg-transparent transition-colors z-10 pointer-events-none"></div>
                ${renderCarousel(project)}
            </div>
            <div class="p-6 flex flex-col flex-grow">
                <h3 class="font-heading text-xl font-bold mb-2 text-white">${project.title}</h3>
                <div class="text-sm text-zinc-400 mb-4 flex-grow">${project.descriptionHtml}</div>
                <div class="flex flex-wrap gap-2 mb-6">${stackHtml}</div>
                <div class="flex gap-4 mt-auto">${linksHtml}</div>
            </div>
        </div>`);

    wireCarousel(card, project);
    return card;
}

function renderProjects(data) {
    const container = document.getElementById("projects-grid");
    if (!container) return;
    // limpa timers de carrossel de renders anteriores (troca de idioma) pra não acumular
    container.querySelectorAll("[data-carousel-timer]").forEach((c) => clearInterval(Number(c.dataset.carouselTimer)));
    container.innerHTML = "";
    if (!data || !data.projects.length) {
        container.innerHTML = `<p class="text-center text-zinc-500 font-mono text-sm col-span-full">Nenhum projeto cadastrado em projects/</p>`;
        return;
    }
    data.projects.forEach((project) => container.appendChild(renderProjectCard(project)));
}

/* ---------------- I18N (strings estáticas da interface) ---------------- */

function applyI18nTo(root) {
    (root || document).querySelectorAll("[data-i18n]").forEach((node) => {
        const str = UI_STRINGS[currentLang][node.dataset.i18n];
        if (str !== undefined) node.textContent = str;
    });
    (root || document).querySelectorAll("[data-i18n-html]").forEach((node) => {
        const str = UI_STRINGS[currentLang][node.dataset.i18nHtml];
        if (str !== undefined) node.innerHTML = str;
    });
}

function updateLangButtons() {
    document.querySelectorAll("[data-lang-btn]").forEach((btn) => {
        btn.classList.toggle("is-active-lang", btn.dataset.langBtn === currentLang);
    });
    document.documentElement.lang = currentLang === "en" ? "en" : "pt-BR";
}

/* ---------------- RENDER / BOOT ---------------- */

function renderAll() {
    const data = window.SITE_CONTENT && window.SITE_CONTENT[currentLang];
    applyI18nTo(document);
    renderAbout(data);
    renderExperiences(data);
    renderProjects(data);
    updateLangButtons();
}

function setLang(lang) {
    if (!SUPPORTED_LANGS.includes(lang) || lang === currentLang) return;
    currentLang = lang;
    try { window.localStorage.setItem(LANG_STORAGE_KEY, lang); } catch (e) { /* ignora */ }
    renderAll();
}

function wireLangButtons() {
    document.querySelectorAll("[data-lang-btn]").forEach((btn) => {
        btn.addEventListener("click", () => setLang(btn.dataset.langBtn));
    });
}

function main() {
    if (!window.SITE_CONTENT) {
        document.body.insertAdjacentHTML(
            "afterbegin",
            `<div style="background:#7f1d1d;color:#fff;padding:12px;font-family:monospace;font-size:13px;text-align:center;">
                data/content.js não encontrado ou não carregou. Rode <b>node build.js</b> (ou <b>npm run build</b>) e recarregue a página.
            </div>`
        );
        return;
    }
    wireLangButtons();
    renderAll();
}

document.addEventListener("DOMContentLoaded", main);
