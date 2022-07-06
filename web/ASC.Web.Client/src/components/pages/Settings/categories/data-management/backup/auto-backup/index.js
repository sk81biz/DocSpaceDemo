import React from "react";
import moment from "moment";
import { isMobileOnly } from "react-device-detect";
import { withTranslation } from "react-i18next";
import { inject, observer } from "mobx-react";
import RadioButton from "@appserver/components/radio-button";
import Text from "@appserver/components/text";
import Button from "@appserver/components/button";
import {
  deleteBackupSchedule,
  getBackupSchedule,
  createBackupSchedule,
} from "@appserver/common/api/portal";
import Loader from "@appserver/components/loader";
import toastr from "@appserver/components/toast/toastr";
import {
  BackupStorageType,
  AutoBackupPeriod,
} from "@appserver/common/constants";
import ToggleButton from "@appserver/components/toggle-button";
import { getBackupStorage } from "@appserver/common/api/settings";
import SelectFolderDialog from "files/SelectFolderDialog";
import { StyledModules, StyledAutoBackup } from "../StyledBackup";
import ThirdPartyModule from "./sub-components/ThirdPartyModule";
import DocumentsModule from "./sub-components/DocumentsModule";
import ThirdPartyStorageModule from "./sub-components/ThirdPartyStorageModule";
import { getThirdPartyCommonFolderTree } from "@appserver/common/api/files";
const {
  DocumentModuleType,
  ResourcesModuleType,
  StorageModuleType,
} = BackupStorageType;
const { EveryDayType, EveryWeekType, EveryMonthType } = AutoBackupPeriod;

class AutomaticBackup extends React.PureComponent {
  constructor(props) {
    super(props);
    const { t, language } = props;

    moment.locale(language);

    this.state = {
      isEnable: false,
      isLoadingData: false,
      isInitialLoading: !isMobileOnly ? false : true,
      isAdditionalChanged: false,
      isReset: false,
      isSuccessSave: false,
      isError: false,
    };

    this.periodsObject = [
      {
        key: 0,
        label: t("EveryDay"),
      },
      {
        key: 1,
        label: t("EveryWeek"),
      },
      {
        key: 2,
        label: t("EveryMonth"),
      },
    ];

    this.hoursArray = [];
    this.monthNumbersArray = [];
    this.maxNumberCopiesArray = [];
    this.weekdaysLabelArray = [];
    this.formSettings = "";

    this.getTime();
    this.getMonthNumbers();
    this.getMaxNumberCopies();
  }

  setBasicSettings = async () => {
    const {
      setDefaultOptions,
      t,
      setThirdPartyStorage,
      setBackupSchedule,
      setCommonThirdPartyList,
      getProgress,
    } = this.props;
    try {
      getProgress(t);

      const [
        commonThirdPartyList,
        backupSchedule,
        backupStorage,
      ] = await Promise.all([
        getThirdPartyCommonFolderTree,
        getBackupSchedule(),
        getBackupStorage(),
      ]);

      setThirdPartyStorage(backupStorage);
      setBackupSchedule(backupSchedule);
      commonThirdPartyList && setCommonThirdPartyList(commonThirdPartyList);

      setDefaultOptions(t, this.periodsObject, this.weekdaysLabelArray);

      this.setState({
        isEnable: !!backupSchedule,
        isInitialLoading: false,
      });
    } catch (error) {
      toastr.error(error);
    }
  };

  componentDidMount() {
    this.getWeekdays();

    this.setBasicSettings();
  }

  componentWillUnmount() {
    const { clearProgressInterval } = this.props;
    clearProgressInterval();
  }

  getTime = () => {
    for (let item = 0; item < 24; item++) {
      let obj = {
        key: item,
        label: `${item}:00`,
      };
      this.hoursArray.push(obj);
    }
  };

  getMonthNumbers = () => {
    for (let item = 1; item <= 31; item++) {
      let obj = {
        key: item,
        label: `${item}`,
      };
      this.monthNumbersArray.push(obj);
    }
  };

