import styled from 'styled-components/native'

import {colors, fonts, metrics} from '../../../../../styles'

export const ContainerForm = styled.View`
    display: flex;
    align-items: center;
    flex-direction: column;
    width: 95%;
    padding: 5px;
`

export const InputControl = styled.View`
    display: flex;
    width: 90%;
    margin-top: 10px;
`

export const InputControlCheckBox = styled.View`
    display: flex;
    width: 90%;
    margin-top: 10px;

    flex-direction: row;
    align-items: center;
`


export const TextInput = styled.TextInput`
    border-bottom-width: 2px;
    width: 100%;
    color: #858c87;
    height: 40px;
    border-color: #858c87;
    opacity: 0.7;    

`

export const TextInputValor = styled.TextInput`
    border-bottom-width: 2px;
    width: 100%;
    color: #858c87;
    height: 60px;
    border-color: #858c87;
    opacity: 0.7;    

    font-size: 30px;
`

export const Label = styled.Text`
    font-size: 17px;
    font-family: ${fonts.familyType.semiBold};
`

export const SectionDetalhes = styled.View`
    width: 90%;
    align-items: center;
    display: flex;
    flex-direction: row;
    justify-content: center;
    flex: 1;
    margin: 20px;
`

export const TextDetalhes = styled.Text`
    margin-left: 10px;
    font-size: 17px;
    font-family: ${fonts.familyType.semiBold};
`

export const SectionCardsParcelas = styled.View`
    margin-top: 20px;
    height: 250px;
`

export const ContainerDetalhes = styled.View`
    align-items: flex-start;
    width: 90%;

`

export const DetalhesMensal = styled.Text`   
    font-family: ${fonts.familyType.regular};
    margin-left: 10px;
    margin-right: 10px;
`

