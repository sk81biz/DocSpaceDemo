import React, { useState } from "react";
import styled from "styled-components";
import Heading from "@appserver/components/heading";
import ToggleButton from "@appserver/components/toggle-button";
import Error403 from "studio/Error403";
import Error520 from "studio/Error520";
import ConnectClouds from "./ConnectedClouds";
import { inject, observer } from "mobx-react";
import { loopTreeFolders } from "../../../../helpers/files-helpers";
import toastr from "@appserver/components/toast/toastr";

const StyledSettings = styled.div`
  display: grid;
  grid-gap: 19px;

  .toggle-btn {
    position: relative;
  }

  .heading {
    margin-bottom: 1px;
    margin-top: 26px;
  }

  .toggle-button-text {
    margin-top: -1px;
  }
`;

const SectionBodyContent = ({
  setting,
  isLoading,
  storeForceSave,
  setStoreForceSave,
  enableThirdParty,
  setEnableThirdParty,
  storeOriginalFiles,
  setStoreOriginal,
  confirmDelete,
  setConfirmDelete,
  updateIfExist,
  setUpdateIfExist,
  forceSave,
  setForceSave,
  isAdmin,
  isErrorSettings,
  isLoadedSettingsTree,
  settingsIsLoaded,
  getFoldersTree,
  setTreeFolders,
  treeFolders,
  myFolderId,
  commonFolderId,
  t,
  isVisitor,
  favoritesSection,
  recentSection,
  setFavoritesSetting,
  setRecentSetting,
}) => {
  const [isLoadingFavorites, setIsLoadingFavorites] = useState(false);
  const [isLoadingRecent, setIsLoadingRecent] = useState(false);

  const onChangeStoreForceSave = () => {
    setStoreForceSave(!storeForceSave, "storeForceSave");
  };

  const onChangeThirdParty = () => {
    setEnableThirdParty(!enableThirdParty, "enableThirdParty").then(() => {
      getFoldersTree().then((data) => {
        const commonFolder = data.find((x) => x.id === commonFolderId);
        const myFolder = data.find((x) => x.id === myFolderId);

        const newTreeFolders = treeFolders;

        loopTreeFolders(
          myFolder.pathParts,
          newTreeFolders,
          myFolder.folders,
          myFolder.foldersCount,
          null
        );

        loopTreeFolders(
          commonFolder.pathParts,
          newTreeFolders,
          commonFolder.folders,
          commonFolder.foldersCount,
          null
        );
        setTreeFolders(newTreeFolders);
      });
    });
  };

  const renderAdminSettings = () => {
    return !isLoadedSettingsTree || isLoading ? null : (
      <StyledSettings>
        <ToggleButton
          className="toggle-btn"
          label={t("IntermediateVersion")}
          onChange={onChangeStoreForceSave}
          isChecked={storeForceSave}
        />
        <ToggleButton
          className="toggle-btn"
          label={t("ThirdPartyBtn")}
          onChange={onChangeThirdParty}
          isChecked={enableThirdParty}
        />
      </StyledSettings>
    );
  };

  const onChangeOriginalCopy = () => {
    setStoreOriginal(!storeOriginalFiles, "storeOriginalFiles");
  };

  const onChangeDeleteConfirm = () => {
    setConfirmDelete(!confirmDelete, "confirmDelete");
  };

  const onChangeUpdateIfExist = () => {
    setUpdateIfExist(!updateIfExist, "updateIfExist");
  };

  const onChangeForceSave = () => {
    setForceSave(!forceSave, "forceSave");
  };

  const onChangeFavorites = (e) => {
    setIsLoadingFavorites(true);
    setFavoritesSetting(e.target.checked, "favoritesSection")
      .catch((err) => toastr.error(err))
      .finally(() => setIsLoadingFavorites(false));
  };

  const onChangeRecent = (e) => {
    setIsLoadingRecent(true);
    setRecentSetting(e.target.checked, "recentSection")
      .catch((err) => toastr.error(err))
      .finally(() => setIsLoadingRecent(false));
  };

  const renderCommonSettings = () => {
    return !isLoadedSettingsTree || isLoading ? null : (
      <StyledSettings>
        <ToggleButton
          className="toggle-btn"
          label={t("OriginalCopy")}
          onChange={onChangeOriginalCopy}
          isChecked={storeOriginalFiles}
        />
        <ToggleButton
          className="toggle-btn"
          label={t("DisplayNotification")}
          onChange={onChangeDeleteConfirm}
          isChecked={confirmDelete}
        />
        {!isVisitor && (
          <>
            <ToggleButton
              isDisabled={isLoadingRecent}
              className="toggle-btn"
              label={t("DisplayRecent")}
              onChange={onChangeRecent}
              isChecked={recentSection}
            />

            <ToggleButton
              isDisabled={isLoadingFavorites}
              className="toggle-btn"
              label={t("DisplayFavorites")}
              onChange={onChangeFavorites}
              isChecked={favoritesSection}
            />
            <ToggleButton
              isDisabled={true}
              className="toggle-btn"
              label={t("DisplayTemplates")}
              onChange={(e) => console.log(e)}
              isChecked={false}
            />
          </>
        )}
        {!isVisitor && (
          <>
            <Heading className="heading" level={2} size="small">
              {t("StoringFileVersion")}
            </Heading>
            <ToggleButton
              className="toggle-btn"
              label={t("UpdateOrCreate")}
              onChange={onChangeUpdateIfExist}
              isChecked={updateIfExist}
            />
            <ToggleButton
              className="toggle-btn"
              label={t("KeepIntermediateVersion")}
              onChange={onChangeForceSave}
              isChecked={forceSave}
            />
          </>
        )}
      </StyledSettings>
    );
  };

  let content;

  if (setting === "admin" && isAdmin) content = renderAdminSettings();
  if (setting === "common") content = renderCommonSettings();
  if (setting === "thirdParty" && enableThirdParty) content = <ConnectClouds />;

  return !settingsIsLoaded ? null : (!enableThirdParty &&
      setting === "thirdParty") ||
    (!isAdmin && setting === "admin") ? (
    <Error403 />
  ) : isErrorSettings ? (
    <Error520 />
  ) : (
    content
  );
};

