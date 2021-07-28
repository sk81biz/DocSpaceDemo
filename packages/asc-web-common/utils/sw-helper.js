import React from "react";
import ReactDOM from "react-dom";

import { Workbox } from "workbox-window";
import SnackBar from "@appserver/components/snackbar";
import i18n from "i18next";
import { useTranslation, initReactI18next } from "react-i18next";
import Backend from "i18next-http-backend";
import { LANGUAGE } from "../constants";
import { loadLanguagePath } from "./";

i18n
  .use(Backend)
  .use(initReactI18next)
  .init({
    lng: localStorage.getItem(LANGUAGE) || "en",
    fallbackLng: "en",
    load: "all",
    //debug: true,

    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
      format: function (value, format) {
        if (format === "lowercase") return value.toLowerCase();
        return value;
      },
    },

    backend: {
      loadPath: loadLanguagePath(""),
    },

    react: {
      useSuspense: false,
    },
  });

const SnackBarWrapper = (props) => {
  const { t, ready } = useTranslation("Common", { i18n });

  if (ready) {
    const barConfig = {
      parentElementId: "snackbar",
      text: t("NewVersionAvailable"),
      btnText: t("Load"),
      onAction: () => props.onButtonClick(),
      opacity: 1,
    };

    return <SnackBar {...barConfig} />;
  }
  return <></>;
};

const registerSW = () => {
  if (process.env.NODE_ENV === "production" && "serviceWorker" in navigator) {
    const wb = new Workbox(`/sw.js`);

    //TODO: watch https://developers.google.com/web/tools/workbox/guides/advanced-recipes and https://github.com/webmaxru/prog-web-news/blob/5ff94b45c9d317409c21c0fbb7d76e92f064471b/src/app/app-shell/app-shell.component.ts

    const showSkipWaitingPrompt = (event) => {
      console.log(
        `A new service worker has installed, but it can't activate` +
          `until all tabs running the current version have fully unloaded.`
      );

      try {
        const snackbarNode = document.createElement("div");
        snackbarNode.id = "snackbar";
        document.body.appendChild(snackbarNode);

        ReactDOM.render(
          <SnackBarWrapper
            onButtonClick={() => {
              snackbarNode.remove();

              wb.addEventListener("controlling", () => {
                window.location.reload();
              });

              wb.messageSkipWaiting();
            }}
          />,
          document.getElementById("snackbar")
        );
      } catch (e) {
        console.error("showSkipWaitingPrompt", e);
        wb.addEventListener("controlling", () => {
          window.location.reload();
        });

        // This will postMessage() to the waiting service worker.
        wb.messageSkipWaiting();
      }
      // let snackBarRef = this.snackBar.open(

      //   "A new version of the website available",
      //   "Reload page",
      //   {
      //     duration: 5000,
      //   }
      // );

      // // Displaying prompt

      // snackBarRef.onAction().subscribe(() => {
      //   // Assuming the user accepted the update, set up a listener
      //   // that will reload the page as soon as the previously waiting
      //   // service worker has taken control.
      //   wb.addEventListener("controlling", () => {
      //     window.location.reload();
      //   });

      //   // This will postMessage() to the waiting service worker.
      //   wb.messageSkipWaiting();
      // });
    };

    // Add an event listener to detect when the registered
    // service worker has installed but is waiting to activate.
    wb.addEventListener("waiting", showSkipWaitingPrompt);

    wb.register()
      .then((reg) => {
        console.log("Successful service worker registration", reg);
      })
      .catch((err) => console.error("Service worker registration failed", err));
  } else {
    console.log("SKIP registerSW because of DEV mode");
  }
};

window.SW = {
  registerSW: registerSW,
};

export { registerSW };
