import React, { useCallback } from "react";
import PropType from "prop-types";
import StyledSnackBar from "./styled-snackbar";
import StyledCrossIcon from "./styled-snackbar-action";
import StyledLogoIcon from "./styled-snackbar-logo";
import Box from "../box";
import Heading from "../heading";
import Text from "../text";

const SnackBar = ({
  text,
  headerText,
  btnText,
  onAction,
  textColor,
  showIcon,
  fontSize,
  fontWeight,
  textAlign,
  ...rest
}) => {
  const onActionClick = useCallback(
    (e) => {
      onAction && onAction(e);
    },
    [onAction]
  );

  const headerStyles = headerText ? {} : { display: "none" };

  console.log("Snackbar render");
  return (
    <StyledSnackBar {...rest}>
      {showIcon && (
        <Box className="logo">
          <StyledLogoIcon size="medium" color={textColor} />
        </Box>
      )}
      <Box className="text-container">
        <Heading
          size="xsmall"
          isInline={true}
          className="text-header"
          style={headerStyles}
          color={textColor}
          textAlign={textAlign}
        >
          {headerText}
        </Heading>
        <Text
          as="p"
          color={textColor}
          fontSize={fontSize}
          fontWeight={fontWeight}
          textAlign={textAlign}
        >
          {text}
        </Text>
      </Box>
      <button className="action" onClick={onActionClick}>
        {btnText ? (
          <Text color={textColor}>{btnText}</Text>
        ) : (
          <StyledCrossIcon size="medium" />
        )}
      </button>
    </StyledSnackBar>
  );
};

SnackBar.propTypes = {
  text: PropType.string,
  headerText: PropType.string,
  btnText: PropType.string,
  backgroundImg: PropType.string,
  backgroundColor: PropType.string,
  textColor: PropType.string,
  showIcon: PropType.bool,
  onAction: PropType.func,
  fontSize: PropType.string,
  fontWeight: PropType.string,
  textAlign: PropType.string,
};

SnackBar.defaultProps = {
  backgroundColor: "#f8f7bf",
  textColor: "#000",
  showIcon: true,
  fontSize: "13px",
  fontWeight: "400",
  textAlign: "left",
};

export default SnackBar;