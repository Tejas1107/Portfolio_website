/* JavaScript Logic for Tejas Pantharapalya Venkatesh Portfolio */

// Default data for reset and initial load
const DEFAULT_RESUME_DATA = {
    name: "Tejas Pantharapalya Venkatesh",
    title: "AI Engineer • Integration Specialist • MSc CS Candidate",
    email: "tejasvenkatesh1107@gmail.com",
    phone: "+353 894693056",
    location: "Dublin, Ireland",
    bio: "Integration specialist with 3+ years of experience delivering enterprise solutions across Oracle Cloud, now expanding into applied AI engineering through RAG systems, Azure OpenAI integrations, and document intelligence workflows for a regulatory-compliance platform."
};

// Full list of skills with categories and metadata
const SKILLS_DATA = [
    // Integration & Architecture
    { id: "OIC", name: "Oracle Integration Cloud (OIC)", category: "integration", hasSpec: true },
    { id: "REST APIs", name: "REST APIs", category: "integration", hasSpec: true },
    { id: "SOAP APIs", name: "SOAP APIs", category: "integration", hasSpec: true },
    { id: "API Design", name: "API Design", category: "integration", hasSpec: true },
    { id: "Middleware Design", name: "Middleware Design", category: "integration", hasSpec: true },
    { id: "Enterprise Data Flow Architecture", name: "Enterprise Data Flow Architecture", category: "integration", hasSpec: false },
    { id: "As-is/to-be Process Analysis", name: "As-is/to-be Process Analysis", category: "integration", hasSpec: false },
    { id: "FBDI", name: "FBDI", category: "integration", hasSpec: true },
    { id: "SIT/UAT", name: "SIT/UAT", category: "integration", hasSpec: true },
    { id: "Postman", name: "Postman", category: "integration", hasSpec: false },
    { id: "SOAP UI", name: "SOAP UI", category: "integration", hasSpec: false },
    { id: "Integration Testing & Validation", name: "Integration Testing & Validation", category: "integration", hasSpec: false },

    // Development & Engineering
    { id: "Java", name: "Java", category: "dev", hasSpec: true },
    { id: "Python", name: "Python", category: "dev", hasSpec: true },
    { id: "Flask", name: "Flask", category: "dev", hasSpec: false },
    { id: "React", name: "React", category: "dev", hasSpec: false },
    { id: "TypeScript", name: "TypeScript", category: "dev", hasSpec: false },
    { id: "Express", name: "Express", category: "dev", hasSpec: false },
    { id: "Prisma", name: "Prisma", category: "dev", hasSpec: false },
    { id: "FastAPI", name: "FastAPI", category: "dev", hasSpec: false },
    { id: "Azure OpenAI", name: "Azure OpenAI", category: "dev", hasSpec: true },
    { id: "RAG", name: "RAG", category: "dev", hasSpec: true },
    { id: "Azure Cognitive Search", name: "Azure Cognitive Search", category: "dev", hasSpec: true },
    { id: "Azure Document Intelligence", name: "Azure Document Intelligence", category: "dev", hasSpec: true },
    { id: "Prompt Engineering", name: "Prompt Engineering", category: "dev", hasSpec: false },
    { id: ".NET", name: ".NET", category: "dev", hasSpec: false },
    { id: "Azure Service Bus", name: "Azure Service Bus", category: "dev", hasSpec: false },
    { id: "RabbitMQ", name: "RabbitMQ", category: "dev", hasSpec: false },
    { id: "Docker", name: "Docker", category: "dev", hasSpec: true },
    { id: "Docker Compose", name: "Docker Compose", category: "dev", hasSpec: false },
    { id: "Kubernetes", name: "Kubernetes", category: "dev", hasSpec: false },

    // Databases & ML
    { id: "PostgreSQL", name: "PostgreSQL", category: "database", hasSpec: true },
    { id: "SQL", name: "SQL", category: "database", hasSpec: true },
    { id: "Databases", name: "Databases", category: "database", hasSpec: true },
    { id: "scikit-learn", name: "scikit-learn", category: "database", hasSpec: false },
    { id: "sentence-transformers", name: "sentence-transformers", category: "database", hasSpec: false },
    { id: "ONNX Runtime", name: "ONNX Runtime", category: "database", hasSpec: false },

    // Consulting & Soft Skills
    { id: "Error Hospital", name: "Error Hospital Management", category: "consulting", hasSpec: false }
];

