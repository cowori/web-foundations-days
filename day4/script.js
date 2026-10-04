const textarea = document.getElementById("note-text");
const charCount = document.getElementById("char-count");
const wordCount = document.getElementById("word-count");
const clearBtn = document.getElementById("clear-btn");
const themeToggle = document.getElementById("theme-toggle");

const DRAFT_KEY = "noteDraft";
const THEME_KEY = "theme";

function updateCounts() {
    const text = textarea.value;

    const characters = text.length;

    const words =
        text.trim() === ""
            ? 0
            : text.trim().split(/\s+/).length;

    charCount.textContent = `${characters} / 200 characters`;
    wordCount.textContent = `${words} words`;

    charCount.classList.remove("warning");
    charCount.classList.remove("over");

    if (characters > 200) {
        charCount.classList.add("over");
    } else if (characters > 180) {
        charCount.classList.add("warning");
    }
}

function clearNote() {
    textarea.value = "";
    localStorage.removeItem(DRAFT_KEY);
    updateCounts();
}

function updateThemeButton() {
    if (document.body.classList.contains("dark")) {
        themeToggle.textContent = "Light mode";
    } else {
        themeToggle.textContent = "Dark mode";
    }
}

const savedDraft = localStorage.getItem(DRAFT_KEY);

if (savedDraft) {
    textarea.value = savedDraft;
}

const savedTheme = localStorage.getItem(THEME_KEY);

if (savedTheme === "dark") {
    document.body.classList.add("dark");
}

updateThemeButton();

textarea.addEventListener("input", () => {
    updateCounts();
    localStorage.setItem(DRAFT_KEY, textarea.value);
});

clearBtn.addEventListener("click", () => {
    clearNote();
});

textarea.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        clearNote();
    }
});

themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark");

    if (document.body.classList.contains("dark")) {
        localStorage.setItem(THEME_KEY, "dark");
    } else {
        localStorage.setItem(THEME_KEY, "light");
    }

    updateThemeButton();
});

updateCounts();