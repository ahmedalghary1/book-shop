"use strict";

const dayCount = 15;
const storageKey = "prophetic-marketing:reading-days";
const displayNumber = new Intl.NumberFormat("ar-EG");
const days = document.querySelector("#study-days");
const countText = document.querySelector("#study-count");
const progress = document.querySelector("#study-progress");
const reset = document.querySelector("#reset-study");

function parseDays(value) {
  try {
    const parsed = JSON.parse(value);
    return new Set(Array.isArray(parsed)
      ? parsed.filter(day => Number.isInteger(day) && day >= 1 && day <= dayCount)
      : []);
  } catch {
    return new Set();
  }
}

function loadDays() {
  try {
    return parseDays(localStorage.getItem(storageKey));
  } catch {
    return new Set();
  }
}

const checkboxes = Array.from({ length: dayCount }, (_, index) => {
  const day = index + 1;
  const label = document.createElement("label");
  label.className = "day";

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.value = day;
  const number = displayNumber.format(day);
  checkbox.setAttribute("aria-label", `اليوم ${number}`);
  label.append(checkbox, number);
  days.append(label);

  return checkbox;
});

function renderDays(completed) {
  checkboxes.forEach(checkbox => {
    checkbox.checked = completed.has(Number(checkbox.value));
  });
  progress.value = completed.size;
  countText.textContent = `أكملت ${displayNumber.format(completed.size)} من ١٥ يومًا`;
  reset.disabled = completed.size === 0;
}

let completedDays = loadDays();
renderDays(completedDays);

function saveDays() {
  try {
    localStorage.setItem(storageKey, JSON.stringify([...completedDays]));
  } catch {
    // The progress stays available for the current page if storage is blocked.
  }
  renderDays(completedDays);
}

days.addEventListener("change", event => {
  const day = Number(event.target.value);
  if (event.target.checked) {
    completedDays.add(day);
  } else {
    completedDays.delete(day);
  }
  saveDays();
});

reset.addEventListener("click", () => {
  completedDays.clear();
  saveDays();
  checkboxes[0].focus();
});

window.addEventListener("storage", event => {
  if (event.key === storageKey || event.key === null) {
    completedDays = parseDays(event.newValue);
    renderDays(completedDays);
  }
});

const copy = document.querySelector("#copy-phone");
const phone = document.querySelector("#payment-phone");
const copyFeedback = document.querySelector("#copy-feedback");

copy.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(phone.textContent.trim());
    copyFeedback.textContent = "تم نسخ رقم فودافون كاش.";
  } catch {
    const range = document.createRange();
    range.selectNodeContents(phone);
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
    copyFeedback.textContent = "الرقم محدد. انسخه من قائمة النسخ على جهازك.";
  }
});

const menu = document.querySelector(".mobile-nav");
menu.querySelectorAll("a").forEach(link => {
  link.addEventListener("click", () => {
    menu.open = false;
  });
});
menu.addEventListener("keydown", event => {
  if (event.key === "Escape" && menu.open) {
    menu.open = false;
    menu.querySelector("summary").focus();
  }
});