// Recruiter Fit Calculator Preset Configurations
const ROLE_PRESETS = {
    integration: {
        name: "AI & Integration Engineer",
        desc: "Enterprise system connections, AI copilots, and modern cloud architectures.",
        skills: ["OIC", "REST APIs", "API Design", "Middleware Design", "Azure OpenAI", "RAG", "PostgreSQL", "SQL", "Java", "Docker", "SIT/UAT", "SOAP APIs"]
    },
    fullstack: {
        name: "Fullstack / Software Developer",
        desc: "Responsive UIs, full-stack AI experiences, and containerized microservices.",
        skills: ["Java", "React", "TypeScript", "Express", "Prisma", "Azure OpenAI", "RAG", "Python", "Flask", "PostgreSQL", "SQL", "Docker"]
    },
    data: {
        name: "Data & Machine Learning Engineer",
        desc: "Data pipelines, predictive algorithms, and AI model deployments.",
        skills: ["Python", "SQL", "Databases", "Azure OpenAI", "RAG", "scikit-learn", "sentence-transformers", "ONNX Runtime", "PostgreSQL"]
    },
    custom: {
        name: "Custom Tech Vacancy",
        desc: "Check specific skills to evaluate alignment.",
        skills: [] // User checked
    }
};

// Global State
let activeSkillsToHighlight = new Set();
let currentCustomSkills = new Set();
let activePreset = "integration";

document.addEventListener("DOMContentLoaded", () => {
    initResumeCustomizer();
    renderSkillsMatrix();
    initSkillMatrixEvents();
    initCalculatorEvents();
    initProjectEvents();
    initSpeedDial();
    updateCalculator(); // Run initial calculation
});

/* ==========================================================================
   Resume Customizer Engine
   ========================================================================== */
function initResumeCustomizer() {
    const btnOpen = document.getElementById("btn-open-customizer");
    const btnClose = document.getElementById("btn-close-customizer");
    const btnSave = document.getElementById("btn-save-customizer");
    const btnReset = document.getElementById("btn-reset-customizer");
    const btnPrint = document.getElementById("btn-print");
    const drawer = document.getElementById("customizer-drawer");
    const overlay = document.getElementById("customizer-overlay");

    // Load initial data
    loadResumeData();

    // Drawer toggles
    btnOpen.addEventListener("click", () => {
        populateCustomizerForm();
        drawer.classList.add("open");
        overlay.classList.add("active");
    });

    const closeDrawer = () => {
        drawer.classList.remove("open");
        overlay.classList.remove("active");
    };

    btnClose.addEventListener("click", closeDrawer);
    overlay.addEventListener("click", closeDrawer);

    // Save & Reset actions
    btnSave.addEventListener("click", () => {
        const newData = {
            name: document.getElementById("cust-name").value.trim(),
            title: document.getElementById("cust-title").value.trim(),
            email: document.getElementById("cust-email").value.trim(),
            phone: document.getElementById("cust-phone").value.trim(),
            location: document.getElementById("cust-location").value.trim(),
            bio: document.getElementById("cust-bio").value.trim()
        };
        localStorage.setItem("resume_data", JSON.stringify(newData));
        loadResumeData();
        closeDrawer();
        showToast("Resume data saved successfully!", "success");
    });

    btnReset.addEventListener("click", () => {
        localStorage.removeItem("resume_data");
        loadResumeData();
        populateCustomizerForm();
        closeDrawer();
        showToast("Resume restored to default values.", "success");
    });

    // Resume PDF Button
    btnPrint.addEventListener("click", () => {
        window.open("Tejas_P_Venkatesh_CV.pdf", "_blank", "noopener,noreferrer");
    });
}

