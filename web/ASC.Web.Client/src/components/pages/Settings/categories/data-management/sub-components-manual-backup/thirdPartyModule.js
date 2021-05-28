import React from "react";
import { withTranslation } from "react-i18next";
import SelectedFolder from "files/SelectedFolder";
import Button from "@appserver/components/button";

import { startBackup } from "@appserver/common/api/portal";
import { inject, observer } from "mobx-react";
import Box from "@appserver/components/box";
import Link from "@appserver/components/link";
import { saveToSessionStorage, getFromSessionStorage } from "../../../utils";

let selectedManualBackupFromSessionStorage = "";

class ThirdPartyModule extends React.Component {
  constructor(props) {
    super(props);
    selectedManualBackupFromSessionStorage = getFromSessionStorage(
      "selectedManualStorageType"
    );
    this.state = {
      isLoadingData: false,
      selectedFolder: "",
      isPanelVisible: false,
      isError: false,
    };
    this._isMounted = false;
  }

  componentDidMount() {
    this._isMounted = true;
  }
  componentWillUnmount() {
    this._isMounted = false;
  }
  onSetLoadingData = (isLoading) => {
    this._isMounted &&
      this.setState({
        isLoadingData: isLoading,
      });
  };

  onSelectFolder = (folderId) => {
    console.log("folderId", folderId);
    this._isMounted &&
      this.setState({
        selectedFolder: folderId,
        isChanged: true,
      });
  };

  onClickInput = () => {
    this.setState({
      isPanelVisible: true,
    });
  };

  onClose = () => {
    this.setState({
      isPanelVisible: false,
    });
  };
  isInvalidForm = () => {
    const { selectedFolder } = this.state;

    if (selectedFolder) return false;

    this.setState({
      isError: true,
    });
    return true;
  };
  onClickButton = () => {
    console.log("selectedFolder", selectedFolder);
    saveToSessionStorage("selectedManualStorageType", "thirdPartyResource");
    const { selectedFolder, isError } = this.state;
    const { setInterval } = this.props;

    if (this.isInvalidForm()) return;

    isError &&
      this.setState({
        isError: false,
      });

    const storageParams = [
      {
        key: "folderId",
        value: selectedFolder[0],
      },
    ];
    startBackup("1", storageParams);
    setInterval();
  };
  render() {
    const {
      maxProgress,
      t,
      helpUrlCreatingBackup,
      isCopyingLocal,
    } = this.props;
    const { isPanelVisible, isLoadingData, isError } = this.state;
    return (
      <div className="category-item-wrapper">
        <Box marginProp="16px 0 16px 0">
          <Link
            color="#316DAA"
            target="_blank"
            isHovered={true}
            href={helpUrlCreatingBackup}
          >
            {t("LearnMore")}
          </Link>
        </Box>

        <SelectedFolder
          onSelectFolder={this.onSelectFolder}
          name={"thirdParty"}
          onClose={this.onClose}
          onClickInput={this.onClickInput}
          onSetLoadingData={this.onSetLoadingData}
          isSavingProcess={isCopyingLocal}
          isPanelVisible={isPanelVisible}
          isError={isError}
          withoutTopLevelFolder
          isThirdPartyFolders
        />

        <div className="manual-backup_buttons">
          <Button
            label={t("MakeCopy")}
            onClick={this.onClickButton}
            primary
            isDisabled={!maxProgress || isLoadingData}
            size="medium"
            tabIndex={10}
          />
          {!maxProgress && (
            <Button
              label={t("Copying")}
              onClick={() => console.log("click")}
              isDisabled={true}
              size="medium"
              style={{ marginLeft: "8px" }}
              tabIndex={11}
            />
          )}
        </div>
      </div>
    );
  }
}
export default inject(({ auth }) => {
  const { helpUrlCreatingBackup } = auth.settingsStore;
  return {
    helpUrlCreatingBackup,
  };
})(withTranslation("Settings")(observer(ThirdPartyModule)));
