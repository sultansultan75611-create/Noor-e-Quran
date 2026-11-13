const API = "https://api.alquran.cloud/v1";
const surahGrid = document.getElementById("surahGrid");
const searchInput = document.getElementById("searchInput");
const ayahList = document.getElementById("ayahList");
const readerTitle = document.getElementById("readerTitle");
const readerMeta = document.getElementById("readerMeta");
const translationSelect = document.getElementById("translationSelect");
const audioPlayer = document.getElementById("audioPlayer");
let allSurahs = [];
let selectedSurah = 0;
let arabicFontSize = 36;
let currentAyahs = [];

document.getElementById("year").textContent = new Date().getFullYear();

async function getJSON(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error("Network response was not successful.");
  const result = await response.json();
  if (result.code !== 200) throw new Error(result.status || "API error");
  return result.data;
}

function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove("show"), 2600);
}

function renderSurahs(list) {
  surahGrid.innerHTML = "";
  if (!list.length) {
    surahGrid.innerHTML = '<div class="loading-card">No Surah found. Try another search.</div>';
    return;
  }
  list.forEach(surah => {
    const card = document.createElement("button");
    card.type = "button";
    card.className = "surah-card" + (selectedSurah === surah.number ? " active" : "");
    card.innerHTML = `
      <span class="surah-number">${surah.number}</span>
      <span class="surah-info"><strong>${escapeHTML(surah.englishName)}</strong>
      <small>${surah.numberOfAyahs} Ayahs · ${surah.revelationType}</small></span>
      <span class="surah-arabic" lang="ar">${escapeHTML(surah.name)}</span>`;
    card.addEventListener("click", () => loadSurah(surah.number));
    surahGrid.appendChild(card);
  });
}

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, char => ({
    "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#039;"
  }[char]));
}

async function loadSurahs() {
  try {
    allSurahs = await getJSON(`${API}/surah`);
    renderSurahs(allSurahs);
  } catch (error) {
    surahGrid.innerHTML = '<div class="loading-card">Could not load Surahs. Check your internet connection and refresh.</div>';
    console.error(error);
  }
}

async function loadSurah(number) {
  selectedSurah = number;
  const translationEdition = translationSelect.value;
  readerTitle.textContent = "Loading…";
  readerMeta.textContent = "Fetching Quran text and translation.";
  ayahList.innerHTML = '<div class="empty-reader">Please wait…</div>';
  renderSurahs(allSurahs.filter(s => s.englishName.toLowerCase().includes(searchInput.value.toLowerCase()) || s.name.includes(searchInput.value) || String(s.number) === searchInput.value.trim()));

  try {
    const [arabic, translated] = await Promise.all([
      getJSON(`${API}/surah/${number}/quran-uthmani`),
      getJSON(`${API}/surah/${number}/${translationEdition}`)
    ]);
    const surah = arabic;
    currentAyahs = arabic.ayahs.map((ayah, index) => ({
      ...ayah,
      translation: translated.ayahs[index]?.text || "Translation unavailable"
    }));
    readerTitle.textContent = `${surah.englishName} (${surah.name})`;
    readerMeta.textContent = `${surah.englishNameTranslation} · ${surah.numberOfAyahs} Ayahs · ${surah.revelationType}`;
    renderAyahs();
    document.querySelectorAll(".surah-card").forEach(card => card.classList.toggle("active", Number(card.querySelector(".surah-number").textContent) === number));
    document.getElementById("prevSurah").disabled = number === 1;
    document.getElementById("nextSurah").disabled = number === 114;
    document.getElementById("reader").scrollIntoView({ behavior: "smooth", block: "start" });
  } catch (error) {
    readerTitle.textContent = "Unable to load Surah";
    readerMeta.textContent = "Please check your internet connection and try again.";
    ayahList.innerHTML = '<div class="empty-reader">The Quran service could not be reached. Please try again.</div>';
    console.error(error);
  }
}

function renderAyahs() {
  ayahList.innerHTML = "";
  currentAyahs.forEach((ayah, index) => {
    const card = document.createElement("article");
    card.className = "ayah-card";
    const audioUrl = `https://cdn.islamic.network/quran/audio/128/ar.alafasy/${ayah.number}.mp3`;
    card.innerHTML = `
      <div class="ayah-head">
        <span class="ayah-number">${ayah.numberInSurah}</span>
        <div class="ayah-actions">
          <button type="button" class="play-button" aria-label="Play ayah" title="Play recitation">▶</button>
          <button type="button" class="copy-button" aria-label="Copy ayah" title="Copy Arabic and translation">▢</button>
        </div>
      </div>
      <p class="arabic-text" lang="ar" style="font-size:${arabicFontSize}px">${escapeHTML(ayah.text)}</p>
      <p class="translation-text">${escapeHTML(ayah.translation)}</p>`;
    card.querySelector(".play-button").addEventListener("click", () => {
      audioPlayer.src = audioUrl;
      audioPlayer.play().catch(() => showToast("Audio could not start. Tap play again."));
    });
    card.querySelector(".copy-button").addEventListener("click", async () => {
      const text = `${ayah.text}\n\n${ayah.translation}`;
      try { await navigator.clipboard.writeText(text); showToast("Ayah copied."); }
      catch { showToast("Copy is not supported by this browser."); }
    });
    ayahList.appendChild(card);
  });
}

translationSelect.addEventListener("change", () => {
  if (selectedSurah) loadSurah(selectedSurah);
});
searchInput.addEventListener("input", () => {
  const term = searchInput.value.toLowerCase().trim();
  renderSurahs(allSurahs.filter(s =>
    s.englishName.toLowerCase().includes(term) ||
    s.englishNameTranslation.toLowerCase().includes(term) ||
    s.name.includes(term) || String(s.number) === term
  ));
});
document.getElementById("fontUp").addEventListener("click", () => {
  arabicFontSize = Math.min(54, arabicFontSize + 2);
  document.querySelectorAll(".arabic-text").forEach(el => el.style.fontSize = `${arabicFontSize}px`);
});
document.getElementById("fontDown").addEventListener("click", () => {
  arabicFontSize = Math.max(24, arabicFontSize - 2);
  document.querySelectorAll(".arabic-text").forEach(el => el.style.fontSize = `${arabicFontSize}px`);
});
document.getElementById("prevSurah").addEventListener("click", () => { if (selectedSurah > 1) loadSurah(selectedSurah - 1); });
document.getElementById("nextSurah").addEventListener("click", () => { if (selectedSurah < 114) loadSurah(selectedSurah + 1); });
document.getElementById("themeToggle").addEventListener("click", () => {
  document.body.classList.toggle("dark");
  localStorage.setItem("noor-theme", document.body.classList.contains("dark") ? "dark" : "light");
});
if (localStorage.getItem("noor-theme") === "dark") document.body.classList.add("dark");

loadSurahs();
