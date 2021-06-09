import React from "react";
//import PropTypes from "prop-types";
import { withRouter } from "react-router";
import { isMobile } from "react-device-detect";
import axios from "axios";
import toastr from "studio/toastr";
import PageLayout from "@appserver/common/components/PageLayout";
import { showLoader, hideLoader } from "@appserver/common/utils";
import FilesFilter from "@appserver/common/api/files/filter";
import { getGroup } from "@appserver/common/api/groups";
import { getUserById } from "@appserver/common/api/people";
import { withTranslation, Trans } from "react-i18next";
import {
  ArticleBodyContent,
  ArticleHeaderContent,
  ArticleMainButtonContent,
} from "../../components/Article";
import {
  SectionBodyContent,
  SectionFilterContent,
  SectionHeaderContent,
  SectionPagingContent,
} from "./Section";

import MediaViewer from "./MediaViewer";
import DragTooltip from "../../components/DragTooltip";
import { observer, inject } from "mobx-react";
import config from "../../../package.json";
import globalColors from "@appserver/components/utils/globalColors";

const color = globalColors.blueMain;
const convertColor = globalColors.hoverSuccess;

class PureHome extends React.Component {
  componentDidMount() {
    const {
      fetchFiles,
      homepage,
      setIsLoading,
      setFirstLoad,
      isVisitor,
    } = this.props;

    const reg = new RegExp(`${homepage}((/?)$|/filter)`, "gm"); //TODO: Always find?
    const match = window.location.pathname.match(reg);
    let filterObj = null;

    if (match && match.length > 0) {
      filterObj = FilesFilter.getFilter(window.location);

      if (!filterObj) {
        filterObj = FilesFilter.getDefault();
        if (isVisitor) filterObj.folder = "@common";
        const folderId = filterObj.folder;
        setIsLoading(true);
        fetchFiles(folderId, filterObj).finally(() => {
          setIsLoading(false);
          setFirstLoad(false);
        });

        return;
      }
    }

    if (!filterObj) return;

    let dataObj = { filter: filterObj };

    if (filterObj && filterObj.authorType) {
      const authorType = filterObj.authorType;
      const indexOfUnderscore = authorType.indexOf("_");
      const type = authorType.slice(0, indexOfUnderscore);
      const itemId = authorType.slice(indexOfUnderscore + 1);

      if (itemId) {
        dataObj = {
          type,
          itemId,
          filter: filterObj,
        };
      } else {
        filterObj.authorType = null;
        dataObj = { filter: filterObj };
      }
    }

    if (!dataObj) return;

    const { filter, itemId, type } = dataObj;
    const newFilter = filter ? filter.clone() : FilesFilter.getDefault();
    const requests = [Promise.resolve(newFilter)];

    if (type === "group") {
      requests.push(getGroup(itemId));
    } else if (type === "user") {
      requests.push(getUserById(itemId));
    }

    setIsLoading(true);

    axios
      .all(requests)
      .catch((err) => {
        Promise.resolve(FilesFilter.getDefault());
        console.warn("Filter restored by default", err);
      })
      .then((data) => {
        const filter = data[0];
        const result = data[1];
        if (result) {
          const type = result.displayName ? "user" : "group";
          const selectedItem = {
            key: result.id,
            label: type === "user" ? result.displayName : result.name,
            type,
          };
          filter.selectedItem = selectedItem;
        }

        if (filter) {
          const folderId = filter.folder;
          //console.log("filter", filter);
          return fetchFiles(folderId, filter);
        }

        return Promise.resolve();
      })
      .finally(() => {
        setIsLoading(false);
        setFirstLoad(false);
      });
  }

  onDrop = (files, uploadToFolder) => {
    const {
      t,
      currentFolderId,
      startUpload,
      setDragging,
      dragging,
    } = this.props;
    const folderId = uploadToFolder ? uploadToFolder : currentFolderId;

    dragging && setDragging(false);
    startUpload(files, folderId, t);
  };

  showOperationToast = (type, qty, title) => {
    const { t } = this.props;
    switch (type) {
      case "move":
        if (qty > 1) {
          return toastr.success(
            <Trans t={t} i18nKey="MoveItems" ns="Home">
              {{ qty }} elements has been moved
            </Trans>
          );
        }
        return toastr.success(
          <Trans t={t} i18nKey="MoveItem" ns="Home">
            {{ title }} moved
          </Trans>
        );
      case "duplicate":
        if (qty > 1) {
          return toastr.success(
            <Trans t={t} i18nKey="CopyItems" ns="Home">
              {{ qty }} elements copied
            </Trans>
          );
        }
        return toastr.success(
          <Trans t={t} i18nKey="CopyItem" ns="Home">
            {{ title }} copied
          </Trans>
        );
      default:
        break;
    }
  };

  showUploadPanel = () => {
    const {
      uploaded,
      converted,
      uploadPanelVisible,
      setUploadPanelVisible,
      clearPrimaryProgressData,
      primaryProgressDataVisible,
    } = this.props;
    setUploadPanelVisible(!uploadPanelVisible);

    if (primaryProgressDataVisible && uploaded && converted)
      clearPrimaryProgressData();
  };
  componentDidUpdate(prevProps) {
    const {
      isLoading,
      isProgressFinished,
      secondaryProgressDataStoreIcon,
      selectionLength,
      selectionTitle,
    } = this.props;
    if (isLoading !== prevProps.isLoading) {
      if (isLoading) {
        showLoader();
      } else {
        hideLoader();
      }
    }
    if (this.props.isHeaderVisible !== prevProps.isHeaderVisible) {
      this.props.setHeaderVisible(this.props.isHeaderVisible);
    }
    if (
      isProgressFinished &&
      isProgressFinished !== prevProps.isProgressFinished
    ) {
      this.showOperationToast(
        secondaryProgressDataStoreIcon,
        selectionLength,
        selectionTitle
      );
    }
  }

