(() => {
  "use strict";

  const STORAGE_KEYS = {
    state: "input-atlas.item-state.v1",
    preferences: "input-atlas.preferences.v1"
  };

  const DEFAULT_LANGUAGE = navigator.language
    .toLowerCase()
    .startsWith("ru")
    ? "ru"
    : "en";

  const DEFAULT_PREFERENCES = {
    theme: "light",
    language: DEFAULT_LANGUAGE,
    view: "all",
    level: "all",
    accent: "all",
    sort: "duration-desc",
    newOnly: false,
    podcastOnly: false
  };

  const TRANSLATIONS = {
    ru: {
      "page.title": "English CI Playlists",
      "meta.description": "Каталог плейлистов с Comprehensible Input для изучения английского.",

      "navigation.sections": "Разделы каталога",
      "tabs.all": "Все",
      "tabs.favorites": "Избранное",
      "tabs.watched": "Просмотренные",
      "tabs.hidden": "Скрытые",
      "tabs.new": "Новые",
      "tabs.podcasts": "Подкасты",

      "language.switchToEnglish": "Переключить на английский",
      "language.switchToRussian": "Переключить на русский",
      "theme.toggle": "Сменить тему",

      "filters.section": "Поиск, фильтры и сортировка",
      "filters.levelLabel": "Фильтр по уровню",
      "filters.accentLabel": "Фильтр по акценту",
      "filters.allLevels": "Все уровни",
      "filters.allAccents": "Все акценты",
      "filters.unknownAccent": "Не указан",
      "filters.newOnlyLabel": "Показывать только новые плейлисты",
      "filters.podcastOnlyLabel": "Показывать только подкасты",
      "filters.reset": "Сбросить фильтры",

      "search.placeholder": "Поиск плейлиста",
      "search.label": "Поиск плейлиста",
      "search.clear": "Очистить поиск",

      "sort.label": "Сортировка",
      "sort.durationDesc": "Сначала длинные",
      "sort.durationAsc": "Сначала короткие",
      "sort.titleAsc": "По алфавиту А–Я",
      "sort.titleDesc": "По алфавиту Я–А",
      "sort.videosDesc": "Больше видео",
      "sort.videosAsc": "Меньше видео",
      "sort.levelAsc": "По уровню",

      "catalog.label": "Каталог плейлистов",
      "table.scrollLabel": "Прокручиваемая таблица плейлистов",
      "table.label": "Плейлисты",
      "table.playlist": "Плейлист",
      "table.level": "Уровень",
      "table.accent": "Акцент",
      "table.duration": "Длительность",
      "table.videos": "Видео",
      "table.actions": "Действия",

      "empty.title": "Ничего не найдено",

      "format.podcast": "Подкаст",
      "badge.new": "Новый",

      "actions.favoriteAdd": "Добавить в избранное",
      "actions.favoriteRemove": "Убрать из избранного",
      "actions.watchedAdd": "Отметить просмотренным",
      "actions.watchedRemove": "Снять отметку просмотра",
      "actions.hide": "Скрыть из списка",
      "actions.restore": "Вернуть в список",

      "toast.favoriteAdded": "Добавлено в избранное",
      "toast.favoriteRemoved": "Удалено из избранного",
      "toast.watchedAdded": "Отмечено просмотренным",
      "toast.watchedRemoved": "Отметка снята",
      "toast.hidden": "Плейлист скрыт",
      "toast.restored": "Плейлист возвращён",

      "values.notSpecified": "Не указан",
      "values.hours": "ч",
      "values.hour.one": "час",
      "values.hour.few": "часа",
      "values.hour.many": "часов",
      "values.playlist.one": "плейлист",
      "values.playlist.few": "плейлиста",
      "values.playlist.many": "плейлистов"
    },

    en: {
      "page.title": "English CI Playlists",
      "meta.description": "A catalog of Comprehensible Input playlists for learning English.",

      "navigation.sections": "Catalog sections",
      "tabs.all": "All",
      "tabs.favorites": "Favorites",
      "tabs.watched": "Watched",
      "tabs.hidden": "Hidden",
      "tabs.new": "New",
      "tabs.podcasts": "Podcasts",

      "language.switchToEnglish": "Switch to English",
      "language.switchToRussian": "Switch to Russian",
      "theme.toggle": "Switch theme",

      "filters.section": "Search, filters and sorting",
      "filters.levelLabel": "Filter by level",
      "filters.accentLabel": "Filter by accent",
      "filters.allLevels": "All levels",
      "filters.allAccents": "All accents",
      "filters.unknownAccent": "Not specified",
      "filters.newOnlyLabel": "Show only new playlists",
      "filters.podcastOnlyLabel": "Show only podcasts",
      "filters.reset": "Reset filters",

      "search.placeholder": "Search playlists",
      "search.label": "Search playlists",
      "search.clear": "Clear search",

      "sort.label": "Sorting",
      "sort.durationDesc": "Longest first",
      "sort.durationAsc": "Shortest first",
      "sort.titleAsc": "Alphabetical A–Z",
      "sort.titleDesc": "Alphabetical Z–A",
      "sort.videosDesc": "Most videos",
      "sort.videosAsc": "Fewest videos",
      "sort.levelAsc": "By level",

      "catalog.label": "Playlist catalog",
      "table.scrollLabel": "Scrollable playlist table",
      "table.label": "Playlists",
      "table.playlist": "Playlist",
      "table.level": "Level",
      "table.accent": "Accent",
      "table.duration": "Duration",
      "table.videos": "Videos",
      "table.actions": "Actions",

      "empty.title": "Nothing found",

      "format.podcast": "Podcast",
      "badge.new": "New",

      "actions.favoriteAdd": "Add to favorites",
      "actions.favoriteRemove": "Remove from favorites",
      "actions.watchedAdd": "Mark as watched",
      "actions.watchedRemove": "Remove watched mark",
      "actions.hide": "Hide from list",
      "actions.restore": "Restore to list",

      "toast.favoriteAdded": "Added to favorites",
      "toast.favoriteRemoved": "Removed from favorites",
      "toast.watchedAdded": "Marked as watched",
      "toast.watchedRemoved": "Watched mark removed",
      "toast.hidden": "Playlist hidden",
      "toast.restored": "Playlist restored",

      "values.notSpecified": "Not specified",
      "values.hours": "h",
      "values.hour.one": "hour",
      "values.hour.many": "hours",
      "values.playlist.one": "playlist",
      "values.playlist.many": "playlists"
    }
  };

  const VALID_VIEWS = new Set(["all", "favorites", "watched", "hidden"]);
  const NEW_BADGE_DAYS = 14;
  const DAY_IN_MILLISECONDS = 24 * 60 * 60 * 1000;
  const LEVEL_ORDER = { A1: 1, A2: 2, B1: 3, "Intermediate": 4 };
  const ACCENT_SUGGESTIONS = [
    "American",
    "British",
    "Australian",
    "Canadian",
    "Irish"
  ];

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
    resultDuration: document.getElementById("resultDuration"),
    resultDurationWord: document.getElementById("resultDurationWord"),
    countAll: document.getElementById("countAll"),
    countFavorites: document.getElementById("countFavorites"),
    countWatched: document.getElementById("countWatched"),
    countHidden: document.getElementById("countHidden"),
    newFilter: document.getElementById("newFilterButton"),
    podcastFilter: document.getElementById("podcastFilterButton"),
    languageButton: document.getElementById("languageButton"),
    languageButtonText: document.getElementById("languageButtonText"),
    themeButton: document.getElementById("themeButton"),
    resetFilters: document.getElementById("resetFiltersButton"),
    emptyReset: document.getElementById("emptyResetButton"),
    toast: document.getElementById("toast")
  };

  const rawPlaylists = Array.isArray(window.PLAYLISTS)
    ? window.PLAYLISTS
    : [];

  const playlists = rawPlaylists
    .filter(isUsablePlaylist)
    .map(normalizePlaylist);

  let itemState = readStorage(STORAGE_KEYS.state, {});
  let preferences = {
    ...DEFAULT_PREFERENCES,
    ...readStorage(STORAGE_KEYS.preferences, {})
  };
  let toastTimer = 0;

  function isUsablePlaylist(item) {
    return Boolean(item && item.title && item.url);
  }

  function normalizePlaylist(item) {
    const videoCount =
      item.videoCount === null ||
      item.videoCount === undefined ||
      item.videoCount === ""
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
      notes: item.notes ? String(item.notes).trim() : "",
      format: item.format ? String(item.format).trim().toLowerCase() : null,
      addedAt: normalizeDate(item.addedAt)
    };
  }

  function nonNegativeNumber(value) {
    const number = Number(value);
    return Number.isFinite(number) ? Math.max(0, number) : 0;
  }

  function normalizeDate(value) {
    if (!value) return null;

    const text = String(value).trim();
    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(text);

    if (!match) return null;

    const year = Number(match[1]);
    const month = Number(match[2]);
    const day = Number(match[3]);
    const timestamp = Date.UTC(year, month - 1, day);
    const date = new Date(timestamp);

    const isValid =
      date.getUTCFullYear() === year &&
      date.getUTCMonth() === month - 1 &&
      date.getUTCDate() === day;

    return isValid ? text : null;
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

  function getCurrentLanguage() {
    return preferences.language === "en" ? "en" : "ru";
  }

  function getCurrentLocale() {
    return getCurrentLanguage() === "en" ? "en-US" : "ru-RU";
  }

  function t(key) {
    const language = getCurrentLanguage();

    return (
      TRANSLATIONS[language]?.[key] ??
      TRANSLATIONS.ru[key] ??
      key
    );
  }

  function applyLanguage() {
    const language = getCurrentLanguage();

    document.documentElement.lang = language;
    document.title = t("page.title");

    document.querySelectorAll("[data-i18n]").forEach((element) => {
      element.textContent = t(element.dataset.i18n);
    });

    document
      .querySelectorAll("[data-i18n-placeholder]")
      .forEach((element) => {
        element.placeholder = t(element.dataset.i18nPlaceholder);
      });

    document
      .querySelectorAll("[data-i18n-title]")
      .forEach((element) => {
        element.title = t(element.dataset.i18nTitle);
      });

    document
      .querySelectorAll("[data-i18n-aria-label]")
      .forEach((element) => {
        element.setAttribute(
          "aria-label",
          t(element.dataset.i18nAriaLabel)
        );
      });

    document
      .querySelectorAll("[data-i18n-content]")
      .forEach((element) => {
        element.setAttribute(
          "content",
          t(element.dataset.i18nContent)
        );
      });

    if (elements.languageButton && elements.languageButtonText) {
      const targetLanguage = language === "ru" ? "EN" : "RU";
      const buttonLabel =
        language === "ru"
          ? t("language.switchToEnglish")
          : t("language.switchToRussian");

      elements.languageButtonText.textContent = targetLanguage;
      elements.languageButton.setAttribute("aria-label", buttonLabel);
      elements.languageButton.setAttribute("title", buttonLabel);
    }
  }

  function toggleLanguage() {
    preferences.language =
      getCurrentLanguage() === "ru"
        ? "en"
        : "ru";

    savePreferences();
    populateFilterOptions();
    applyPreferences();
    applyLanguage();
    render();
  }

  function getItemState(id) {
    return {
      favorite: false,
      watched: false,
      hidden: false,
      ...(itemState[id] || {})
    };
  }

  function updateItemState(id, patch) {
    itemState[id] = {
      ...getItemState(id),
      ...patch
    };

    writeStorage(STORAGE_KEYS.state, itemState);
  }

  function savePreferences() {
    writeStorage(STORAGE_KEYS.preferences, preferences);
  }

  function setTheme(theme) {
    preferences.theme = theme === "dark" ? "dark" : "light";
    document.documentElement.dataset.theme = preferences.theme;

    const meta = document.querySelector('meta[name="theme-color"]');

    if (meta) {
      meta.content =
        preferences.theme === "dark"
          ? "#17151b"
          : "#f7f6fa";
    }

    if (elements.themeButton) {
      elements.themeButton.setAttribute(
        "aria-pressed",
        String(preferences.theme === "dark")
      );
    }

    savePreferences();
  }

  function populateFilterOptions() {
    const selectedLevel = preferences.level;
    const selectedAccent = preferences.accent;

    const levels = [...new Set(playlists.map((item) => item.level))]
      .sort(
        (a, b) =>
          (LEVEL_ORDER[a] ?? 99) -
            (LEVEL_ORDER[b] ?? 99) ||
          a.localeCompare(b, "en")
      );

    elements.level.innerHTML =
      `<option value="all">${escapeHTML(t("filters.allLevels"))}</option>` +
      levels
        .map(
          (level) =>
            `<option value="${escapeAttribute(level)}">${escapeHTML(level)}</option>`
        )
        .join("");

    const accents = [
      ...new Set([
        ...ACCENT_SUGGESTIONS,
        ...playlists
          .map((item) => item.accent)
          .filter(Boolean)
      ])
    ].sort((a, b) => a.localeCompare(b, "en"));

    elements.accent.innerHTML = [
      `<option value="all">${escapeHTML(t("filters.allAccents"))}</option>`,
      `<option value="unknown">${escapeHTML(t("filters.unknownAccent"))}</option>`,
      ...accents.map(
        (accent) =>
          `<option value="${escapeAttribute(accent)}">${escapeHTML(accent)}</option>`
      )
    ].join("");

    preferences.level = levels.includes(selectedLevel)
      ? selectedLevel
      : "all";

    preferences.accent =
      accents.includes(selectedAccent) ||
      selectedAccent === "unknown"
        ? selectedAccent
        : "all";
  }

  function applyPreferences() {
    preferences.language =
      preferences.language === "en"
        ? "en"
        : "ru";

    preferences.view = VALID_VIEWS.has(preferences.view)
      ? preferences.view
      : "all";

    preferences.level = [...elements.level.options].some(
      (option) => option.value === preferences.level
    )
      ? preferences.level
      : "all";

    preferences.accent = [...elements.accent.options].some(
      (option) => option.value === preferences.accent
    )
      ? preferences.accent
      : "all";

    preferences.sort = [...elements.sort.options].some(
      (option) => option.value === preferences.sort
    )
      ? preferences.sort
      : "duration-desc";

    preferences.newOnly = preferences.newOnly === true;
    preferences.podcastOnly = preferences.podcastOnly === true;

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

      if (
        preferences.view === "favorites" &&
        !state.favorite
      ) {
        return false;
      }

      if (
        preferences.view === "watched" &&
        !state.watched
      ) {
        return false;
      }

      if (
        preferences.newOnly &&
        !isRecentlyAdded(item)
      ) {
        return false;
      }

      if (
        preferences.podcastOnly &&
        item.format !== "podcast"
      ) {
        return false;
      }

      if (
        selectedLevel !== "all" &&
        item.level !== selectedLevel
      ) {
        return false;
      }

      if (
        selectedAccent === "unknown" &&
        item.accent
      ) {
        return false;
      }

      if (
        selectedAccent !== "all" &&
        selectedAccent !== "unknown" &&
        item.accent !== selectedAccent
      ) {
        return false;
      }

      if (query) {
        const searchable = normalizeSearch(
          [
            item.title,
            item.level,
            item.accent || "",
            item.format || "",
            item.notes
          ].join(" ")
        );

        if (!searchable.includes(query)) {
          return false;
        }
      }

      return true;
    });

    return sortPlaylists(filtered, elements.sort.value);
  }

  function sortPlaylists(items, sortMode) {
    return [...items].sort((a, b) => {
      switch (sortMode) {
        case "duration-asc":
          return (
            a.durationHours -
              b.durationHours ||
            compareTitle(a, b)
          );

        case "title-asc":
          return compareTitle(a, b);

        case "title-desc":
          return compareTitle(b, a);

        case "videos-desc":
          return (
            compareVideoCounts(a, b, "desc") ||
            compareTitle(a, b)
          );

        case "videos-asc":
          return (
            compareVideoCounts(a, b, "asc") ||
            compareTitle(a, b)
          );

        case "level-asc":
          return (
            (LEVEL_ORDER[a.level] ?? 99) -
              (LEVEL_ORDER[b.level] ?? 99) ||
            b.durationHours -
              a.durationHours ||
            compareTitle(a, b)
          );

        case "duration-desc":
        default:
          return (
            b.durationHours -
              a.durationHours ||
            compareTitle(a, b)
          );
      }
    });
  }

  function getAddedAtTimestamp(item) {
    if (!item.addedAt) return 0;

    const [year, month, day] = item.addedAt
      .split("-")
      .map(Number);

    return Date.UTC(year, month - 1, day);
  }

  function isRecentlyAdded(item) {
    if (!item.addedAt) return false;

    const addedAt = getAddedAtTimestamp(item);
    const now = new Date();
    const today = Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate()
    );

    const age = today - addedAt;

    return (
      age >= 0 &&
      age < NEW_BADGE_DAYS * DAY_IN_MILLISECONDS
    );
  }

  function compareTitle(a, b) {
    return a.title.localeCompare(
      b.title,
      "en",
      { sensitivity: "base" }
    );
  }

  function compareVideoCounts(a, b, direction) {
    const aMissing = a.videoCount === null;
    const bMissing = b.videoCount === null;

    if (aMissing && bMissing) return 0;
    if (aMissing) return 1;
    if (bMissing) return -1;

    return direction === "asc"
      ? a.videoCount - b.videoCount
      : b.videoCount - a.videoCount;
  }

  function render() {
    const visible = getVisiblePlaylists();

    elements.rows.innerHTML = visible
      .map(renderRow)
      .join("");

    elements.emptyState.hidden = visible.length !== 0;
    const totalDuration = visible.reduce(
      (sum, item) => sum + item.durationHours,
      0
    );

    elements.resultCount.textContent = formatNumber(visible.length);
    elements.resultWord.textContent = pluralizePlaylist(visible.length);
    elements.resultDuration.textContent = formatDurationNumber(totalDuration);
    elements.resultDurationWord.textContent = pluralizeHours(totalDuration);

    elements.clearSearch
      .closest(".search-control")
      .classList.toggle(
        "has-value",
        elements.search.value.length > 0
      );

    renderViewTabs();
    renderSpecialFilters();
  }

  function renderSpecialFilters() {
    const filters = [
      [elements.newFilter, preferences.newOnly],
      [elements.podcastFilter, preferences.podcastOnly]
    ];

    filters.forEach(([button, active]) => {
      if (!button) return;

      button.classList.toggle("is-active", active);
      button.setAttribute("aria-pressed", String(active));
    });
  }

  function renderRow(item) {
    const state = getItemState(item.id);
    const avatarTone =
      parseInt(hashString(item.title).slice(0, 6), 36) % 5;

    const levelClass =
      `level-${item.level
        .toLowerCase()
        .replaceAll("+", "plus")
        .replace(/[^a-z0-9-]/g, "")}`;

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

    const favoriteLabel = state.favorite
      ? t("actions.favoriteRemove")
      : t("actions.favoriteAdd");

    const watchedLabel = state.watched
      ? t("actions.watchedRemove")
      : t("actions.watchedAdd");

    const hiddenLabel = state.hidden
      ? t("actions.restore")
      : t("actions.hide");

    const formatBadge =
      item.format === "podcast"
        ? `<span class="format-badge">${escapeHTML(t("format.podcast"))}</span>`
        : "";

    const newBadge = isRecentlyAdded(item)
      ? `<span class="new-badge">${escapeHTML(t("badge.new"))}</span>`
      : "";

    const badges = `${formatBadge}${newBadge}`;

    return `
      <article class="playlist-row${state.watched ? " is-watched" : ""}" role="row" data-id="${escapeAttribute(item.id)}">
        <div class="cell playlist-cell" role="cell">
          <span class="avatar avatar-tone-${avatarTone}">
            ${escapeHTML(getInitials(item.title))}
            ${avatarImage}
          </span>

          <div class="playlist-copy">
            <div class="playlist-title-row">
              <a
                class="playlist-title"
                href="${escapeAttribute(item.url)}"
                target="_blank"
                rel="noopener noreferrer"
                title="${escapeAttribute(item.title)}"
              >
                ${escapeHTML(item.title)}
              </a>

              ${badges
                ? `<span class="playlist-badges">${badges}</span>`
                : ""}
            </div>
          </div>
        </div>

        <div class="cell" role="cell">
          <span class="level-badge ${levelClass}">
            ${escapeHTML(item.level)}
          </span>
        </div>

        <div class="cell" role="cell">
          <span class="accent-badge ${accentClass}">
            ${escapeHTML(item.accent || t("values.notSpecified"))}
          </span>
        </div>

        <div class="cell" role="cell">
          <span class="value-with-icon">
            <svg aria-hidden="true">
              <use href="#icon-clock"></use>
            </svg>
            ${formatHours(item.durationHours)}
          </span>
        </div>

        <div
          class="cell${item.videoCount === null ? " muted-value" : ""}"
          role="cell"
        >
          <span class="value-with-icon">
            <svg aria-hidden="true">
              <use href="#icon-video"></use>
            </svg>
            ${item.videoCount === null ? "—" : formatNumber(item.videoCount)}
          </span>
        </div>

        <div class="cell row-actions" role="cell">
          <button
            class="icon-button favorite${state.favorite ? " is-active" : ""}"
            type="button"
            data-action="favorite"
            data-id="${escapeAttribute(item.id)}"
            aria-label="${escapeAttribute(favoriteLabel)}"
            title="${escapeAttribute(favoriteLabel)}"
          >
            <svg aria-hidden="true">
              <use href="#icon-heart"></use>
            </svg>
          </button>

          <button
            class="icon-button watched${state.watched ? " is-active" : ""}"
            type="button"
            data-action="watched"
            data-id="${escapeAttribute(item.id)}"
            aria-label="${escapeAttribute(watchedLabel)}"
            title="${escapeAttribute(watchedLabel)}"
          >
            <svg aria-hidden="true">
              <use href="#icon-check"></use>
            </svg>
          </button>

          <button
            class="icon-button hidden${state.hidden ? " is-active" : ""}"
            type="button"
            data-action="hidden"
            data-id="${escapeAttribute(item.id)}"
            aria-label="${escapeAttribute(hiddenLabel)}"
            title="${escapeAttribute(hiddenLabel)}"
          >
            <svg aria-hidden="true">
              <use href="#${state.hidden ? "icon-eye" : "icon-eye-off"}"></use>
            </svg>
          </button>
        </div>
      </article>
    `;
  }

  function renderViewTabs() {
    document
      .querySelectorAll("[data-view]")
      .forEach((button) => {
        const active =
          button.dataset.view === preferences.view;

        button.classList.toggle("is-active", active);

        if (active) {
          button.setAttribute("aria-current", "page");
        } else {
          button.removeAttribute("aria-current");
        }
      });

    const visible = playlists.filter(
      (item) => !getItemState(item.id).hidden
    );

    elements.countAll.textContent =
      formatNumber(visible.length);

    elements.countFavorites.textContent =
      formatNumber(
        visible.filter(
          (item) => getItemState(item.id).favorite
        ).length
      );

    elements.countWatched.textContent =
      formatNumber(
        visible.filter(
          (item) => getItemState(item.id).watched
        ).length
      );

    elements.countHidden.textContent =
      formatNumber(
        playlists.filter(
          (item) => getItemState(item.id).hidden
        ).length
      );
  }

  function handleActionClick(event) {
    const button = event.target.closest("[data-action]");

    if (!button) return;

    const id = button.dataset.id;
    const action = button.dataset.action;
    const state = getItemState(id);

    if (action === "favorite") {
      updateItemState(id, {
        favorite: !state.favorite
      });

      showToast(
        state.favorite
          ? t("toast.favoriteRemoved")
          : t("toast.favoriteAdded")
      );
    } else if (action === "watched") {
      updateItemState(id, {
        watched: !state.watched
      });

      showToast(
        state.watched
          ? t("toast.watchedRemoved")
          : t("toast.watchedAdded")
      );
    } else if (action === "hidden") {
      updateItemState(id, {
        hidden: !state.hidden
      });

      showToast(
        state.hidden
          ? t("toast.restored")
          : t("toast.hidden")
      );
    }

    render();
  }

  function setView(view) {
    preferences.view = VALID_VIEWS.has(view)
      ? view
      : "all";

    savePreferences();
    render();
  }

  function toggleSpecialFilter(filterName) {
    preferences[filterName] = !preferences[filterName];
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
    preferences.newOnly = false;
    preferences.podcastOnly = false;

    savePreferences();
    render();
  }

  function showToast(message) {
    window.clearTimeout(toastTimer);

    elements.toast.textContent = message;
    elements.toast.classList.add("is-visible");

    toastTimer = window.setTimeout(
      () => elements.toast.classList.remove("is-visible"),
      1700
    );
  }

  function bindEvents() {
    elements.rows.addEventListener(
      "click",
      handleActionClick
    );

    elements.search.addEventListener(
      "input",
      render
    );

    elements.clearSearch.addEventListener(
      "click",
      () => {
        elements.search.value = "";
        elements.search.focus();
        render();
      }
    );

    elements.level.addEventListener(
      "change",
      () => {
        preferences.level = elements.level.value;
        savePreferences();
        render();
      }
    );

    elements.accent.addEventListener(
      "change",
      () => {
        preferences.accent = elements.accent.value;
        savePreferences();
        render();
      }
    );

    elements.sort.addEventListener(
      "change",
      () => {
        preferences.sort = elements.sort.value;
        savePreferences();
        render();
      }
    );

    document
      .querySelectorAll("[data-view]")
      .forEach((button) => {
        button.addEventListener(
          "click",
          () => setView(button.dataset.view)
        );
      });

    elements.resetFilters.addEventListener(
      "click",
      resetFilters
    );

    elements.emptyReset.addEventListener(
      "click",
      resetFilters
    );

    if (elements.newFilter) {
      elements.newFilter.addEventListener(
        "click",
        () => toggleSpecialFilter("newOnly")
      );
    }

    if (elements.podcastFilter) {
      elements.podcastFilter.addEventListener(
        "click",
        () => toggleSpecialFilter("podcastOnly")
      );
    }

    if (elements.languageButton) {
      elements.languageButton.addEventListener(
        "click",
        toggleLanguage
      );
    }

    elements.themeButton.addEventListener(
      "click",
      () => {
        setTheme(
          document.documentElement.dataset.theme === "dark"
            ? "light"
            : "dark"
        );
      }
    );
  }

  function getInitials(title) {
    const words = String(title)
      .replace(/\([^)]*\)/g, "")
      .trim()
      .split(/\s+/)
      .filter(Boolean);

    if (!words.length) return "CI";

    if (words.length === 1) {
      return words[0]
        .slice(0, 2)
        .toUpperCase();
    }

    return `${words[0][0]}${words[1][0]}`
      .toUpperCase();
  }

  function hashString(value) {
    let hash = 0;
    const text = String(value);

    for (
      let index = 0;
      index < text.length;
      index += 1
    ) {
      hash =
        ((hash << 5) -
          hash +
          text.charCodeAt(index)) |
        0;
    }

    return Math.abs(hash).toString(36);
  }

  function normalizeSearch(value) {
    return String(value || "")
      .toLocaleLowerCase()
      .normalize("NFKD")
      .replace(/[\u0300-\u036f]/g, "")
      .trim();
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
    return escapeHTML(value)
      .replaceAll("`", "&#096;");
  }

  function formatNumber(value) {
    return new Intl.NumberFormat(
      getCurrentLocale()
    ).format(value);
  }

  function formatDurationNumber(value) {
    return new Intl.NumberFormat(
      getCurrentLocale(),
      {
        maximumFractionDigits: 1
      }
    ).format(value);
  }

  function formatHours(value) {
    return `${formatDurationNumber(value)} ${t("values.hours")}`;
  }

  function pluralizeHours(number) {
    if (getCurrentLanguage() === "en") {
      return number === 1
        ? t("values.hour.one")
        : t("values.hour.many");
    }

    if (!Number.isInteger(number)) {
      return t("values.hour.few");
    }

    const mod10 = number % 10;
    const mod100 = number % 100;

    if (
      mod10 === 1 &&
      mod100 !== 11
    ) {
      return t("values.hour.one");
    }

    if (
      [2, 3, 4].includes(mod10) &&
      ![12, 13, 14].includes(mod100)
    ) {
      return t("values.hour.few");
    }

    return t("values.hour.many");
  }

  function pluralizePlaylist(number) {
    if (getCurrentLanguage() === "en") {
      return number === 1
        ? t("values.playlist.one")
        : t("values.playlist.many");
    }

    const mod10 = number % 10;
    const mod100 = number % 100;

    if (
      mod10 === 1 &&
      mod100 !== 11
    ) {
      return t("values.playlist.one");
    }

    if (
      [2, 3, 4].includes(mod10) &&
      ![12, 13, 14].includes(mod100)
    ) {
      return t("values.playlist.few");
    }

    return t("values.playlist.many");
  }

  function init() {
    preferences.language =
      preferences.language === "en"
        ? "en"
        : "ru";

    populateFilterOptions();
    applyPreferences();
    setTheme(preferences.theme);
    applyLanguage();
    bindEvents();
    render();
  }

  init();
})();
