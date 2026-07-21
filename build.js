#!/usr/bin/env node
/**
 * build.js
 * ---------
 * Varre about/, experiences/*, projects/* procurando index-pt.md e index-en.md,
 * e gera data/content.js — um arquivo JS puro (window.SITE_CONTENT = {...}),
 * NÃO um JSON buscado via fetch. Isso é proposital: fetch() de arquivos locais
 * é bloqueado por CORS quando o site é aberto via file:// (sem servidor), mas
 * uma <script src="data/content.js"> funciona normalmente. Resultado: o site
 * funciona 100% estático, só abrindo o index.html no navegador.
 *
 * Rode `node build.js` toda vez que adicionar/editar/remover conteúdo em
 * about/, experiences/ ou projects/.
 */
const fs = require("fs");
const path = require("path");

const ROOT = __dirname;
const IMAGE_EXT = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif", ".avif"]);
const LANGS = ["pt", "en"];

const DEFAULT_LINK_LABELS = {
    pt: { github: "GitHub", demo: "Detalhes", live: "Visitar", video: "Ver Vídeo", gallery: "Ver Galeria" },
    en: { github: "GitHub", demo: "Details", live: "Visit", video: "Watch Video", gallery: "View Gallery" },
};
const LINK_TYPES = ["github", "demo", "live", "video", "gallery"];

function listDirs(dir) {
    if (!fs.existsSync(dir)) return [];
    return fs.readdirSync(dir, { withFileTypes: true })
        .filter((d) => d.isDirectory())
        .map((d) => d.name)
        .sort();
}

function listImages(dir) {
    if (!fs.existsSync(dir)) return [];
    return fs.readdirSync(dir, { withFileTypes: true })
        .filter((f) => f.isFile() && IMAGE_EXT.has(path.extname(f.name).toLowerCase()))
        .map((f) => f.name)
        .sort();
}

// --- frontmatter simples: "chave: valor" por linha, depois "---", depois corpo em markdown ---
function parseFrontmatter(raw) {
    const parts = raw.split(/\r?\n---\r?\n/);
    const head = parts[0] || "";
    const body = parts.slice(1).join("\n---\n").trim();
    const meta = {};
    head.split(/\r?\n/).forEach((line) => {
        const idx = line.indexOf(":");
        if (idx === -1) return;
        const key = line.slice(0, idx).trim();
        const value = line.slice(idx + 1).trim();
        if (key) meta[key] = value;
    });
    return { meta, body };
}

// --- markdown -> HTML minimalista: parágrafos, **negrito**, *itálico*, quebras de linha ---
function renderMarkdown(md) {
    if (!md) return "";
    return md
        .trim()
        .split(/\n\s*\n/)
        .map((para) => {
            const escaped = para.trim()
                .replace(/&/g, "&amp;")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;");
            const html = escaped
                .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
                .replace(/\*(.+?)\*/g, "<em>$1</em>")
                .replace(/\n/g, "<br>");
            return `<p>${html}</p>`;
        })
        .join("\n");
}

function readMd(filePath) {
    if (!fs.existsSync(filePath)) return null;
    return parseFrontmatter(fs.readFileSync(filePath, "utf-8"));
}

// Lê index-<lang>.md com fallback pro outro idioma se não existir (avisando no console)
function readBilingual(dir, label) {
    const files = {};
    LANGS.forEach((lang) => {
        files[lang] = readMd(path.join(dir, `index-${lang}.md`));
    });
    LANGS.forEach((lang) => {
        if (!files[lang]) {
            const fallbackLang = LANGS.find((l) => l !== lang && files[l]);
            if (fallbackLang) {
                console.warn(`[build] AVISO: falta index-${lang}.md em ${label} — usando index-${fallbackLang}.md como fallback.`);
                files[lang] = files[fallbackLang];
            }
        }
    });
    return files;
}

