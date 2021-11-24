import styled from 'styled-components/native'

import {colors, fonts, metrics} from '../../../../../styles'
import { widthPixel, heightPixel } from '../../../../../helpers/responsiveness'

export const Button = styled.Image`
    width: 50px;
    height: 50px;
`

export const Container = styled.View`
    flex: 1px;
    background-color: #F5FCFF;
    font-family: ${fonts.familyType.regular};
    padding: 10%;
`

export const Welcome = styled.Text`
    font-size: 20px;
    text-align: center;
    margin: 10px;
`

export const Action = styled.Text`
    text-align: center;
    color: #0000FF;
    margin: 5px 0;
    font-weight: bold;
`

export const Instructions = styled.Text`
    font-family: ${`${fonts.familyType.semiBold}`};
    font-size: ${`${fonts.size.medium - 1.5}px`};
    color: #333333;
    width: 100%;
    padding: 20% 0 10% 0;
`
export const Bold = styled.Text`
    font-family: ${`${fonts.familyType.bold}`};
    color: #333333;
`

export const Stat = styled.Text`
    text-align: center;
    color: #B0171F;
    margin-bottom: 1px;
`

export const Header = styled.View`
    width: 100%;
    height: 90px;
`

export const ButtonRecord = styled.TouchableOpacity`
    margin: 30px auto;
`

export const ContainerResults = styled.ScrollView`
    width: 100%;
    height: auto;
    background-color: #f5f2f3;
    margin-bottom: 10%;
`

export const ContainerItem = styled.View`
    width: 80%;        
`
