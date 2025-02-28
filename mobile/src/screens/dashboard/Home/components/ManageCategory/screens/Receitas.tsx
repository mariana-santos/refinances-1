import React, { useState, useEffect } from 'react';
import { BackHandler, ScrollView, Text, View } from 'react-native';

import { HomeAccountStack } from '../../../../../../@types/RootStackParamApp';
import { StackNavigationProp } from '@react-navigation/stack';

import {
  Categoria,
  UseCategories,
} from '../../../../../../contexts/CategoriesContext';
import { useTheme } from 'styled-components/native'; 
import { ActivityIndicator } from 'react-native-paper';

import retornarIdDoUsuario from '../../../../../../helpers/retornarIdDoUsuario';

import {
  Title,
  Subtitle,
  Loading,
  TextLoading,
  ScreenDescription,
  Content,
  FAB,
} from './styles';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import Button from '../../../../../../components/Button';
import { colors, fonts, metrics } from '../../../../../../styles';
import CardCategory from '../../CategoriesCard/index';
import { StackActions } from '@react-navigation/native';
import CategoryItem from '../../../../../../components/CategoryItem';
import shadowBox from '../../../../../../helpers/shadowBox';
import { widthPixel } from '../../../../../../helpers/responsiveness';
import Entypo from 'react-native-vector-icons/Entypo';

type PropsCategory = {
  navigation: StackNavigationProp<HomeAccountStack, 'ManageCategory'>;
};

const Receitas = ({ navigation }: PropsCategory) => {
  const { categorias, handleReadByUserCategorias } = UseCategories();

  const [receitasCategorias, setReceitasCategorias] = useState<
    Categoria[] | null
  >(null);

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', backAction);
    return () =>
      BackHandler.removeEventListener('hardwareBackPress', backAction);
  }, []);

  const backAction = () => {
    navigation.dispatch(StackActions.replace('Main', { screen: 'Home' }));
    return true;
  };

  useEffect(() => {
    //se nao tiver categorias, recarrega
    if (!categorias)
      (async function () {
        handleReadByUserCategorias(await retornarIdDoUsuario(), 'receita');
      })();

    const aux: Categoria[] = [];

    categorias?.map(item => {
      if (item.tipoCategoria == 'receita') aux.push(item);
    });

    console.debug('useEffect[categorias] | aux', aux);
    setReceitasCategorias(aux);
  }, [categorias]);
  const theme: any = useTheme()

  if (receitasCategorias != undefined && receitasCategorias?.length > 0) {
    return (
      <View>
        <ScrollView style={{ backgroundColor: theme.colors.cultured }}>
          <ScreenDescription>
            <Content>
              Aqui estão suas categorias de receita, elas não recebem teto de
              gasto!
            </Content>
          </ScreenDescription>
          <View style={{ padding: metrics.default.boundaries }}>
            {receitasCategorias &&
              receitasCategorias.map((item, index) => {
                console.log('Item: ', receitasCategorias);
                if (item.tipoCategoria == 'receita') {
                  return <CategoryItem key={index} category={item} />;
                }
              })}
          </View>
        </ScrollView>
        <FAB
          onPress={() => {
            navigation.dispatch(
              StackActions.replace('StackAccount', { screen: 'NewCategory' }),
            );
          }}
          activeOpacity={0.8}
          style={[shadowBox(), { backgroundColor: theme.colors.slimyGreen }]}>
          <Entypo name="plus" size={widthPixel(60)} color={theme.colors.white} />
        </FAB>
      </View>
    );
  } else {
    return (
      <ScrollView style={{ backgroundColor: theme.colors.cultured }}>
        <View style={{ margin: '10%', alignItems: 'center' }}>
          <Icon
            name="emoticon-sad-outline"
            size={50}
            color={theme.colors.davysGrey}
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 30,
            }}
          />

          <Title>Você não tem categorias cadastradas!</Title>

          <Subtitle>
            Categorias com teto de gastos são muito importantes para impor
            limites em si mesmo, não deixe de criar e gerenciá-las.
          </Subtitle>

          <Button
            title="Criar nova categoria"
            backgroundColor={theme.colors.paradisePink}
            onPress={() => {
              navigation.dispatch(StackActions.replace('CreateCategory'));
            }}></Button>
        </View>
      </ScrollView>
    );
  }
};

export default Receitas;
