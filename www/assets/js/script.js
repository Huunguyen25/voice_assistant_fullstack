/**
 * DOM SCRIPTS
 */

const textarea = document.querySelector(".chatbox");
const card = document.querySelector(".card");
textarea.addEventListener("input", e => {
    textarea.style.height = "42px";
    card.style.height = "auto";
    let scHeight = e.target.scrollHeight;
    textarea.style.height = `${scHeight}px`;
    card.style.height = `${scHeight}px`;
});

const settingsBtnContainer = document.getElementById("setting-button-container");
const panel = document.getElementById("settings-panel");
const closePanelBtn = document.getElementById("closePanelBtn");

settingsBtnContainer.addEventListener("click", () => {
    panel.style.display = panel.style.display === "flex" ? "none" : "flex";
});

closePanelBtn.addEventListener("click", () => {
    panel.style.display = "none";
});


// displaying the different settings sections
const prefSysWebButtons = document.querySelectorAll(".settings-buttons-division-container button");
const menuContainer = document.querySelector(".menu-container");
const settingsSections = document.querySelectorAll(".settings-section");

menuContainer.style.display = "none";
settingsSections.forEach(section => {
    section.style.display = "none";
});

prefSysWebButtons.forEach(button => {
    button.addEventListener("click", () => {
        menuContainer.style.display = "block";
        settingsSections.forEach(section => {
            section.style.display = "none";
        });
        const sectionToShow = document.getElementById(`${button.name}-section`);
        sectionToShow.style.display = "flex";
    });
});

closePanelBtn.addEventListener("click", () => {
    panel.style.display = "none";
    menuContainer.style.display = "none";
    settingsSections.forEach(section => {
        section.style.display = "none";
    });
});

//implement changing themes here

const themeSelect = document.getElementById("theme-select");
const html = document.documentElement; // The <html> element

// Function to apply theme
function applyTheme(theme) {
  if (theme === "system") {
    theme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }

  if (theme === "dark") {
    html.classList.add("dark");
  } else {
    html.classList.remove("dark");
  }
  localStorage.setItem("theme", theme); // Save preference
}

// Load theme from localStorage or system default
const savedTheme = localStorage.getItem("theme") || "system";
themeSelect.value = savedTheme;
applyTheme(savedTheme);

// Change theme when select value changes
themeSelect.addEventListener("change", () => {
  applyTheme(themeSelect.value);
});




//dynamically adjust the width of the theme select element to fit the text
const select = document.querySelector('select');
select.addEventListener('change', (event) => {
    let tempSelect = document.createElement('select'),
        tempOption = document.createElement('option');

    tempOption.textContent = event.target.options[event.target.selectedIndex].text;
    tempSelect.style.cssText += `
        visibility: hidden;
        position: fixed;
    `;
    tempSelect.appendChild(tempOption);
    event.target.after(tempSelect);

    const tempSelectWidth = tempSelect.getBoundingClientRect().width;
    event.target.style.width = `${tempSelectWidth}px`;
    tempSelect.remove();
});

let cards = document.querySelectorAll('.card');
cards.forEach(card => {
    card.onmousemove = function(e){
        const rect = card.getBoundingClientRect();
        let x = e.pageX - rect.left;
        let y = e.pageY - rect.top;
        
        card.style.setProperty('--x', x + 'px');
        card.style.setProperty('--y', y + 'px');
    }
});