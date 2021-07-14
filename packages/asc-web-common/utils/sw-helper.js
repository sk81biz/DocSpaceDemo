import { Workbox } from "workbox-window";
import { Snackbar } from "@appserver/components/snackbar";
import { useTranslation } from "react-i18next";

export function registerSW(homepage) {
  if (process.env.NODE_ENV === "production" && "serviceWorker" in navigator) {
    const wb = new Workbox(`${homepage}/sw.js`);
    const { t } = useTranslation("Common", {
      useSuspense: false,
    });

    //TODO: watch https://developers.google.com/web/tools/workbox/guides/advanced-recipes and https://github.com/webmaxru/prog-web-news/blob/5ff94b45c9d317409c21c0fbb7d76e92f064471b/src/app/app-shell/app-shell.component.ts

    const showSkipWaitingPrompt = (event) => {
      console.log(
        `A new service worker has installed, but it can't activate` +
          `until all tabs running the current version have fully unloaded.`
      );

      const barConfig = {
        textBody: t("NewVersionAvailable"),
        pos: "top_center",
        showSecondButton: true,
        secondButtonText: t("Reload"),

        onSecondButtonClick: (element) => {
          element.style.opacity = 0;
          // Assuming the user accepted the update, set up a listener
          // that will reload the page as soon as the previously waiting
          // service worker has taken control.
          wb.addEventListener("controlling", () => {
            window.location.reload();
          });

          // This will postMessage() to the waiting service worker.
          wb.messageSkipWaiting();
        },
      };

      Snackbar.show(barConfig);

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
}
