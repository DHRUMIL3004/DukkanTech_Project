import i18n from "i18next";
import {initReactI18next} from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import loginEn from "./en/login.json";
import loginGu from "./gu/login.json";

const resources={
    en:{login:loginEn},
    gu:{login:loginGu}
};

i18n
.use(LanguageDetector)
.use(initReactI18next)
.init({
    resources,
    lng: "en",
    fallbackLng:"en",
    supportedLangs:['en',"gu"],
    interpolation:{
        escapeValue:false,
    },
});

export default i18n;