  getMaxNumberCopies = () => {
    const { t } = this.props;
    for (let item = 1; item <= 30; item++) {
      let obj = {
        key: `${item}`,
        label: `${t("MaxCopies", { copiesCount: item })}`,
      };
      this.maxNumberCopiesArray.push(obj);
    }
  };
  getWeekdays = () => {
    const { language } = this.props;
    const gettingWeekdays = moment.weekdays();

    for (let item = 0; item < gettingWeekdays.length; item++) {
      let obj = {
        key: `${item + 1}`,
        label: `${gettingWeekdays[item]}`,
      };
      this.weekdaysLabelArray.push(obj);
    }

    const isEnglishLanguage = language === "en";

    if (!isEnglishLanguage) {
      this.weekdaysLabelArray.push(this.weekdaysLabelArray.shift());
    }
  };

  onClickPermissions = () => {
    const { isEnable } = this.state;
    const { seStorageType, backupSchedule } = this.props;

    seStorageType(DocumentModuleType.toString());

    if (backupSchedule) {
      this.setState({
        isAdditionalChanged: !isEnable ? false : true,
      });
    } else {
      this.setState({
        isAdditionalChanged: isEnable ? true : false,
      });
    }
    this.setState({
      isEnable: !isEnable,
    });
  };

  onClickShowStorage = (e) => {
    const { seStorageType } = this.props;
    const key = e.target.name;
    seStorageType(key);
  };

  onCancelModuleSettings = () => {
    const { isError, isEnable } = this.state;
    const {
      toDefault,
      backupSchedule,
      resetStorageSettings,
      isCheckedThirdPartyStorage,
    } = this.props;

    toDefault();

    if (!!backupSchedule) {
      !isEnable && this.setState({ isEnable: true });
    } else {
      isEnable && this.setState({ isEnable: false });
    }
    console.log("isCheckedThirdPartyStorage", isCheckedThirdPartyStorage);
    isCheckedThirdPartyStorage && resetStorageSettings();

    this.setState({
      ...(isError && { isError: false }),
      isAdditionalChanged: false,
    });
  };

  canSave = () => {
    const {
      isCheckedDocuments,
      isCheckedThirdParty,
      isCheckedThirdPartyStorage,
      selectedFolderId,
      isFormReady,
    } = this.props;

    if (
      (isCheckedDocuments && !selectedFolderId) ||
      (isCheckedThirdParty && !selectedFolderId)
    ) {
      this.setState({
        isError: true,
      });
      return false;
    }

    if (isCheckedThirdPartyStorage) {
      return isFormReady();
    }
    return true;
  };
  onSaveModuleSettings = async () => {
    const { isEnable } = this.state;

    const {
      isCheckedDocuments,
      isCheckedThirdParty,
      isCheckedThirdPartyStorage,

      selectedMaxCopiesNumber,
      selectedPeriodNumber,
      selectedWeekday,
      selectedHour,
      selectedMonthDay,
      selectedStorageId,
      selectedFolderId,

      getStorageParams,
    } = this.props;

    if (!isEnable) {
      this.deleteSchedule();
      return;
    }

    if (!this.canSave()) return;

    this.setState({ isLoadingData: true }, function () {
      let day, period;

      if (selectedPeriodNumber === "1") {
        period = EveryWeekType;
        day = selectedWeekday;
      } else {
        if (selectedPeriodNumber === "2") {
          period = EveryMonthType;
          day = selectedMonthDay;
        } else {
          period = EveryDayType;
          day = null;
        }
      }
      let time = selectedHour.substring(0, selectedHour.indexOf(":"));

      const storageType = isCheckedDocuments
        ? DocumentModuleType
        : isCheckedThirdParty
        ? ResourcesModuleType
        : StorageModuleType;

      const storageParams = getStorageParams(
        isCheckedThirdPartyStorage,
        selectedFolderId,
        selectedStorageId
      );

      console.log("storageParams", storageParams);
      return;
      this.createSchedule(
        storageType.toString(),
        storageParams,
        selectedMaxCopiesNumber,
        period.toString(),
        time,
        day?.toString()
      );
    });
  };

