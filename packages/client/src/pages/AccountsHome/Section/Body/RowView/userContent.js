import React from "react";
import styled, { css } from "styled-components";
import { withRouter } from "react-router";
import { isTablet } from "react-device-detect";
import { withTranslation } from "react-i18next";

import RowContent from "@docspace/components/row-content";
import Link from "@docspace/components/link";

import Badges from "../Badges";

const StyledRowContent = styled(RowContent)`
  ${(props) =>
    ((props.sectionWidth <= 1024 && props.sectionWidth > 500) || isTablet) &&
    css`
      .row-main-container-wrapper {
        width: 100%;
        display: flex;
        justify-content: space-between;
        max-width: inherit;
      }

      .badges {
        flex-direction: row-reverse;
        margin-top: 9px;
        margin-right: 12px;

        .paid-badge {
          margin-left: 8px;
          margin-right: 0px;
        }
      }
    `}
`;

const UserContent = ({
  item,
  sectionWidth,

  onUserNameClick,
  t,
  theme,
}) => {
  const { userName, displayName, email, statusType, role } = item;

  const nameColor =
    statusType === "pending" || statusType === "disabled"
      ? theme.peopleTableRow.pendingNameColor
      : theme.peopleTableRow.nameColor;
  const sideInfoColor = theme.peopleTableRow.pendingSideInfoColor;

  const roleLabel =
    role === "owner"
      ? t("Common:Owner")
      : role === "admin"
      ? t("Administrator")
      : t("Common:User");

  return (
    <StyledRowContent
      sideColor={sideInfoColor}
      sectionWidth={sectionWidth}
      nameColor={nameColor}
      sideInfoColor={sideInfoColor}
    >
      <Link
        containerWidth="28%"
        type="page"
        href={`/accounts/view/${userName}`}
        title={displayName}
        fontWeight={600}
        onClick={onUserNameClick}
        fontSize="15px"
        color={nameColor}
        isTextOverflow={true}
      >
        {statusType === "pending" ? email : displayName}
      </Link>

      <Badges statusType={statusType} />

      <Link
        containerMinWidth="140px"
        containerWidth="17%"
        type="page"
        title={email}
        fontSize="12px"
        fontWeight={400}
        color={sideInfoColor}
        isTextOverflow={true}
      >
        {roleLabel}
      </Link>
      <Link
        containerMinWidth="140px"
        containerWidth="17%"
        type="page"
        title={email}
        fontSize="12px"
        fontWeight={400}
        color={sideInfoColor}
        isTextOverflow={true}
      >
        {email}
      </Link>
    </StyledRowContent>
  );
};

export default withTranslation(["People", "Common"])(withRouter(UserContent));
