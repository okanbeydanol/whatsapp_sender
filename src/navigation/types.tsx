import {DrawerScreenProps} from '@react-navigation/drawer';
import type {
  CompositeScreenProps,
  NavigatorScreenParams,
} from '@react-navigation/native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {USER_LISTS, USER_MESSAGE_TEPMLATES} from '../constants/typescript/user';
import {DatabaseContactResponse} from '../utils/native-contact';

//Templates
interface EditTemplatesScreenProps {
  template: USER_MESSAGE_TEPMLATES;
}
export type TemplateTabParamList = {
  TemplatesScreen: undefined;
  CreateTemplate: undefined;
  EditTemplate: EditTemplatesScreenProps;
};

export type TemplateScreenProps<T extends keyof TemplateTabParamList> =
  CompositeScreenProps<
    NativeStackScreenProps<TemplateTabParamList, T>,
    RootStackScreenProps<keyof RootStackParamList>
  >;

//Lists
interface CreateListScreenProps {
  selectedContacts: DatabaseContactResponse[];
}
interface ContactScreenProps {
  selectedContacts: DatabaseContactResponse[];
  type?: string;
  list: USER_LISTS;
}
interface EditListScreenProps {
  selectedContacts: DatabaseContactResponse[];
  type?: string;
  list: USER_LISTS;
}
interface ChooseContactScreenProps {
  selectedContacts: DatabaseContactResponse[];
  type?: string;
}
interface StartWhatsappSenderScreenProps {
  list: USER_LISTS;
}
export type ContactTabParamList = {
  ContactScreen: ContactScreenProps;
  CreateList: CreateListScreenProps;
  EditList: EditListScreenProps;
  ChooseContact: ChooseContactScreenProps;
  CreateTemplate: undefined;
  EditTemplate: USER_MESSAGE_TEPMLATES;
  StartWhatsappSender: StartWhatsappSenderScreenProps;
};

export type ContactTabScreenProps<T extends keyof ContactTabParamList> =
  CompositeScreenProps<
    DrawerScreenProps<ContactTabParamList, T>,
    RootStackScreenProps<keyof RootStackParamList>
  >;

//Route
export type RootStackParamList = {
  ContactScreen: NavigatorScreenParams<ContactTabParamList>;
};

export type RootStackScreenProps<T extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, T>;

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
