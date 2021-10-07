import React, { useEffect, useRef, useState } from 'react'

import { Modalize } from 'react-native-modalize';
import {Text} from 'react-native'

import InputText from './components/InputText'
import Button from '../../../../../components/Button'
import {Conta, UseContas} from '../../../../../contexts/AccountContext'
import retornarIdDoUsuario from '../../../../../helpers/retornarIdDoUsuario'

import SelectionCategoriesAccount from './components/SelectionCategoriesAccount'

import {
    Container,
    ButtonText,
    
} from './styles'
import { TouchableOpacity } from 'react-native'
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/core';
import { HomeAccountStack } from '../../../../../@types/RootStackParamApp';

type PropsManageAccount = {
    navigation: StackNavigationProp<HomeAccountStack, "CreateAccount">,    
    route: RouteProp<HomeAccountStack, "CreateAccount">,
}

const CreateAccount = ({navigation, route}: PropsManageAccount) => {
    const {handleAdicionarConta} = UseContas()
    const [description, setDescription] = useState('')
    const [value, setValue] = useState('')    
    const [categoriaConta, setCategoriaConta] = useState('')

    const modalizeRef = useRef<Modalize>(null);

    const onOpen = () => {
        modalizeRef.current?.open();
    };

    
    async function handleCreateAccount() {
        const newConta = {
            descricao: description,
            categoryConta: categoriaConta,
            saldoConta: parseFloat(value),
            userConta: await retornarIdDoUsuario()
        } as Conta

        console.log(newConta)

        handleAdicionarConta(newConta)
        
        navigation.goBack()
    }

    return (
        <Container>
            
            <InputText 
                onChangeText={setDescription}
                value={description}
                label="Descrição"
                placeholder="Descrição de sua nova conta"
            />

            <InputText 
                onChangeText={setValue}
                value={value}
                label="Saldo"
                placeholder="Saldo de sua nova conta"
                keyboardType='decimal-pad'
            />


            <SelectionCategoriesAccount navigation={navigation} setCategoriaConta={setCategoriaConta}/>

            <Button 
                onPress={handleCreateAccount}
                title="Criar"
            />              

            <Modalize ref={modalizeRef}
                modalStyle={{elevation: 50}}
            ><Text>...your content</Text></Modalize>  
        </Container>
    )
}

export default CreateAccount