import React from "react";
import styled from "styled-components";
import IconButton from "@docspace/components/icon-button";
import commonIconsStyles from "@docspace/components/utils/common-icons-style";
import { isMobile, isTablet } from "react-device-detect";
import { FileStatus } from "@docspace/common/constants";

import { ColorTheme, ThemeType } from "@docspace/common/components/ColorTheme";

export const StyledIcon = styled(IconButton)`
  ${commonIconsStyles}
`;

const QuickButtons = (props) => {
  const {
    item,
    theme,
    sectionWidth,
    isTrashFolder,
    accessToEdit,
    showShare,
    onClickLock,
    isDisabled,
    onClickFavorite,
    onClickShare,
    viewAs,
    isCanWebEdit,
  } = props;

  const { id, locked, fileStatus, title, fileExst, shared } = item;

  const isFavorite =
    (fileStatus & FileStatus.IsFavorite) === FileStatus.IsFavorite;

  const isTile = viewAs === "tile";

  const iconShare = shared
    ? "/static/images/shared.share.react.svg"
    : "/static/images/share.react.svg";

  const colorShare = shared
    ? theme.filesQuickButtons.sharedColor
    : theme.filesQuickButtons.color;

  const iconLock = locked
    ? "/static/images/file.actions.locked.react.svg"
    : "/static/images/locked.react.svg";

  const colorLock = locked
    ? theme.filesQuickButtons.sharedColor
    : theme.filesQuickButtons.color;

  const iconFavorite = isFavorite
    ? "/static/images/file.actions.favorite.react.svg"
    : "/static/images/favorite.react.svg";

  const colorFavorite = isFavorite
    ? theme.filesQuickButtons.sharedColor
    : theme.filesQuickButtons.color;

  const tabletViewQuickButton =
    (sectionWidth > 500 && sectionWidth <= 1024) || isTablet;

  const sizeQuickButton = isTile || tabletViewQuickButton ? "medium" : "small";

  const displayBadges = viewAs === "table" || isTile || tabletViewQuickButton;

  const setFavorite = () => onClickFavorite(isFavorite);

  return (
    <div className="badges additional-badges">
      {item.canShare && showShare && displayBadges && (
        <ColorTheme
          themeId={ThemeType.IconButton}
          shared={shared}
          iconName={iconShare}
          className="badge share-button-icon"
          size={sizeQuickButton}
          color={colorShare}
          onClick={onClickShare}
          hoverColor={theme.filesQuickButtons.sharedColor}
        />
      )}
      {fileExst &&
        accessToEdit &&
        !isTrashFolder &&
        displayBadges &&
        isCanWebEdit && (
          <ColorTheme
            themeId={ThemeType.IconButton}
            iconName={iconLock}
            locked={locked}
            className="badge lock-file icons-group"
            size={sizeQuickButton}
            data-id={id}
            data-locked={locked ? true : false}
            onClick={onClickLock}
            color={colorLock}
            isDisabled={isDisabled}
            hoverColor={theme.filesQuickButtons.sharedColor}
          />
        )}
      {fileExst && !isTrashFolder && displayBadges && (
        <ColorTheme
          themeId={ThemeType.IconButton}
          iconName={iconFavorite}
          isFavorite={isFavorite}
          className="favorite badge icons-group"
          size={sizeQuickButton}
          data-id={id}
          data-title={title}
          color={colorFavorite}
          onClick={setFavorite}
          hoverColor={theme.filesQuickButtons.hoverColor}
        />
      )}
    </div>
  );
};

export default QuickButtons;