function loadResumeData() {
    const stored = localStorage.getItem("resume_data");
    const data = stored ? JSON.parse(stored) : DEFAULT_RESUME_DATA;

    // Update Screen elements
    document.getElementById("resume-name").textContent = data.name;
    document.getElementById("resume-title").textContent = data.title;
    document.getElementById("resume-email").textContent = data.email;
    document.getElementById("resume-phone").textContent = data.phone;
    document.getElementById("resume-location").textContent = data.location;
    document.getElementById("resume-bio").textContent = data.bio;

    // Update Print elements
    document.getElementById("print-name").textContent = data.name;
    document.getElementById("print-title").textContent = data.title;
    document.getElementById("print-email").textContent = `Email: ${data.email}`;
    document.getElementById("print-phone").textContent = `Phone: ${data.phone}`;
    document.getElementById("print-location").textContent = `Location: ${data.location}`;
}

function populateCustomizerForm() {
    const stored = localStorage.getItem("resume_data");
    const data = stored ? JSON.parse(stored) : DEFAULT_RESUME_DATA;

    document.getElementById("cust-name").value = data.name;
    document.getElementById("cust-title").value = data.title;
    document.getElementById("cust-email").value = data.email;
    document.getElementById("cust-phone").value = data.phone;
    document.getElementById("cust-location").value = data.location;
    document.getElementById("cust-bio").value = data.bio;
}

/* ==========================================================================
   Skill Core Matrix Engine
   ========================================================================== */
function renderSkillsMatrix(filterCategory = "all", searchQuery = "") {
    const container = document.getElementById("skills-matrix-grid");
    container.innerHTML = "";

    const query = searchQuery.toLowerCase().trim();

    SKILLS_DATA.forEach(skill => {
        // Apply category filter
        if (filterCategory !== "all" && skill.category !== filterCategory) {
            return;
        }

        // Apply search query
        if (query !== "" && !skill.name.toLowerCase().includes(query)) {
            return;
        }

        const tag = document.createElement("div");
        tag.className = "skill-tag";
        tag.dataset.skillId = skill.id;
        if (activeSkillsToHighlight.has(skill.id)) {
            tag.classList.add("active");
        }

        // Star key milestones, bullet regular skills
        const indicator = skill.hasSpec ? "★" : "●";
        const indicatorClass = skill.hasSpec ? "target-skill-star" : "target-skill-bullet";
        
        tag.innerHTML = `<span class="${indicatorClass}">${indicator}</span> ${skill.name}`;
        
        container.appendChild(tag);
    });
}

function initSkillMatrixEvents() {
    const filterButtons = document.querySelectorAll(".matrix-filter-btn[data-filter]");
    const searchInput = document.getElementById("skill-search");

    // Filter clicks
    filterButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            filterButtons.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            renderSkillsMatrix(btn.dataset.filter, searchInput.value);
        });
    });

    // Search input
    searchInput.addEventListener("input", () => {
        const activeFilterBtn = document.querySelector(".matrix-filter-btn[data-filter].active");
        renderSkillsMatrix(activeFilterBtn.dataset.filter, searchInput.value);
    });

    // Skill highlight toggling (delegated click listener)
    document.getElementById("skills-matrix-grid").addEventListener("click", (e) => {
        const tag = e.target.closest(".skill-tag");
        if (!tag) return;

        const skillId = tag.dataset.skillId;
        
        if (activeSkillsToHighlight.has(skillId)) {
            activeSkillsToHighlight.delete(skillId);
            tag.classList.remove("active");
        } else {
            activeSkillsToHighlight.add(skillId);
            tag.classList.add("active");
        }

        applySkillsHighlighting();
    });
}

function applySkillsHighlighting() {
    const milestones = document.querySelectorAll(".experience-milestone");
    const projects = document.querySelectorAll(".project-card");
    const badges = document.querySelectorAll(".skill-badge[data-skill-ref]");

    // Reset highlights
    milestones.forEach(m => m.classList.remove("active-highlight"));
    projects.forEach(p => p.classList.remove("active-highlight"));
    badges.forEach(b => b.classList.remove("active-highlight"));

    if (activeSkillsToHighlight.size === 0) return;

    // Highlight badges matching active skills
    badges.forEach(badge => {
        const ref = badge.dataset.skillRef;
        if (activeSkillsToHighlight.has(ref)) {
            badge.classList.add("active-highlight");
        }
    });

    // Highlight experience milestones if any of their skills match
    milestones.forEach(m => {
        const skillsAttr = m.dataset.skills;
        if (!skillsAttr) return;
        const skillsList = skillsAttr.split(",");
        const hasIntersection = skillsList.some(s => activeSkillsToHighlight.has(s.trim()));
        if (hasIntersection) {
            m.classList.add("active-highlight");
        }
    });

    // Highlight projects if any of their skills match
    projects.forEach(p => {
        const skillsAttr = p.dataset.skills;
        if (!skillsAttr) return;
        const skillsList = skillsAttr.split(",");
        const hasIntersection = skillsList.some(s => activeSkillsToHighlight.has(s.trim()));
        if (hasIntersection) {
            p.classList.add("active-highlight");
        }
    });
}

