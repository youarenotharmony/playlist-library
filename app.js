(() => {
  "use strict";

  const STORAGE_KEYS = {
    state: "input-atlas.item-state.v1",
    preferences: "input-atlas.preferences.v1"
  };

  const DEFAULT_PREFERENCES = {
    theme: "light",
    view: "all",
    level: "all",
    accent: "all",
    sort: "duration-desc"
  };

  const VALID_VIEWS = new Set(["all", "favorites", "watched", "hidden"]);
  const LEVEL_ORDER = { A1: 1, A2: 2, B1: 3, "Intermediate": 4 };
  const ACCENT_SUGGESTIONS = ["American", "British", "Australian", "Canadian", "Irish"];

  const elements = {
    rows: document.getElementById("playlistRows"),
    emptyState: document.getElementById("emptyState"),
    search: document.getElementById("searchInput"),
    clearSearch: document.getElementById("clearSearchButton"),
    level: document.getElementById("levelFilter"),
    accent: document.getElementById("accentFilter"),
    sort: document.getElementById("sortSelect"),
    resultCount: document.getElementById("resultCount"),
    resultWord: document.getElementById("resultWord"),
    countAll: document.getElementById("countAll"),
    countFavorites: document.getElementById("countFavorites"),
    countWatched: document.getElementById("countWatched"),
    countHidden: document.getElementById("countHidden"),
    themeButton: document.getElementById("themeButton"),
    resetFilters: document.getElementById("resetFiltersButton"),
    emptyReset: document.getElementById("emptyResetButton"),
    toast: document.getElementById("toast")
  };

  const rawPlaylists = Array.isArray(window.PLAYLISTS) ? window.PLAYLISTS : [];
  const playlists = rawPlaylists.filter(isUsablePlaylist).map(normalizePlaylist);
  let itemState = readStorage(STORAGE_KEYS.state, {});
  let preferences = { ...DEFAULT_PREFERENCES, ...readStorage(STORAGE_KEYS.preferences, {}) };
  let toastTimer = 0;

  function isUsablePlaylist(item) {
    return Boolean(item && item.title && item.url);
  }

  function normalizePlaylist(item) {
    const videoCount = item.videoCount === null || item.videoCount === undefined || item.videoCount === ""
      ? null
      : Math.max(0, Math.round(Number(item.videoCount) || 0));

    return {
      id: String(item.id || `playlist-${hashString(item.url)}`),
      title: String(item.title),
      url: String(item.url),
      level: String(item.level || "B1-B2"),
      durationHours: nonNegativeNumber(item.durationHours),
      videoCount,
      accent: item.accent ? String(item.accent).trim() : null,
      avatar: item.avatar ? String(item.avatar).trim() : "",
      notes: item.notes ? String(item.notes).trim() : ""
    };
  }

  function nonNegativeNumber(value) {
    const number = Number(value);
    return Number.isFinite(number) ? Math.max(0, number) : 0;
  }

  function readStorage(key, fallback) {
    try {
      const value = localStorage.getItem(key);
      return value ? JSON.parse(value) : fallback;
    } catch (error) {
      console.warn(`Не удалось прочитать ${key}`, error);
      return fallback;
    }
  }

  function writeStorage(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.warn(`Не удалось сохранить ${key}`, error);
    }
  }

  function getItemState(id) {
    return { favorite: false, watched: false, hidden: false, ...(itemState[id] || {}) };
  }

  function updateItemState(id, patch) {
    itemState[id] = { ...getItemState(id), ...patch };
    writeStorage(STORAGE_KEYS.state, itemState);
  }

  function savePreferences() {
    writeStorage(STORAGE_KEYS.preferences, preferences);
  }

  function setTheme(theme) {
    preferences.theme = theme === "dark" ? "dark" : "light";
    document.documentElement.dataset.theme = preferences.theme;
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.content = preferences.theme === "dark" ? "#17151b" : "#f7f6fa";
    savePreferences();
  }

  function populateFilterOptions() {
    const levels = [...new Set(playlists.map((item) => item.level))]
      .sort((a, b) => (LEVEL_ORDER[a] ?? 99) - (LEVEL_ORDER[b] ?? 99) || a.localeCompare(b, "en"));
    elements.level.innerHTML = '<option value="all">Все уровни</option>' + levels
      .map((level) => `<option value="${escapeAttribute(level)}">${escapeHTML(level)}</option>`)
      .join("");

    const accents = [...new Set([...ACCENT_SUGGESTIONS, ...playlists.map((item) => item.accent).filter(Boolean)])]
      .sort((a, b) => a.localeCompare(b, "en"));
    elements.accent.innerHTML = [
      '<option value="all">Все акценты</option>',
      ...accents.map((accent) => `<option value="${escapeAttribute(accent)}">${escapeHTML(accent)}</option>`)
    ].join("");
  }

  function applyPreferences() {
    preferences.view = VALID_VIEWS.has(preferences.view) ? preferences.view : "all";
    preferences.level = [...elements.level.options].some((option) => option.value === preferences.level) ? preferences.level : "all";
    preferences.accent = [...elements.accent.options].some((option) => option.value === preferences.accent) ? preferences.accent : "all";
    preferences.sort = [...elements.sort.options].some((option) => option.value === preferences.sort) ? preferences.sort : "duration-desc";

    elements.level.value = preferences.level;
    elements.accent.value = preferences.accent;
    elements.sort.value = preferences.sort;
  }

  function getVisiblePlaylists() {
    const query = normalizeSearch(elements.search.value);
    const selectedLevel = elements.level.value;
    const selectedAccent = elements.accent.value;

    const filtered = playlists.filter((item) => {
      const state = getItemState(item.id);

      if (preferences.view === "hidden") {
        if (!state.hidden) return false;
      } else if (state.hidden) {
        return false;
      }

      if (preferences.view === "favorites" && !state.favorite) return false;
      if (preferences.view === "watched" && !state.watched) return false;
      if (selectedLevel !== "all" && item.level !== selectedLevel) return false;
      if (selectedAccent === "unknown" && item.accent) return false;
      if (selectedAccent !== "all" && selectedAccent !== "unknown" && item.accent !== selectedAccent) return false;

      if (query) {
        const searchable = normalizeSearch([item.title, item.level, item.accent || "", item.notes].join(" "));
        if (!searchable.includes(query)) return false;
      }

      return true;
    });

    return sortPlaylists(filtered, elements.sort.value);
  }

  function sortPlaylists(items, sortMode) {
    return [...items].sort((a, b) => {
      switch (sortMode) {
        case "duration-asc": return a.durationHours - b.durationHours || compareTitle(a, b);
        case "title-asc": return compareTitle(a, b);
        case "title-desc": return compareTitle(b, a);
        case "videos-desc": return compareVideoCounts(a, b, "desc") || compareTitle(a, b);
        case "videos-asc": return compareVideoCounts(a, b, "asc") || compareTitle(a, b);
        case "level-asc": return (LEVEL_ORDER[a.level] ?? 99) - (LEVEL_ORDER[b.level] ?? 99) || b.durationHours - a.durationHours || compareTitle(a, b);
        case "duration-desc":
        default: return b.durationHours - a.durationHours || compareTitle(a, b);
      }
    });
  }

  function compareTitle(a, b) {
    return a.title.localeCompare(b.title, "en", { sensitivity: "base" });
  }

  function compareVideoCounts(a, b, direction) {
    const aMissing = a.videoCount === null;
    const bMissing = b.videoCount === null;
    if (aMissing && bMissing) return 0;
    if (aMissing) return 1;
    if (bMissing) return -1;
    return direction === "asc" ? a.videoCount - b.videoCount : b.videoCount - a.videoCount;
  }

  function render() {
    const visible = getVisiblePlaylists();
    elements.rows.innerHTML = visible.map(renderRow).join("");
    elements.emptyState.hidden = visible.length !== 0;
    elements.resultCount.textContent = formatNumber(visible.length);
    elements.resultWord.textContent = pluralizePlaylist(visible.length);
    elements.clearSearch.closest(".search-control").classList.toggle("has-value", elements.search.value.length > 0);
    renderViewTabs();
  }

  function renderRow(item) {
    const state = getItemState(item.id);
    const avatarTone = parseInt(hashString(item.title).slice(0, 6), 36) % 5;
    const levelClass = `level-${item.level.toLowerCase().replaceAll("+", "plus").replace(/[^a-z0-9-]/g, "")}`;
    const accentClass = item.accent
  ? `accent-${item.accent
      .toLowerCase()
      .replace(/\s*\/\s*/g, "-")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")}`
  : "accent-unknown";
    const avatarImage = item.avatar
      ? `<img src="${escapeAttribute(item.avatar)}" alt="" loading="lazy" referrerpolicy="no-referrer" onerror="this.remove()">`
      : "";

    return `
      <article class="playlist-row${state.watched ? " is-watched" : ""}" role="row" data-id="${escapeAttribute(item.id)}">
        <div class="cell playlist-cell" role="cell">
          <span class="avatar avatar-tone-${avatarTone}">${escapeHTML(getInitials(item.title))}${avatarImage}</span>
          <div class="playlist-copy">
            <a class="playlist-title" href="${escapeAttribute(item.url)}" target="_blank" rel="noopener noreferrer" title="${escapeAttribute(item.title)}">${escapeHTML(item.title)}</a>
          </div>
        </div>
        <div class="cell" role="cell"><span class="level-badge ${levelClass}">${escapeHTML(item.level)}</span></div>
        <div class="cell" role="cell">
  <span class="accent-badge ${accentClass}">
    ${escapeHTML(item.accent || "Не указан")}
  </span>
</div>
        <div class="cell" role="cell"><span class="value-with-icon"><svg><use href="#icon-clock"></use></svg>${formatHours(item.durationHours)}</span></div>
        <div class="cell${item.videoCount === null ? " muted-value" : ""}" role="cell"><span class="value-with-icon"><svg><use href="#icon-video"></use></svg>${item.videoCount === null ? "—" : formatNumber(item.videoCount)}</span></div>
        <div class="cell row-actions" role="cell">
          <button class="icon-button favorite${state.favorite ? " is-active" : ""}" type="button" data-action="favorite" data-id="${escapeAttribute(item.id)}" aria-label="${state.favorite ? "Убрать из избранного" : "Добавить в избранное"}" title="${state.favorite ? "Убрать из избранного" : "В избранное"}"><svg><use href="#icon-heart"></use></svg></button>
          <button class="icon-button watched${state.watched ? " is-active" : ""}" type="button" data-action="watched" data-id="${escapeAttribute(item.id)}" aria-label="${state.watched ? "Снять отметку просмотра" : "Отметить просмотренным"}" title="${state.watched ? "Снять отметку" : "Просмотрено"}"><svg><use href="#icon-check"></use></svg></button>
          <button class="icon-button hidden${state.hidden ? " is-active" : ""}" type="button" data-action="hidden" data-id="${escapeAttribute(item.id)}" aria-label="${state.hidden ? "Вернуть в список" : "Скрыть из списка"}" title="${state.hidden ? "Вернуть в список" : "Скрыть"}"><svg><use href="#${state.hidden ? "icon-eye" : "icon-eye-off"}"></use></svg></button>
        </div>
      </article>`;
  }

  function renderViewTabs() {
    document.querySelectorAll("[data-view]").forEach((button) => {
      const active = button.dataset.view === preferences.view;
      button.classList.toggle("is-active", active);
      if (active) button.setAttribute("aria-current", "page");
      else button.removeAttribute("aria-current");
    });

    const visible = playlists.filter((item) => !getItemState(item.id).hidden);
    elements.countAll.textContent = formatNumber(visible.length);
    elements.countFavorites.textContent = formatNumber(visible.filter((item) => getItemState(item.id).favorite).length);
    elements.countWatched.textContent = formatNumber(visible.filter((item) => getItemState(item.id).watched).length);
    elements.countHidden.textContent = formatNumber(playlists.filter((item) => getItemState(item.id).hidden).length);
  }

  function handleActionClick(event) {
    const button = event.target.closest("[data-action]");
    if (!button) return;

    const id = button.dataset.id;
    const action = button.dataset.action;
    const state = getItemState(id);

    if (action === "favorite") {
      updateItemState(id, { favorite: !state.favorite });
      showToast(state.favorite ? "Удалено из избранного" : "Добавлено в избранное");
    } else if (action === "watched") {
      updateItemState(id, { watched: !state.watched });
      showToast(state.watched ? "Отметка снята" : "Отмечено просмотренным");
    } else if (action === "hidden") {
      updateItemState(id, { hidden: !state.hidden });
      showToast(state.hidden ? "Плейлист возвращён" : "Плейлист скрыт");
    }

    render();
  }

  function setView(view) {
    preferences.view = VALID_VIEWS.has(view) ? view : "all";
    savePreferences();
    render();
  }

  function resetFilters() {
    elements.search.value = "";
    elements.level.value = "all";
    elements.accent.value = "all";
    elements.sort.value = "duration-desc";
    preferences.level = "all";
    preferences.accent = "all";
    preferences.sort = "duration-desc";
    savePreferences();
    render();
  }

  function showToast(message) {
    window.clearTimeout(toastTimer);
    elements.toast.textContent = message;
    elements.toast.classList.add("is-visible");
    toastTimer = window.setTimeout(() => elements.toast.classList.remove("is-visible"), 1700);
  }

  function bindEvents() {
    elements.rows.addEventListener("click", handleActionClick);
    elements.search.addEventListener("input", render);
    elements.clearSearch.addEventListener("click", () => {
      elements.search.value = "";
      elements.search.focus();
      render();
    });

    elements.level.addEventListener("change", () => {
      preferences.level = elements.level.value;
      savePreferences();
      render();
    });
    elements.accent.addEventListener("change", () => {
      preferences.accent = elements.accent.value;
      savePreferences();
      render();
    });
    elements.sort.addEventListener("change", () => {
      preferences.sort = elements.sort.value;
      savePreferences();
      render();
    });

    document.querySelectorAll("[data-view]").forEach((button) => {
      button.addEventListener("click", () => setView(button.dataset.view));
    });

    elements.resetFilters.addEventListener("click", resetFilters);
    elements.emptyReset.addEventListener("click", resetFilters);
    elements.themeButton.addEventListener("click", () => setTheme(document.documentElement.dataset.theme === "dark" ? "light" : "dark"));
  }

  function getInitials(title) {
    const words = String(title).replace(/\([^)]*\)/g, "").trim().split(/\s+/).filter(Boolean);
    if (!words.length) return "CI";
    if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
    return `${words[0][0]}${words[1][0]}`.toUpperCase();
  }

  function hashString(value) {
    let hash = 0;
    const text = String(value);
    for (let index = 0; index < text.length; index += 1) hash = ((hash << 5) - hash + text.charCodeAt(index)) | 0;
    return Math.abs(hash).toString(36);
  }

  function normalizeSearch(value) {
    return String(value || "").toLocaleLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, "").trim();
  }

  function escapeHTML(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function escapeAttribute(value) {
    return escapeHTML(value).replaceAll("`", "&#096;");
  }

  function formatNumber(value) {
    return new Intl.NumberFormat("ru-RU").format(value);
  }

  function formatHours(value) {
    const display = Number.isInteger(value) ? String(value) : value.toFixed(1).replace(".", ",");
    return `${display} ч`;
  }

  function pluralizePlaylist(number) {
    const mod10 = number % 10;
    const mod100 = number % 100;
    if (mod10 === 1 && mod100 !== 11) return "плейлист";
    if ([2, 3, 4].includes(mod10) && ![12, 13, 14].includes(mod100)) return "плейлиста";
    return "плейлистов";
  }

  function init() {
    populateFilterOptions();
    applyPreferences();
    setTheme(preferences.theme);
    bindEvents();
    render();
  }

  init();
})();
