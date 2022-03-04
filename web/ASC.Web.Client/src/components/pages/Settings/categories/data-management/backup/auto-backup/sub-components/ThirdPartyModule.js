import React from "react";
import { withTranslation } from "react-i18next";
import SelectFolderInput from "files/SelectFolderInput";
import ScheduleComponent from "./ScheduleComponent";
import { inject, observer } from "mobx-react";
import { BackupTypes } from "@appserver/common/constants";
class ThirdPartyModule extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      isPanelVisible: false,
    };
  }

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

  onSelectFolder = (selectedFolder) => {
    const { setSelectedFolder } = this.props;
    setSelectedFolder(selectedFolder);
  };

  render() {
    const { isPanelVisible } = this.state;
    const {
      isError,
      isLoadingData,
      isReset,
      isSuccessSave,
      passedId,
      ...rest
    } = this.props;

    return (
      <>
        <div className="auto-backup_folder-input">
          <SelectFolderInput
            onSelectFolder={this.onSelectFolder}
            onClose={this.onClose}
            onClickInput={this.onClickInput}
            isPanelVisible={isPanelVisible}
            isError={isError}
            foldersType="third-party"
            isSavingProcess={isLoadingData}
            id={passedId}
            isReset={isReset}
            isSuccessSave={isSuccessSave}
          />
        </div>
        <ScheduleComponent isLoadingData={isLoadingData} {...rest} />
      </>
    );
  }
}

export default inject(({ backup }) => {
  const { setSelectedFolder, defaultFolderId, defaultStorageType } = backup;

  const isResourcesDefault =
    defaultStorageType === `${BackupTypes.ResourcesModuleType}`;
  const passedId = isResourcesDefault ? defaultFolderId : "";

  return {
    setSelectedFolder,
    passedId,
  };
})(withTranslation("Settings")(observer(ThirdPartyModule)));
