/**
 * Translations for the "How It Works" page.
 * Each language is stored in a separate JSON file under src/locales/hiw/.
 */

import en from './locales/hiw/en.json';
import vi from './locales/hiw/vi.json';
import id from './locales/hiw/id.json';
import zh from './locales/hiw/zh.json';
import ko from './locales/hiw/ko.json';
import ja from './locales/hiw/ja.json';
import fr from './locales/hiw/fr.json';
import de from './locales/hiw/de.json';
import es from './locales/hiw/es.json';
import th from './locales/hiw/th.json';
import ms from './locales/hiw/ms.json';
import ru from './locales/hiw/ru.json';
import fil from './locales/hiw/fil.json';
import pt from './locales/hiw/pt.json';

export type HiwTranslation = typeof en;

export const hiwTranslations: Record<string, HiwTranslation> = {
  en, vi, id, zh, ko, ja, fr, de, es, th, ms, ru, fil, pt,
};
