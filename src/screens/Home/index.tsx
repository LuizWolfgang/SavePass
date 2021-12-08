import React, { useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

import { Header } from '../../components/Header';
import { SearchBar } from '../../components/SearchBar';
import { LoginDataItem } from '../../components/LoginDataItem';

import {
  Container,
  Metadata,
  Title,
  TotalPassCount,
  LoginList,
} from './styles';

interface LoginDataProps {
  id: string;
  service_name: string;
  email: string;
  password: string;
}

type LoginListDataProps = LoginDataProps[];

export function Home() {
  const [searchText, setSearchText] = useState('');
  const [searchListData, setSearchListData] = useState<LoginListDataProps>([]);
  const [data, setData] = useState<LoginListDataProps>([]);

  async function loadData() {
     // Get asyncStorage data, use setSearchListData and setData
     //JSON.parse antes de adicionar as informações no estado, já que elas virão no formato de string do AsyncStorage. 

    const dataKey = '@savepass:logins';
    const response = await AsyncStorage.getItem(dataKey);
    const responseFormatted =  JSON.parse(response)

    if(responseFormatted){
      setData(responseFormatted);
      setSearchListData(responseFormatted);
    }
  }

  function handleFilterLoginData() {
    // Filter results inside data, save with setSearchListData
      const searchFiltterd = searchListData.filter( data =>{
        const isValid = data.service_name.toLowerCase().includes(searchText.toLowerCase())

        if(isValid){ //includes = inclui o termo que o usuario pesquisou
          return data
        }
      })
      setSearchListData(searchFiltterd)
  }

  function handleChangeInputText(text: string) {

  if(!text){
    setSearchListData(data)
  }
    setSearchText(text);
  }

  useFocusEffect(useCallback(() => {
    loadData();
  }, []));

  return (
    <>
      <Header
        user={{
          name: 'Luiz Andre',
          avatar_url: 'https://avatars.githubusercontent.com/u/74063154?v=4'
        }}
      />
      <Container>
        <SearchBar
          placeholder="Qual senha você procura?"
          onChangeText={handleChangeInputText}
          value={searchText}
          returnKeyType="search"
          onSubmitEditing={handleFilterLoginData}
          onSearchButtonPress={handleFilterLoginData}
        />

        <Metadata>
          <Title>Suas senhas</Title>
          <TotalPassCount>
            {searchListData.length
              ? `${`${searchListData.length}`.padStart(2, '0')} ao total`
              : 'Nada a ser exibido'
            }
          </TotalPassCount>
        </Metadata>

        <LoginList
          keyExtractor={(item) => item.id}
          data={searchListData}
          renderItem={({ item: loginData }) => {
            return <LoginDataItem
              service_name={loginData.service_name}
              email={loginData.email}
              password={loginData.password}
            />
          }}
        />
      </Container>
    </>
  )
}