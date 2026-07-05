import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import ru from "./locales/ru.json";
import en from "./locales/en.json";
import fi from "./locales/fi.json";

const STORAGE_KEY = "atf-lang";
const SUPPORTED = ["ru", "en", "fi"];

function detectLanguage() {
	const stored = window.localStorage.getItem(STORAGE_KEY);
	if (stored && SUPPORTED.includes(stored)) return stored;

	const browserLang = (navigator.language || "ru").slice(0, 2);
	return SUPPORTED.includes(browserLang) ? browserLang : "ru";
}

i18n.use(initReactI18next).init({
	resources: {
		ru: { translation: ru },
		en: { translation: en },
		fi: { translation: fi },
	},
	lng: detectLanguage(),
	fallbackLng: "ru",
	interpolation: { escapeValue: false },
});

i18n.on("languageChanged", (lng) => {
	window.localStorage.setItem(STORAGE_KEY, lng);
	document.documentElement.lang = lng;
});

export const SUPPORTED_LANGUAGES = SUPPORTED;
export default i18n;