  createSchedule = async (
    storageType,
    storageParams,
    selectedMaxCopiesNumber,
    period,
    time,
    day
  ) => {
    const {
      t,
      setThirdPartyStorage,
      setDefaultOptions,
      setBackupSchedule,
      updateStorageDefaultSettings,
      isCheckedThirdPartyStorage,
    } = this.props;

    try {
      await createBackupSchedule(
        storageType,
        storageParams,
        selectedMaxCopiesNumber,
        period,
        time,
        day
      );

      const [selectedSchedule, storageInfo] = await Promise.all([
        getBackupSchedule(),
        getBackupStorage(),
      ]);

      setBackupSchedule(selectedSchedule);
      setThirdPartyStorage(storageInfo);
      setDefaultOptions(t, this.periodsObject, this.weekdaysLabelArray);

      isCheckedThirdPartyStorage && updateStorageDefaultSettings();

      toastr.success(t("SuccessfullySaveSettingsMessage"));
      this.setState({
        isLoadingData: false,
        isAdditionalChanged: false,
      });
    } catch (e) {
      toastr.error(e);
      this.setState({
        isLoadingData: false,
      });
    }
  };

  deleteSchedule = () => {
    const { t, deleteSchedule } = this.props;
    this.setState({ isLoadingData: true }, () => {
      deleteBackupSchedule()
        .then(() => {
          deleteSchedule(this.weekdaysLabelArray);
          toastr.success(t("SuccessfullySaveSettingsMessage"));
          this.setState({
            isLoadingData: false,
            isAdditionalChanged: false,
          });
        })
        .catch((error) => {
          toastr.error(error);
          this.setState({
            isLoadingData: false,
          });
        });
    });
  };

  onSetIsChanged = (changed) => {
    this.setState({
      isAdditionalChanged: changed,
    });
  };

