import path from "path";
import fs from "fs";
import {
  getSettings,
  getBuildVersion,
  getAuthProviders,
  getCapabilities,
  getAppearanceTheme,
} from "@docspace/common/api/settings";

export const getAssets = (): assetsType => {
  const manifest = fs.readFileSync(
    path.join(__dirname, "client/manifest.json"),
    "utf-8"
  );

  const assets = JSON.parse(manifest);

  return assets;
};

export const getScripts = (assets: assetsType): string[] | void => {
  if (!assets || typeof assets !== "object") return;
  const regTest = /static\/js\/.*/;
  const keys = [];

  for (let key in assets) {
    if (assets.hasOwnProperty(key) && regTest.test(key)) {
      keys.push(key);
    }
  }

  return keys;
};

export const loadPath = (language: string, nameSpace: string): string => {
  let resourcePath = path.resolve(
    path.join(__dirname, "client", `locales/${language}/${nameSpace}.json`)
  );
  if (nameSpace === "Common")
    resourcePath = path.resolve(
      path.join(
        __dirname,
        `../../../public/locales/${language}/${nameSpace}.json`
      )
    );

  return resourcePath;
};

export const getInitialState = async (
  query: MatchType
): Promise<IInitialState> => {
  let portalSettings: IPortalSettings,
    buildInfo: IBuildInfo,
    providers: ProvidersType,
    capabilities: ICapabilities,
    availableThemes: IThemes;

  [
    portalSettings,
    buildInfo,
    providers,
    capabilities,
    availableThemes,
  ] = await Promise.all([
    getSettings(),
    getBuildVersion(),
    getAuthProviders(),
    getCapabilities(),
    getAppearanceTheme(),
  ]);

  const currentColorScheme = availableThemes.themes.find((theme) => {
    return availableThemes.selected === theme.id;
  });

  const initialState: IInitialState = {
    portalSettings,
    buildInfo,
    providers,
    capabilities,
    match: query,
    currentColorScheme,
  };

  return initialState;
};