// --- ABOUT ---
function buildAbout(lang) {
    const dir = path.join(ROOT, "about");
    const files = readBilingual(dir, "about/");
    const parsed = files[lang];
    if (!parsed) {
        console.warn("[build] AVISO: about/ sem nenhum index-pt.md ou index-en.md.");
        return null;
    }
    const tags = (parsed.meta.tags || "")
        .split(",")
        .map((chunk) => chunk.trim())
        .filter(Boolean)
        .map((chunk) => {
            const [label, icon, color] = chunk.split(":").map((s) => (s || "").trim());
            return { label, icon: icon || "ph-check", color: color || null };
        });
    return {
        photo: parsed.meta.photo || "about/foto.jpg",
        tags,
        bodyHtml: renderMarkdown(parsed.body),
    };
}

// --- EXPERIENCES ---
function buildExperiences(lang) {
    const dir = path.join(ROOT, "experiences");
    const items = listDirs(dir).map((slug) => {
        const files = readBilingual(path.join(dir, slug), `experiences/${slug}/`);
        const parsed = files[lang];
        if (!parsed) {
            console.warn(`[build] AVISO: experiences/${slug}/ sem conteúdo, pulando.`);
            return null;
        }
        return {
            slug,
            title: parsed.meta.title || slug,
            company: parsed.meta.company || "",
            period: parsed.meta.period || "",
            stacks: (parsed.meta.stacks || "").split(",").map((s) => s.trim()).filter(Boolean),
            current: String(parsed.meta.current).toLowerCase() === "true",
            order: Number(parsed.meta.order) || 999,
            descriptionHtml: renderMarkdown(parsed.body),
        };
    }).filter(Boolean);
    items.sort((a, b) => a.order - b.order);
    return items;
}

// --- PROJECTS ---
function buildProjects(lang) {
    const dir = path.join(ROOT, "projects");
    const items = listDirs(dir).map((slug) => {
        const files = readBilingual(path.join(dir, slug), `projects/${slug}/`);
        const parsed = files[lang];
        if (!parsed) {
            console.warn(`[build] AVISO: projects/${slug}/ sem conteúdo, pulando.`);
            return null;
        }
        const images = listImages(path.join(dir, slug, "images")).map((img) => `projects/${slug}/images/${img}`);

        const links = LINK_TYPES
            .filter((type) => parsed.meta[type])
            .map((type) => ({
                type,
                href: parsed.meta[type],
                label: parsed.meta[`${type}_label`] || DEFAULT_LINK_LABELS[lang][type],
            }));

        return {
            slug,
            order: Number(parsed.meta.order) || 999,
            accent: parsed.meta.accent || "copper",
            title: parsed.meta.title || slug,
            stack: (parsed.meta.stack || "").split(",").map((s) => s.trim()).filter(Boolean),
            descriptionHtml: renderMarkdown(parsed.body),
            links,
            images,
        };
    }).filter(Boolean);
    items.sort((a, b) => a.order - b.order);
    return items;
}

function build() {
    const content = { generatedAt: new Date().toISOString() };
    let totalProjects = 0;
    let totalExperiences = 0;

    LANGS.forEach((lang) => {
        const projects = buildProjects(lang);
        const experiences = buildExperiences(lang);
        content[lang] = {
            about: buildAbout(lang),
            experiences,
            projects,
        };
        totalProjects = Math.max(totalProjects, projects.length);
        totalExperiences = Math.max(totalExperiences, experiences.length);
    });

    const outDir = path.join(ROOT, "data");
    if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

    const js = `// Gerado automaticamente por build.js — NÃO editar à mão.
// Rode "node build.js" (ou "npm run build") depois de mudar conteúdo em about/, projects/ ou experiences/.
window.SITE_CONTENT = ${JSON.stringify(content, null, 2)};
`;
    fs.writeFileSync(path.join(outDir, "content.js"), js);

    console.log(`[build] data/content.js gerado (${LANGS.join("/")}) com ${totalProjects} projeto(s) e ${totalExperiences} experiência(s).`);
}

build();
