import styled from 'styled-components';
import { Button } from 'crox-new-uikit';

export const InputSelectorButton = styled(Button)`
    display: flex;
    padding: 10px;
    background-color: transparent;
    border: none;
    width: 180px;
    box-shadow: none;
    align-items: center;
    @media screen and (max-width: 800px) {
    padding: 3px 12px;
    }
    &:hover:not(:disabled):not(.button--disabled):not(:active) {
    background-color: transparent;
    border: none;
    }
    &:active {
    background-color: transparent;
    box-shadow: none;
    }
    &:focus:not(:active) {
    box-shadow: none;
    }
`

export const InputNetworkSelectorButton = styled(Button)`
    display: flex;
    padding: 10px;
    background-color: transparent;
    border: none;
    box-shadow: none;
    align-items: center;
    @media screen and (max-width: 500px) {
    display: contents;
    .networkname {
        text-align: center !important;
    }
    }
    &:hover:not(:disabled):not(.button--disabled):not(:active) {
    background-color: transparent;
    border: none;
    }
    &:active {
    background-color: transparent;
    box-shadow: none;
    }
    &:focus:not(:active) {
    box-shadow: none;
    }
`

export const InputBalance = styled.input`
    font-size: 20px;
    color: #ced0f9;
    font-weight: 400;
    border: none;
    outline: none;
    width: 356px;
    text-align: right;
    background-color: transparent;
    padding: 0 15px;
    @media screen and (max-width: 600px) {
    padding: 0 10px;
    width: 67%;
    }
`

export const MaxButton = styled.button`
    display: flex;
    color: white;
    font-weight: 400;
    font-size: 16px;
    cursor: pointer;
    background-color: #2d74c4;
    margin: auto 0;
    border: none;
    border-radius: 10px;
    transition: .5s all;
    &:hover {
    opacity: 0.8;
    }
`

export const BinanceButton = styled.div`
    background-color: transparent;
    border: none;
`

export const PolygonButton = styled.div`
    background-color: transparent;
    border: none;
`

export const SelectBridge = styled.div`
    margin: 10px 0;
`

export const ItemWrap = styled.div`
    display: flex;
    gap: 16px;
    overflow-x: auto;
    flex-wrap: wrap;
    margin: 10px 0;
`

export const BridgeItem = styled.div`
    background: #2c2d3a;
    width: fit-content;
    padding: 15px;
    border-radius: 20px;
    border: 1px solid #fff;
    flex-wrap: wrap;
    display: flex;
    font-size: 20px;

    &:hover, &:active, &:focus  {
        background: #22232d;
        border: 1px solid rgb(255, 255, 255);
    }
`

export const ActiveTx = styled.div`
  padding: 10px;
  background-color: #23242F;
  border-radius: 10px;
  text-align: center;
  width: 300px;
  transition: all ease 200ms;
  @media screen and (max-width: 1000px) {
    max-width: 500px;
    width: 90%;
    margin: auto;
  }
`

export const Tooltip = styled.p<{ isTooltipDisplayed: boolean }>`
    display: ${({ isTooltipDisplayed }) => (isTooltipDisplayed ? "block" : "none")};
    bottom: -22px;
    right: 0;
    left: 0;
    text-align: center;
    background-color: #3b3c4e;
    color: white;
    border-radius: 16px;
    opacity: 0.7;
    padding-top: 4px;
    position: absolute;
`;

export const customStyles = {
    body: {
        overflow: 'hidden'
    },
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        backgroundColor: "transparent",
        border: 'none',
        overflow: 'hidden'
    },
};

export const BridgeBtn = styled(Button)`
    width: 100%;
    margin: auto;
    border-radius: 5px;
    padding: 28px 0;
    font-size: 16px;
    font-weight: bold;
`

export const Nodata = styled.div`
    text-align: center;
    margin: 10px;
`