  render() {
    const {
      t,
      isChanged,
      isCheckedThirdPartyStorage,
      isCheckedThirdParty,
      isCheckedDocuments,
      commonThirdPartyList,
      buttonSize,
      organizationName,
      theme,
      renderTooltip,
    } = this.props;

    const {
      isInitialLoading,
      isEnable,
      isLoadingData,
      isError,
      isAdditionalChanged,
    } = this.state;

    const isDisabledThirdPartyList = commonThirdPartyList?.length === 0;

    const commonProps = {
      isLoadingData,
      monthNumbersArray: this.monthNumbersArray,
      hoursArray: this.hoursArray,
      maxNumberCopiesArray: this.maxNumberCopiesArray,
      periodsObject: this.periodsObject,
      weekdaysLabelArray: this.weekdaysLabelArray,
    };

    const commonRadioButtonProps = {
      fontSize: "13px",
      fontWeight: "400",
      value: "value",
      className: "backup_radio-button",
      onClick: this.onClickShowStorage,
    };

    return isInitialLoading ? (
      <Loader className="pageLoader" type="rombs" size="40px" />
    ) : (
      <StyledAutoBackup theme={theme}>
        <div className="backup_modules-header_wrapper">
          <Text isBold fontSize="16px">
            {t("AutoBackup")}
          </Text>
          {renderTooltip(
            t("AutoBackupHelp") +
              " " +
              t("AutoBackupHelpNote", { organizationName })
          )}
        </div>
        <Text className="backup_modules-description">
          {t("AutoBackupDescription")}
        </Text>
        <div className="backup_toggle-wrapper">
          <ToggleButton
            className="backup_toggle-btn"
            label={t("EnableAutomaticBackup")}
            onChange={this.onClickPermissions}
            isChecked={isEnable}
            isDisabled={isLoadingData}
          />
          <Text className="backup_toggle-btn-description">
            {t("EnableAutomaticBackupDescription")}
          </Text>
        </div>
        {isEnable && (
          <div className="backup_modules">
            <StyledModules>
              <RadioButton
                {...commonRadioButtonProps}
                label={t("DocumentsModule")}
                name={`${DocumentModuleType}`}
                key={0}
                isChecked={isCheckedDocuments}
                isDisabled={isLoadingData}
              />
              <Text className="backup-description">
                {t("DocumentsModuleDescription")}
              </Text>
              {isCheckedDocuments && (
                <DocumentsModule {...commonProps} isError={isError} />
              )}
            </StyledModules>

            <StyledModules isDisabled={isDisabledThirdPartyList}>
              <RadioButton
                {...commonRadioButtonProps}
                label={t("ThirdPartyResource")}
                name={`${ResourcesModuleType}`}
                isChecked={isCheckedThirdParty}
                isDisabled={isLoadingData || isDisabledThirdPartyList}
              />
              <Text className="backup-description">
                {t("ThirdPartyResourceDescription")}
              </Text>

              {isCheckedThirdParty && (
                <ThirdPartyModule
                  {...commonProps}
                  isError={isError}
                  defaultSelectedFolder={this.defaultSelectedFolder}
                  onSetDefaultFolderPath={this.onSetDefaultFolderPath}
                />
              )}
            </StyledModules>

            <StyledModules>
              <RadioButton
                {...commonRadioButtonProps}
                label={t("ThirdPartyStorage")}
                name={`${StorageModuleType}`}
                isChecked={isCheckedThirdPartyStorage}
                isDisabled={isLoadingData}
              />
              <Text className="backup-description">
                {t("ThirdPartyStorageDescription")}
              </Text>

              {isCheckedThirdPartyStorage && (
                <ThirdPartyStorageModule
                  {...commonProps}
                  onSetIsChanged={this.onSetIsChanged}
                />
              )}
            </StyledModules>
          </div>
        )}

        {(isAdditionalChanged || isChanged) && (
          <div className="auto-backup_buttons">
            <Button
              label={t("Common:SaveButton")}
              onClick={this.onSaveModuleSettings}
              primary
              isDisabled={isLoadingData}
              size={buttonSize}
              className="save-button"
            />

            <Button
              label={t("Common:CancelButton")}
              isDisabled={isLoadingData}
              onClick={this.onCancelModuleSettings}
              size={buttonSize}
            />
          </div>
        )}
      </StyledAutoBackup>
    );
  }
}
export default inject(({ auth, backup }) => {
  const { language, settingsStore } = auth;
const { organizationName, theme } = settingsStore;
  const {
    backupSchedule,
    commonThirdPartyList,
    clearProgressInterval,
    deleteSchedule,
    getProgress,
    setThirdPartyStorage,
    setDefaultOptions,
    setBackupSchedule,
    selectedStorageType,
    seStorageType,
    setCommonThirdPartyList,
    selectedPeriodLabel,
    selectedWeekdayLabel,
    selectedWeekday,
    selectedHour,
    selectedMonthDay,
    selectedMaxCopiesNumber,
    selectedPeriodNumber,
    selectedFolderId,
    selectedStorageId,
    isChanged,
    toDefault,
    isFormReady,
    getStorageParams,
    formSettings,
    updateDefaultSettings: updateStorageDefaultSettings,
    resetNewFormSettings: resetStorageSettings,
  } = backup;

  const isCheckedDocuments = selectedStorageType === `${DocumentModuleType}`;
  const isCheckedThirdParty = selectedStorageType === `${ResourcesModuleType}`;
  const isCheckedThirdPartyStorage =
    selectedStorageType === `${StorageModuleType}`;

  return {
    theme,
    language,
    isFormReady,
    organizationName,
    backupSchedule,
    commonThirdPartyList,
    clearProgressInterval,
    deleteSchedule,
    getProgress,
    setThirdPartyStorage,
    setDefaultOptions,
    setBackupSchedule,
    selectedStorageType,
    seStorageType,
    setCommonThirdPartyList,
    selectedPeriodLabel,
    selectedWeekdayLabel,
    selectedWeekday,
    selectedHour,
    selectedMonthDay,
    selectedMaxCopiesNumber,
    selectedPeriodNumber,
    selectedFolderId,
    selectedStorageId,
    isChanged,
    toDefault,

    isCheckedThirdPartyStorage,
    isCheckedThirdParty,
    isCheckedDocuments,

    formSettings,
    getStorageParams,

    updateStorageDefaultSettings,
    resetStorageSettings,
  };
})(withTranslation(["Settings", "Common"])(observer(AutomaticBackup)));