/* ==========================================================================
   Recruiter Fit Calculator Engine
   ========================================================================== */
function initCalculatorEvents() {
    const presetChips = document.querySelectorAll(".preset-chip");
    const outreachCompany = document.getElementById("outreach-company");
    const outreachRecruiter = document.getElementById("outreach-recruiter");
    const btnCopy = document.getElementById("btn-copy-pitch");

    presetChips.forEach(chip => {
        chip.addEventListener("click", () => {
            presetChips.forEach(c => c.classList.remove("active"));
            chip.classList.add("active");
            activePreset = chip.dataset.role;
            updateCalculator();
        });
    });

    // Setup input listeners to refresh pitch
    outreachCompany.addEventListener("input", updatePitchEmail);
    outreachRecruiter.addEventListener("input", updatePitchEmail);

    // Copy Pitch button click
    btnCopy.addEventListener("click", () => {
        const pitchText = document.getElementById("pitch-preview").textContent;
        navigator.clipboard.writeText(pitchText).then(() => {
            showToast("Tailored pitch email copied to clipboard!", "success");
        }).catch(err => {
            showToast("Failed to copy text. Please select and copy manually.", "error");
        });
    });
}

function updateCalculator() {
    const skillsContainer = document.getElementById("calc-skills-container");
    skillsContainer.innerHTML = "";

    const preset = ROLE_PRESETS[activePreset];
    const isCustom = activePreset === "custom";

    if (!isCustom) {
        // Load preset skills
        preset.skills.forEach(skillId => {
            const skillObj = SKILLS_DATA.find(s => s.id === skillId);
            if (!skillObj) return;

            const item = document.createElement("div");
            item.className = "target-skill-item checked"; // Defaults checked for preset
            
            const bullet = skillObj.hasSpec ? "★" : "●";
            const bulletClass = skillObj.hasSpec ? "target-skill-star" : "target-skill-bullet";
            
            item.innerHTML = `
                <div class="target-skill-checkbox"></div>
                <span class="${bulletClass}">${bullet}</span>
                <span>${skillObj.name}</span>
            `;
            skillsContainer.appendChild(item);
        });

        calculateAndDisplayScore(100); // Preset roles are 100% matched by default
    } else {
        // Custom filter: list ALL skills with interactive checkboxes
        SKILLS_DATA.forEach(skillObj => {
            const isChecked = currentCustomSkills.has(skillObj.id);
            const item = document.createElement("div");
            item.className = `target-skill-item ${isChecked ? "checked" : ""}`;
            item.dataset.skillId = skillObj.id;

            const bullet = skillObj.hasSpec ? "★" : "●";
            const bulletClass = skillObj.hasSpec ? "target-skill-star" : "target-skill-bullet";

            item.innerHTML = `
                <div class="target-skill-checkbox"></div>
                <span class="${bulletClass}">${bullet}</span>
                <span>${skillObj.name}</span>
            `;

            // Toggle custom check
            item.addEventListener("click", () => {
                if (currentCustomSkills.has(skillObj.id)) {
                    currentCustomSkills.delete(skillObj.id);
                    item.classList.remove("checked");
                } else {
                    currentCustomSkills.add(skillObj.id);
                    item.classList.add("checked");
                }
                recalculateCustomScore();
            });

            skillsContainer.appendChild(item);
        });

        // Let's add 3 "bonus/unmatched" skills that Tejas doesn't have, to show realistic matches
        const bonusSkills = [
            { id: "AWS", name: "Amazon Web Services (AWS)", hasSpec: true },
            { id: "Salesforce", name: "Salesforce Integration (MuleSoft)", hasSpec: false },
            { id: "Spring", name: "Java Spring Boot Microservices", hasSpec: true }
        ];

        bonusSkills.forEach(skillObj => {
            const isChecked = currentCustomSkills.has(skillObj.id);
            const item = document.createElement("div");
            item.className = `target-skill-item unmatched-bonus ${isChecked ? "checked" : ""}`;
            item.dataset.skillId = skillObj.id;
            
            const bullet = skillObj.hasSpec ? "★" : "●";
            const bulletClass = skillObj.hasSpec ? "target-skill-star" : "target-skill-bullet";

            item.innerHTML = `
                <div class="target-skill-checkbox"></div>
                <span class="${bulletClass}" style="color: var(--accent-indigo);">${bullet}</span>
                <span style="opacity: 0.7;">[Bonus] ${skillObj.name}</span>
            `;

            item.addEventListener("click", () => {
                if (currentCustomSkills.has(skillObj.id)) {
                    currentCustomSkills.delete(skillObj.id);
                    item.classList.remove("checked");
                } else {
                    currentCustomSkills.add(skillObj.id);
                    item.classList.add("checked");
                }
                recalculateCustomScore();
            });

            skillsContainer.appendChild(item);
        });

        recalculateCustomScore();
    }

    updatePitchEmail();
}

