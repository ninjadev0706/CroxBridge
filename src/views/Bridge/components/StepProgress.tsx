import React from 'react'
import styled from 'styled-components'
import { Text } from 'crox-new-uikit'

const Wrapper = styled.ul`
    width: 330px;
    font-size: 14px;
`

const TimeWrapper = styled.ul`
    position: relative;
    padding-left: 45px;
    list-style: none;

    &:before {
        display: inline-block;
        content: '';
        position: absolute;
        top: 0;
        left: 15px;
        width: 11px;
        height: 102px;
        border-right: 7px solid #fff;
    }
`

const StepItem = styled.li`
    position: relative;
    counter-increment: list;
    padding-bottom: 20px;
    &:before {
        display: inline-block;
        content: '';
        position: absolute;
        left: -30px;
        height: 100%;
        width: 10px;
    }
    &:after {
        content: '✔';
        display: inline-block;
        position: absolute;
        top: 0;
        left: -37px;
        width: 30px;
        height: 30px;
        border: 2px solid #fff;
        color: #23242F;
        border-radius: 50%;
        background-color: #FFF;
        font-size: 30px;
    }
`

const LatestItem = styled.li`
    position: relative;
    counter-increment: list;
    padding-bottom: 20px;
    &:after {
        width: 30px;
        height: 30px;
        background-image: url('/images/loading.svg');
        background-repeat: no-repeat;
        background-size: contain;
        content: '';
        display: inline-block;
        position: absolute;
        top: 0;
        left: -37px;
        // border: 2px solid #fff;
        color: #23242F;
        border-radius: 50%;
        // background-color: #FFF;
        font-size: 30px;
    }
`


const StepProgress = ({ isSuccess }) => {

    return (
        <Wrapper>
            <TimeWrapper>
                <StepItem><Text fontSize='20px'>Approve Token</Text></StepItem>
                <StepItem><Text fontSize='20px'>Send Transaction</Text>
                </StepItem>
                {
                    isSuccess ?
                        <StepItem><Text fontSize='20px'>Sign to Claim</Text></StepItem>
                        :
                        <LatestItem><Text fontSize='20px'>Sign to Claim</Text></LatestItem>
                }
            </TimeWrapper>
        </Wrapper>
    )
}

export default StepProgress;
