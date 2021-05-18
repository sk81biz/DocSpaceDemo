import i18n from "i18next";
import Backend from "i18next-http-backend";
import { LANGUAGE } from "@appserver/common/constants";
import config from "../../../../../package.json";

//import LanguageDetector from "i18next-browser-languagedetector";
// not like to use this?
// have a look at the Quick start guide
// for passing in lng and translations on init

const newInstance = i18n.createInstance();

newInstance.use(Backend).init({
  lng: localStorage.getItem(LANGUAGE) || "en",
  fallbackLng: "en",
  load: "languageOnly",
  //debug: true,

  interpolation: {
    escapeValue: false, // not needed for react as it escapes by default
    format: function (value, format) {
      if (format === "lowercase") return value.toLowerCase();
      return value;
    },
  },

  backend: {
    loadPath: (lng, ns) => {
      if (ns.length > 0 && ns[0] === "Common") {
        return `/static/locales/${lng}/Common.json`;
      }
      return `${config.homepage}/locales/${lng}/Error520.json`;
    },
  },

  react: {
    useSuspense: false,
  },
});

export default newInstance;
