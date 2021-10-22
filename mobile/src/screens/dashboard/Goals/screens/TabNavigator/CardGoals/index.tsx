import React from 'react';

import { Meta } from '../../../../../../contexts/GoalsContext';

import { ProgressBar } from 'react-native-paper';

import {
  Goal,
  GoalDesc,
  DaysLeft,
  InvestedMoney,
  Percent,
  PercentText,
  GoalTouchable,
} from '../styles';
import { toDate } from '../../../../../../helpers/manipularDatas';
import { NavigationContainer } from '@react-navigation/native';
import { UseDadosTemp } from '../../../../../../contexts/TemporaryDataContext';
import { StackNavigationProp } from '@react-navigation/stack';
import { GoalsStack } from '../../../../../../@types/RootStackParamApp';

type PropsCardGoals = {
  item: Meta;
};

const CardGoals = ({ item }: PropsCardGoals) => {
  const { navigation } = UseDadosTemp();

  const objDataFimMeta = toDate(item.dataFimMeta);
  const objDataIniMeta = toDate(item.dataInicioMeta);

  const diff = Math.abs(objDataFimMeta.getTime() - objDataIniMeta.getTime()); // Subtrai uma data pela outra
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24)); // Divide o total pelo total de milisegundos correspondentes a 1 dia. (1000 milisegundos = 1 segundo).

  const percentageBalance = (item.saldoAtualMeta * 100) / item.saldoFinalMeta; // Algum cálculo para calcular a porcentagem aqui

  return (
    <Goal key={item.id}>
      <GoalTouchable
        onPress={() => {
          navigation.navigate('GoalsStack', {
            screen: 'GoalDetails',
            params: { goalId: item.id },
          });
        }}>
        <GoalDesc>{item.descMeta}</GoalDesc>
      </GoalTouchable>

      <DaysLeft>! Faltam {days} dias</DaysLeft>

      <ProgressBar
        progress={percentageBalance / 100}
        color="#F81650"
        style={{
          height: 10,
          marginVertical: 8,
          borderRadius: 10,
        }}
      />

      <InvestedMoney>
        {`R$ ${item.saldoAtualMeta} de R$ ${item.saldoFinalMeta}`}
      </InvestedMoney>

      <Percent>
        <PercentText>{percentageBalance}%</PercentText>
      </Percent>
    </Goal>
  );
};

export default CardGoals;