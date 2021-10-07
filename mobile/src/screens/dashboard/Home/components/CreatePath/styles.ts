import styled from 'styled-components/native'

export const Container = styled.View`
    display: flex;
    align-items: center;
    background-color: white;
    width: 90%;
    height: 25%;
    border-radius: 15px;
    margin-bottom: 15px;
    margin-top: 15px;
    justify-content: space-between;
    flex-direction: row;
    align-items: center;

`
export const SectionButton = styled.View`
    background: #EE4266;
    height: 100%;
    width: 15%;
    border-radius: 15px;
    justifyContent: center;
    alignItems: center;
    flex:1;
    padding: 0
`

export const Plus = styled.Text`
    font-size: 25px;
    font-weight: bold;
    
`
export const LabelDescriptionCreate = styled.Text`
    font-size: 20px;
    font-weight: bold;
    color: #555;
    
`
export const LabelManager = styled.Text`
    font-weight: 600;
    color: #444;
    font-size: 20px;
`

export const ContainerCardCreate = styled.View`
    display: flex;

    justify-content: space-between;
    flex-direction: row;

    align-items: center;
    margin-top: 15px;
`
export const SectionDescription = styled.View`
    display: flex;
    width: 85%;
    flex-direction: row;
`
export const ContainerCreate = styled.View`
    margin-top: 15px;
    margin-bottom: 15px;
    width: 85%;
    padding: 5%
`

export const SectionName = styled.View`
    margin-left: 10px;
`
export const LabelName = styled.Text`
    font-size: 20px;
`
export const LabelCategory = styled.Text`
    color: #888;
    font-size: 15px;
`
export const SectionCreate = styled.View`

`
export const LabelCreate = styled.Text`
    font-size: 18px;
`
export const SectionIcon = styled.View`
    width: 45px;
    height: 45px;
    border-radius: 50px;
    border-width: 4px;
    border-color: #444;
    align-items: center;
    justify-content: center;
`