function recalculateCustomScore() {
    if (currentCustomSkills.size === 0) {
        calculateAndDisplayScore(0);
        return;
    }

    const matchedChecked = Array.from(currentCustomSkills).filter(id => {
        // Tejas has all skills in SKILLS_DATA, but not in bonus list (AWS, Salesforce, Spring)
        const isTejasSkill = SKILLS_DATA.some(s => s.id === id);
        return isTejasSkill;
    });

    const score = Math.round((matchedChecked.length / currentCustomSkills.size) * 100);
    calculateAndDisplayScore(score);
}

function calculateAndDisplayScore(score) {
    const scoreText = document.getElementById("calc-score");
    const scoreRating = document.getElementById("calc-rating");
    const scoreDesc = document.getElementById("calc-desc");
    const gaugeBar = document.getElementById("calc-gauge");

    // Animate score text counter
    let currentCount = 0;
    scoreText.textContent = `${score}%`;

    // SVG gauge circle logic: r=26 -> C=163.36
    const circumference = 163.36;
    const offset = circumference - (score / 100) * circumference;
    gaugeBar.style.strokeDashoffset = offset;

    // Color gradient for gauge bar based on score
    if (score >= 90) {
        gaugeBar.style.stroke = "var(--accent-emerald)";
        scoreRating.textContent = "🔥 Exceptional Alignment";
        scoreRating.style.color = "var(--accent-emerald)";
        scoreDesc.textContent = "Meets key professional role milestones.";
    } else if (score >= 70) {
        gaugeBar.style.stroke = "var(--accent-cyan)";
        scoreRating.textContent = "⭐ Strong Match";
        scoreRating.style.color = "var(--accent-cyan)";
        scoreDesc.textContent = "Great foundation with major core competencies.";
    } else if (score >= 50) {
        gaugeBar.style.stroke = "var(--accent-indigo)";
        scoreRating.textContent = "⚡ Good Fit";
        scoreRating.style.color = "var(--accent-indigo)";
        scoreDesc.textContent = "Aligns well. Missing a few secondary details.";
    } else {
        gaugeBar.style.stroke = "var(--accent-purple)";
        scoreRating.textContent = "📋 Potential Match / Discuss";
        scoreRating.style.color = "var(--accent-purple)";
        scoreDesc.textContent = "Select tech stacks to view alignment score.";
    }
}

