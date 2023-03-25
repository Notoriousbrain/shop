import { StepLabel, Stepper, Step, Typography } from "@material-ui/core";
import React, { Fragment } from "react";
import LocalShippingIcon from "@material-ui/icons/LocalShipping";
import LibraryAddCheckIcon from "@material-ui/icons/LibraryAddCheck";
import AccountBalanceIcon from "@material-ui/icons/AccountBalance";
import "./CheckoutStep.css";
const CheckoutSteps = ({ activeStep }) => {
  const step = [
    {
      label: <Typography>Shipping Details</Typography>,
      icon: <LocalShippingIcon />,
    },
    {
      label: <Typography>Confirm Order</Typography>,
      icon: <LibraryAddCheckIcon />,
    },
    {
      label: <Typography>Payment</Typography>,
      icon: <AccountBalanceIcon />,
    },
  ];
  const stepStyles = {
    boxSizing: "border-box",
    // width:"80%",
    margin: "0 10vw",
  };
  return (
    <Fragment>
      <Stepper alternativelable="true" activeStep={activeStep} style={stepStyles}>
        {step.map((item, index) => {
          return (
            <Step
              key={index}
              active={activeStep === index ? true : false}
              completed={activeStep >= index ? true : false}
            >
              <StepLabel
                style={
                  ({
                    display: "flex",
                    flexDirection: "column",
                    transform: "translateY(1vw)",
                    color: activeStep >= index ? "tomato" : "rgba(0,0,0,0.65)",
                  })
                }
                icon={item.icon}
              >
                {item.label}
              </StepLabel>
            </Step>
          );
        })}
      </Stepper>
    </Fragment>
  );
};

export default CheckoutSteps;
