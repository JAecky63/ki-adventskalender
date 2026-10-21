/*
 * 24 Fragen zur KI – Adventskalender
 * Code mithilfe von ChatGPT erstellt, auf didaktische Anforderungen abgestimmt.
 * Jede Funktion ist bewusst ohne externe Bibliotheken gehalten.
 */
(() => {
  'use strict';

  // Nur bereits veröffentlichte Karten stehen im öffentlichen data.js.
  // Die Redaktionsvorschau enthält dagegen ausdrücklich alle Karten.
  const cards = Array.isArray(window.ADVENT_CARDS) ? window.ADVENT_CARDS : [];
  const config = window.ADVENT_CONFIG || {};
  const isPreview = config.preview === true;
  const year = Number(config.year) || 2026;
  const available = new Map(cards.map((card) => [Number(card.day), card]));
  const visited = new Set(); // Nur für die aktuelle Browsersitzung, ohne Speicherung.
  let currentDay = null;
  let lastDoorButton = null;

  const byId = (id) => document.getElementById(id);
  const grid = byId('calendar-grid');
  const dialog = byId('card-dialog');
  const flipButton = byId('flip-card');
  const front = byId('flip-front');
  const back = byId('flip-back');
  const extras = byId('card-extra');
  const resources = byId('card-resources');
  const activities = byId('card-activity');

  // Datum für die Hervorhebung des heutigen Türchens in Berlin bestimmen.
  // Die Freischaltung selbst erfolgt NICHT anhand dieser Browseruhr,
  // sondern dadurch, dass die jeweilige Karte bereits veröffentlicht wurde.
  function getBerlinDate() {
    const parts = new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Europe/Berlin', year: 'numeric', month: '2-digit', day: '2-digit'
    }).formatToParts(new Date());
    const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
    return {year: Number(values.year), month: Number(values.month), day: Number(values.day)};
  }

  const today = getBerlinDate();
  if (isPreview) byId('preview-banner').hidden = false;

  // Titel und Fortschrittsanzeige aus tatsächlich verfügbaren Karten ermitteln.
  const count = available.size;
  byId('progress-number').textContent = `${count} / 24`;
  byId('progress-label').textContent = isPreview ? 'Alle Karten zur Prüfung bereit' : `${count} von 24 Türchen freigeschaltet`;
  byId('progress-fill').style.width = `${(count / 24) * 100}%`;
  byId('progress-track').setAttribute('aria-valuenow', String(count));
  if (isPreview) {
    byId('calendar-subtitle').textContent = 'Vorschau: Alle Fragen und Antworten können vor der Veröffentlichung geprüft werden.';
  } else if (count === 24) {
    byId('calendar-subtitle').textContent = 'Alle 24 Türchen sind geöffnet. Du kannst sie jederzeit erneut entdecken.';
  } else if (count > 0) {
    byId('calendar-subtitle').textContent = 'Jeden Tag kommt ein neues Türchen hinzu. Geöffnete Türchen bleiben zugänglich.';
  }

  // Für jedes der 24 Türchen eine Schaltfläche erzeugen.
  for (let day = 1; day <= 24; day++) {
    const unlocked = available.has(day);
    const isToday = today.year === year && today.month === 12 && today.day === day;
    const button = document.createElement('button');
    button.type = 'button';
    button.className = `door${day === 24 ? ' day-24' : ''}${isToday && unlocked ? ' is-today' : ''}`;
    button.dataset.day = String(day);
    button.disabled = !unlocked;
    button.setAttribute('aria-label', unlocked ? `Türchen ${day} öffnen` : `Türchen ${day}, öffnet am ${day}. Dezember ${year}`);
    button.innerHTML = `<span class="door-number">${day}</span><span class="door-icon">${unlocked ? '✦ ÖFFNEN' : '⌑ GESPERRT'}</span>`;
    if (unlocked) {
      button.addEventListener('click', () => {
        lastDoorButton = button;
        openCard(day);
      });
    }
    grid.appendChild(button);
  }

  // Dialog öffnet mit der Frage. Erst ein Klick dreht die Karte zur Antwort.
  function openCard(day) {
    const card = available.get(day);
    if (!card) return;
    currentDay = day;
    flipButton.classList.remove('is-flipped');
    flipButton.setAttribute('aria-pressed', 'false');
    flipButton.setAttribute('aria-label', 'Antwort anzeigen');
    front.setAttribute('aria-hidden', 'false');
    back.setAttribute('aria-hidden', 'true');
    byId('dialog-day').textContent = `${day}. DEZEMBER ${year}`;
    byId('card-question').textContent = card.question;
    byId('card-term').textContent = card.term;
    byId('card-answer').textContent = card.answer;
    byId('card-thought').textContent = card.thought;
    prepareExtras(card);
    extras.hidden = true;
    back.querySelector('.flip-hint').textContent = (resources.hidden && activities.hidden)
      ? 'ANTIPPEN · FRAGE NOCHMAL ANSEHEN ↻'
      : 'WEITERE MATERIALIEN UNTER DER KARTE ↓';
    dialog.scrollTop = 0; // Beim Kartenwechsel oben beginnen, nicht an alter Scrollposition.
    byId('prev-card').disabled = !available.has(day - 1);
    byId('next-card').disabled = !available.has(day + 1);
    visited.add(day);
    const doorButton = grid.querySelector(`[data-day="${day}"]`);
    if (doorButton) {
      doorButton.classList.add('is-opened');
      doorButton.setAttribute('aria-label', `Türchen ${day}, bereits besucht, erneut öffnen`);
    }
    if (!dialog.open) dialog.showModal();
    flipButton.focus();
  }

  // Weiterführende Quellen und kleine Lernexperimente vorbereiten.
  // Die Links befinden sich außerhalb der drehbaren Schaltfläche (kein verschachtelter Button).
  function prepareExtras(card) {
    const list = byId('card-resource-list');
    list.replaceChildren();
    const entries = Array.isArray(card.resources) ? card.resources : [];
    resources.hidden = entries.length === 0;
    for (const item of entries) {
      // Im privaten Datensatz sind ausschließlich geprüfte HTTPS-Seiten zulässig.
      let url;
      try { url = new URL(item.url); } catch { continue; }
      if (url.protocol !== 'https:') continue;
      const row = document.createElement('div');
      row.className = 'resource-entry';
      const link = document.createElement('a');
      link.href = url.href;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.textContent = item.title + ' ↗';
      row.appendChild(link);
      if (item.note) {
        const note = document.createElement('p');
        note.textContent = item.note;
        row.appendChild(note);
      }
      list.appendChild(row);
    }
    activities.replaceChildren();
    activities.hidden = card.activity !== 'framing';
    if (card.activity === 'framing') addFramingActivity();
  }

  function element(tag, text, className) {
    const e = document.createElement(tag);
    if (text != null) e.textContent = text;
    if (className) e.className = className;
    return e;
  }

  // Drei Formulierungen zu einer Frage. Kein Datenverkehr und keine Modellaufrufe.
  function addFramingActivity() {
    activities.appendChild(element('h3', 'Mini-Experiment: Drei Arten zu fragen'));
    activities.appendChild(element('p', 'Kopiere nacheinander die drei Fragen in ein Sprachmodell und vergleiche die Antworten. Welche Aspekte werden jeweils betont? Bitte keine persönlichen Daten eingeben.'));
    const prompts = [
      ['Neutral', 'Welche Auswirkungen hat KI auf das Lernen in der Schule?'],
      ['Positiv', 'Welche Vorteile bietet KI für das Lernen in der Schule?'],
      ['Negativ', 'Welche Gefahren entstehen durch den Einsatz von KI beim Lernen in der Schule?']
    ];
    for (const [kind, prompt] of prompts) {
      activities.appendChild(element('span', kind + ' formuliert', 'activity-label'));
      const line = element('div', null, 'activity-prompt');
      line.appendChild(element('span', '„' + prompt + '“'));
      const copy = element('button', 'Kopieren');
      copy.type = 'button';
      copy.addEventListener('click', async () => {
        // Bei lokal geöffneten HTML-Dateien ist Clipboard-Zugriff nicht überall verfügbar.
        try {
          await navigator.clipboard.writeText(prompt);
          copy.textContent = 'Kopiert ✓';
        } catch {
          const selection = window.getSelection();
          const range = document.createRange();
          range.selectNodeContents(line.querySelector('span'));
          selection.removeAllRanges();
          selection.addRange(range);
          copy.textContent = 'Text markiert';
        }
      });
      line.appendChild(copy);
      activities.appendChild(line);
    }
    activities.appendChild(element('p', 'Beobachtung: Alle Fragen behandeln dasselbe Thema, lenken den Blick aber auf unterschiedliche Seiten. Antworten können auch bei gleichem Prompt variieren.'));
  }

  // Karte durch Klicken oder Enter/Leertaste umdrehen.
  flipButton.addEventListener('click', () => {
    const flipped = flipButton.classList.toggle('is-flipped');
    flipButton.setAttribute('aria-pressed', String(flipped));
    flipButton.setAttribute('aria-label', flipped ? 'Frage anzeigen' : 'Antwort anzeigen');
    front.setAttribute('aria-hidden', String(flipped));
    back.setAttribute('aria-hidden', String(!flipped));
    extras.hidden = !flipped || (resources.hidden && activities.hidden);
  });

  byId('close-dialog').addEventListener('click', () => dialog.close());
  byId('prev-card').addEventListener('click', () => openCard(currentDay - 1));
  byId('next-card').addEventListener('click', () => openCard(currentDay + 1));

  // Wenn jemand neben die Karte auf die dunkle Fläche klickt: schließen.
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) dialog.close();
  });

  // Nach Schließen geht der Tastaturfokus zum zuletzt geöffneten Türchen zurück.
  dialog.addEventListener('close', () => {
    if (lastDoorButton) lastDoorButton.focus();
  });
})();