function updatePitchEmail() {
    const preview = document.getElementById("pitch-preview");
    const company = document.getElementById("outreach-company").value || "[Company Name]";
    const recruiter = document.getElementById("outreach-recruiter").value || "[Your Name]";
    const scoreText = document.getElementById("calc-score").textContent;

    let roleName = ROLE_PRESETS[activePreset].name;
    let skillList = "";

    if (activePreset !== "custom") {
        // Preset skills
        skillList = ROLE_PRESETS[activePreset].skills.slice(0, 4).join(", ") + " and details";
    } else {
        // Custom skills
        const checkedList = Array.from(currentCustomSkills).slice(0, 4);
        skillList = checkedList.length > 0 ? checkedList.join(", ") : "Integration systems";
    }

    const template = `Hi Tejas,

I'm ${recruiter} from ${company}. We are recruiting for a ${roleName} and were very impressed by your integration capabilities.

Our target stack evaluates to a ${scoreText} Fit Score with your experience, specifically in ${skillList}. We are keen to explore your MSc profile at UCD.

I'd love to schedule a brief introductory call. Let me know if you are open to discuss.

Best regards,
${recruiter}`;

    preview.textContent = template;
}

/* ==========================================================================
   Projects and Architecture Topologies
   ========================================================================== */
function initProjectEvents() {
    // Topology Expand/Collapse
    const toggleBtns = document.querySelectorAll(".topology-toggle-btn");
    toggleBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            const targetId = btn.dataset.target;
            const panel = document.getElementById(targetId);
            
            if (panel.style.display === "block") {
                panel.style.display = "none";
                btn.classList.remove("expanded");
                btn.innerHTML = `
                    <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2.5" fill="none"><polyline points="6 9 12 15 18 9"/></svg>
                    Show System Topology Outline
                `;
            } else {
                panel.style.display = "block";
                btn.classList.add("expanded");
                btn.innerHTML = `
                    <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2.5" fill="none"><polyline points="18 15 12 9 6 15"/></svg>
                    Hide System Topology Outline
                `;
            }
        });
    });

    // Project filters
    const filterBtns = document.querySelectorAll(".matrix-filter-btn[data-proj-filter]");
    const projects = document.querySelectorAll(".project-card");

    filterBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            filterBtns.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            
            const filterVal = btn.getAttribute("data-proj-filter");

            projects.forEach(p => {
                if (filterVal === "all") {
                    p.style.display = "block";
                } else {
                    const categories = p.getAttribute("data-proj-cat").split(",");
                    if (categories.includes(filterVal)) {
                        p.style.display = "block";
                    } else {
                        p.style.display = "none";
                    }
                }
            });
        });
    });
}

/* ==========================================================================
   Recruiter Speed Dial & Scheduling
   ========================================================================== */
function initSpeedDial() {
    const form = document.getElementById("speed-dial-form");
    const btnSubmit = document.getElementById("btn-speed-dial");

    btnSubmit.addEventListener("click", (e) => {
        e.preventDefault();

        const date = document.getElementById("dial-date").value.trim() || "Next Tuesday";
        const category = document.getElementById("dial-category").value;
        const proposal = document.getElementById("dial-proposal").value.trim() || "Discussing project details";
        const recruiter = document.getElementById("outreach-recruiter").value || "Recruiter";

        if (!date) {
            showToast("Please suggest a target date/week.", "error");
            return;
        }

        // Trigger native mailto composer
        const subject = encodeURIComponent(`Interview Proposal: ${category}`);
        const emailBody = encodeURIComponent(`Hi Tejas,\n\nThis is ${recruiter}. We would love to schedule a technical screening or review meeting regarding a ${category} role with us.\n\nProposed Time: ${date}\n\nProposal Details: ${proposal}\n\nLooking forward to hearing from you!\n\nBest,\n${recruiter}`);
        
        window.location.href = `mailto:tejasvenkatesh1107@gmail.com?subject=${subject}&body=${emailBody}`;
        
        showToast("Simulated Email Pitch prepared! Opening mail client...", "success");
    });
}

/* ==========================================================================
   Toast Notifications Utility
   ========================================================================== */
function showToast(message, type = "success") {
    const container = document.getElementById("toast-container");
    
    const toast = document.createElement("div");
    toast.className = `toast ${type}`;
    
    const icon = type === "success" 
        ? `<svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2.5" fill="none"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>`
        : `<svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2.5" fill="none"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`;

    toast.innerHTML = `${icon} <span>${message}</span>`;
    container.appendChild(toast);

    // Auto remove after 3.5s
    setTimeout(() => {
        toast.style.animation = "toast-in 0.3s cubic-bezier(0.16, 1, 0.3, 1) reverse forwards";
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 3200);
}
