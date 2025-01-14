import React, { useState, useEffect } from 'react';
import { BackHandler, ScrollView, Text, View } from 'react-native';

import { HomeAccountStack } from '../../../../../../@types/RootStackParamApp';
import { StackNavigationProp } from '@react-navigation/stack';
import { useTheme } from 'styled-components/native'; 
import {
  Categoria,
  UseCategories,
} from '../../../../../../contexts/CategoriesContext';

import { colors, fonts, metrics } from '../../../../../../styles';
import {
  Title,
  Subtitle,
  Loading,
  TextLoading,
  ScreenDescription,
  Content,
  FAB,
} from './styles';

import retornarIdDoUsuario from '../../../../../../helpers/retornarIdDoUsuario';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Entypo from 'react-native-vector-icons/Entypo';

import Button from '../../../../../../components/Button';
import CategoryItem from '../../../../../../components/CategoryItem';

import { StackActions } from '@react-navigation/native';
import shadowBox from '../../../../../../helpers/shadowBox';
import { widthPixel } from '../../../../../../helpers/responsiveness';

type PropsCategory = {
  navigation: StackNavigationProp<HomeAccountStack, 'ManageCategory'>;
};

const Despesas = ({ navigation }: PropsCategory) => {
  const { categorias, handleReadByUserCategorias } = UseCategories();

  const [despesasCategorias, setDespesasCategorias] = useState<
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
    (async function () {
      handleReadByUserCategorias(await retornarIdDoUsuario(), 'todos');
    })();
  }, []);

  useEffect(() => {
    const aux: Categoria[] = [];

    categorias?.map(item => {
      if (item.tipoCategoria == 'despesa') aux.push(item);
    });

    setDespesasCategorias(aux);
  }, [categorias]);
  const theme: any = useTheme()

  if (despesasCategorias != null && despesasCategorias?.length > 0) {
    
    return (
      <View>
        <ScrollView style={{ backgroundColor: theme.colors.cultured }}>
          <ScreenDescription>
            <Content>
              Adicione teto de gastos às categorias para se manter
              organizado(a)! 🤟
            </Content>
          </ScreenDescription>
          <View style={{ padding: metrics.default.boundaries }}>
            {despesasCategorias &&
              despesasCategorias.map((item, index) => {
                return <CategoryItem key={index} category={item} />;
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
          style={[shadowBox(), { backgroundColor: theme.colors.redCrayola }]}>
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

export default Despesas;
