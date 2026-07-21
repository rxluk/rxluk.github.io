/**
 * i18n-strings.js
 * ---------------
 * Textos estáticos da interface (fora de about/projects/experiences, que já
 * são bilíngues via index-pt.md / index-en.md). Usado pelos atributos
 * data-i18n="chave" e data-i18n-html="chave" no index.html, aplicados por
 * applyI18nTo() em js/main.js.
 */
const UI_STRINGS = {
    pt: {
        "nav.about": "/sobre",
        "nav.experience": "/experiência",
        "nav.skills": "/habilidades",
        "nav.projects": "/projetos",
        "nav.certificates": "/certificações",

        "hero.badge": "Software, Hardware & Inteligência Artificial",
        "hero.title1": "Olá, tudo bem?",
        "hero.title2": "seja bem-vindo ao meu espaço de criação",
        "hero.quote": "\u201cConstruindo sistemas, experimentando hardware e aprendendo como a tecnologia funciona por trás dos panos.\u201d",
        "hero.btnProjects": "Ver Projetos",
        "hero.btnCV": "Download CV",

        "section.about.title": "Sobre Mim",
        "about.interestsLabel": "Núcleos de Interesse & Stack",

        "section.experience.title": "Histórico Profissional",

        "section.skills.title": "Caixa de Ferramentas",
        "section.skills.subtitle": "Organização funcional, sem barras de progresso ilusórias.",
        "skills.backend.title": "Backend & Arquitetura",
        "skills.data.title": "Dados & Mensageria",
        "skills.ai.title": "Inteligência Artificial",
        "skills.hardware.title": "Hardware & Maker",
        "skills.infra.title": "Infraestrutura",

        "section.projects.title": "Vitrine de Projetos",
        "section.projects.subtitle": "Aqui estão os sistemas e artefatos que construí. De código rodando na nuvem a engrenagens girando na mesa.",
        "projects.noImages": "sem imagens em",

        "section.certs.title": "Certificações",
        "section.certs.subtitle": "Validações oficiais de conhecimento técnico.",
        "certs.viewCredential": "Ver Credencial",
        "certs.item1.title": "Java COMPLETO: Programação Orientada a Objetos + Projetos",
        "certs.item1.issuer": "Udemy",
        "certs.item2.title": "Bootcamp Backend Java",
        "certs.item2.issuer": "Santander Universidades / DIO",
        "certs.item3.title": "PHP 7 Completo - Curso do Desenvolvedor Web + Projetos",
        "certs.item3.issuer": "Udemy",

        "section.bench.title": "Na Minha Bancada Agora",
        "section.bench.subtitle": "Tecnologias, arquiteturas e conceitos que estou explorando atualmente.",
        "bench.note1.title": "Arquitetura de Microsserviços",
        "bench.note1.body": "Aprofundando conceitos de sistemas distribuídos, comunicação entre serviços, mensageria e arquiteturas escaláveis.",
        "bench.note2.title": "Fundamentos de Inteligência Artificial",
        "bench.note2.body": "Estudando como modelos inteligentes funcionam de verdade, explorando redes neurais, algoritmos de aprendizado e os fundamentos por trás das LLMs.",
        "bench.note3.title": "Robótica & Visão Computacional",
        "bench.note3.body": "Construindo protótipos com Raspberry Pi, microcontroladores, sensores e OpenCV para conectar software ao mundo físico.",
        "bench.note4.title": "Impressão 3D & Prototipagem",
        "bench.note4.body": "Explorando fabricação digital, modelagem e prototipagem rápida para transformar ideias em objetos físicos.",

        "footer.quoteHtml": "\u201cConstruindo tecnologia que conecta <br class=\"hidden md:block\"/><span class=\"text-zinc-400\">software</span>, <span class=\"text-copper\">hardware</span> e <span class=\"text-olive-light\">inteligência</span>.\u201d",
        "footer.github": "GitHub",
        "footer.linkedin": "LinkedIn",
        "footer.email": "Email",
        "footer.copyright": "© 2024 Engenheiro de Software. Desenvolvido com código e café.",
        "footer.tagline": "Design inspirado em estúdios de engenharia.",
    },
    en: {
        "nav.about": "/about",
        "nav.experience": "/experience",
        "nav.skills": "/skills",
        "nav.projects": "/projects",
        "nav.certificates": "/certifications",

        "hero.badge": "Software, Hardware & Artificial Intelligence",
        "hero.title1": "Hello, welcome",
        "hero.title2": "to my creative space",
        "hero.quote": "\u201cBuilding systems, experimenting with hardware, and learning how technology works behind the scenes.\u201d",
        "hero.btnProjects": "View Projects",
        "hero.btnCV": "Download CV",

        "section.about.title": "About Me",
        "about.interestsLabel": "Interests & Stack",

        "section.experience.title": "Professional Background",

        "section.skills.title": "Toolbox",
        "section.skills.subtitle": "Functional organization, no illusory progress bars.",
        "skills.backend.title": "Backend & Architecture",
        "skills.data.title": "Data & Messaging",
        "skills.ai.title": "Artificial Intelligence",
        "skills.hardware.title": "Hardware & Maker",
        "skills.infra.title": "Infrastructure",

        "section.projects.title": "Project Showcase",
        "section.projects.subtitle": "Here are the systems and artifacts I've built. From code running in the cloud to gears spinning on the desk.",
        "projects.noImages": "no images in",

        "section.certs.title": "Certifications",
        "section.certs.subtitle": "Official validations of technical knowledge.",
        "certs.viewCredential": "View Credential",
        "certs.item1.title": "Java COMPLETE: Object-Oriented Programming + Projects",
        "certs.item1.issuer": "Udemy",
        "certs.item2.title": "Java Backend Bootcamp",
        "certs.item2.issuer": "Santander Universities / DIO",
        "certs.item3.title": "PHP 7 Complete - Web Developer Course + Projects",
        "certs.item3.issuer": "Udemy",

        "section.bench.title": "On My Workbench Right Now",
        "section.bench.subtitle": "Technologies, architectures and concepts I'm currently exploring.",
        "bench.note1.title": "Microservices Architecture",
        "bench.note1.body": "Deepening knowledge in distributed systems, service communication, messaging and scalable architectures.",
        "bench.note2.title": "Artificial Intelligence Foundations",
        "bench.note2.body": "Studying how intelligent models actually work, exploring neural networks, learning algorithms and the foundations behind LLMs.",
        "bench.note3.title": "Robotics & Computer Vision",
        "bench.note3.body": "Building prototypes with Raspberry Pi, microcontrollers, sensors and OpenCV to connect software with the physical world.",
        "bench.note4.title": "3D Printing & Prototyping",
        "bench.note4.body": "Exploring digital fabrication, modeling and rapid prototyping to turn ideas into physical objects.",

        "footer.quoteHtml": "\u201cBuilding technology that connects <br class=\"hidden md:block\"/><span class=\"text-zinc-400\">software</span>, <span class=\"text-copper\">hardware</span> and <span class=\"text-olive-light\">intelligence</span>.\u201d",
        "footer.github": "GitHub",
        "footer.linkedin": "LinkedIn",
        "footer.email": "Email",
        "footer.copyright": "© 2024 Software Engineer. Built with code and coffee.",
        "footer.tagline": "Design inspired by engineering studios.",
    },
};