  render() {
    //console.log("Home render");
    const {
      viewAs,
      fileActionId,
      firstLoad,
      isHeaderVisible,
      isRecycleBinFolder,

      primaryProgressDataVisible,
      primaryProgressDataPercent,
      primaryProgressDataIcon,
      primaryProgressDataAlert,

      secondaryProgressDataStoreVisible,
      secondaryProgressDataStorePercent,
      secondaryProgressDataStoreIcon,
      secondaryProgressDataStoreAlert,

      isLoading,
      dragging,

      uploaded,
      converted,
    } = this.props;

    const primaryProgressBarColor =
      uploaded && !converted ? convertColor : color;

    return (
      <>
        <MediaViewer />
        <DragTooltip />
        <PageLayout
          dragging={dragging}
          withBodyScroll
          withBodyAutoFocus={!isMobile}
          uploadFiles
          onDrop={isRecycleBinFolder ? null : this.onDrop}
          setSelections={this.props.setSelections}
          onMouseMove={this.onMouseMove}
          showPrimaryProgressBar={primaryProgressDataVisible}
          primaryProgressBarValue={primaryProgressDataPercent}
          primaryProgressBarIcon={primaryProgressDataIcon}
          primaryProgressBarColor={primaryProgressBarColor}
          showPrimaryButtonAlert={primaryProgressDataAlert}
          showSecondaryProgressBar={secondaryProgressDataStoreVisible}
          secondaryProgressBarValue={secondaryProgressDataStorePercent}
          secondaryProgressBarIcon={secondaryProgressDataStoreIcon}
          showSecondaryButtonAlert={secondaryProgressDataStoreAlert}
          viewAs={viewAs}
          hideAside={
            !!fileActionId ||
            primaryProgressDataVisible ||
            secondaryProgressDataStoreVisible
          }
          isLoaded={!firstLoad}
          isHeaderVisible={isHeaderVisible}
          onOpenUploadPanel={this.showUploadPanel}
          isLoading={isLoading}
        >
          <PageLayout.ArticleHeader>
            <ArticleHeaderContent />
          </PageLayout.ArticleHeader>

          <PageLayout.ArticleMainButton>
            <ArticleMainButtonContent />
          </PageLayout.ArticleMainButton>

          <PageLayout.ArticleBody>
            <ArticleBodyContent onTreeDrop={this.onDrop} />
          </PageLayout.ArticleBody>
          <PageLayout.SectionHeader>
            <SectionHeaderContent />
          </PageLayout.SectionHeader>

          <PageLayout.SectionFilter>
            <SectionFilterContent />
          </PageLayout.SectionFilter>

          <PageLayout.SectionBody>
            <SectionBodyContent />
          </PageLayout.SectionBody>

          <PageLayout.SectionPaging>
            <SectionPagingContent />
          </PageLayout.SectionPaging>
        </PageLayout>
      </>
    );
  }
}

const Home = withTranslation("Home")(PureHome);

export default inject(
  ({
    auth,
    filesStore,
    uploadDataStore,
    selectedFolderStore,
    treeFoldersStore,
  }) => {
    const {
      secondaryProgressDataStore,
      primaryProgressDataStore,
    } = uploadDataStore;
    const {
      firstLoad,
      setFirstLoad,
      fetchFiles,
      filter,
      fileActionStore,
      selection,
      setSelections,
      dragging,
      setDragging,
      setIsLoading,
      isLoading,
      viewAs,
    } = filesStore;

    const { id } = fileActionStore;
    const { isRecycleBinFolder } = treeFoldersStore;

    const {
      visible: primaryProgressDataVisible,
      percent: primaryProgressDataPercent,
      icon: primaryProgressDataIcon,
      alert: primaryProgressDataAlert,
      clearPrimaryProgressData,
    } = primaryProgressDataStore;

    const {
      visible: secondaryProgressDataStoreVisible,
      percent: secondaryProgressDataStorePercent,
      icon: secondaryProgressDataStoreIcon,
      alert: secondaryProgressDataStoreAlert,
      isSecondaryProgressFinished: isProgressFinished,
    } = secondaryProgressDataStore;

    const {
      setUploadPanelVisible,
      startUpload,
      uploaded,
      converted,
    } = uploadDataStore;

    const selectionLength = isProgressFinished ? selection.length : null;
    const selectionTitle = isProgressFinished
      ? filesStore.selectionTitle
      : null;

    return {
      homepage: config.homepage,
      firstLoad,
      dragging,
      fileActionId: id,
      currentFolderId: selectedFolderStore.id,
      isLoading,
      filter,
      viewAs,
      uploaded,
      converted,
      isRecycleBinFolder,
      isVisitor: auth.userStore.user.isVisitor,

      primaryProgressDataVisible,
      primaryProgressDataPercent,
      primaryProgressDataIcon,
      primaryProgressDataAlert,
      clearPrimaryProgressData,

      secondaryProgressDataStoreVisible,
      secondaryProgressDataStorePercent,
      secondaryProgressDataStoreIcon,
      secondaryProgressDataStoreAlert,

      selectionLength,
      isProgressFinished,
      selectionTitle,

      setFirstLoad,
      setDragging,
      setIsLoading,
      fetchFiles,
      setUploadPanelVisible,
      setSelections,
      startUpload,
      isHeaderVisible: auth.settingsStore.isHeaderVisible,
      setHeaderVisible: auth.settingsStore.setHeaderVisible,
    };
  }
)(withRouter(observer(Home)));