export default inject(
  ({ auth, filesStore, settingsStore, treeFoldersStore }) => {
    const { isLoading } = filesStore;
    const {
      isLoadedSettingsTree,
      storeOriginalFiles,
      confirmDelete,
      updateIfExist,
      forcesave,
      storeForcesave,
      enableThirdParty,
      setUpdateIfExist,
      setStoreOriginal,
      setEnableThirdParty,
      setConfirmDelete,
      setStoreForceSave,
      setForceSave,
      settingsIsLoaded,

      favoritesSection,
      recentSection,
      setFavoritesSetting,
      setRecentSetting,
    } = settingsStore;

    const {
      getFoldersTree,
      setTreeFolders,
      treeFolders,
      myFolderId,
      commonFolderId,
    } = treeFoldersStore;

    return {
      isAdmin: auth.isAdmin,
      isLoading,
      isLoadedSettingsTree,
      storeOriginalFiles,
      confirmDelete,
      updateIfExist,
      forceSave: forcesave,
      storeForceSave: storeForcesave,
      enableThirdParty,
      treeFolders,
      myFolderId,
      commonFolderId,
      isVisitor: auth.userStore.user.isVisitor,
      favoritesSection,
      recentSection,

      setUpdateIfExist,
      setStoreOriginal,
      setEnableThirdParty,
      setConfirmDelete,
      setStoreForceSave,
      setForceSave,
      settingsIsLoaded,
      getFoldersTree,
      setTreeFolders,
      setFavoritesSetting,
      setRecentSetting,
    };
  }
)(observer(SectionBodyContent));