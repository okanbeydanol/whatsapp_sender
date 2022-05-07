import {DatabaseContactResponse} from '../../utils/native-contact';

export type USER = {
  id: number | null;
  city_id: number | null;
  country_id: number | null;
  country_info: COUNTRY | null;
  updated_at: string | null;
  created_at: string | null;
  deleted_at: string | null;
  fingerprint: string | null;
  freeze_account: number;
  fullname: string | null;
  last_latitude: string | null;
  last_longitude: string | null;
  packet_begin_time: string | null;
  packet_end_time: string | null;
  phone_number: string | null;
  uniqueId: string | null;
  user_guid: string | null;
  user_packet_info: USER_PACKET_INFO | null;
  usage_info: USER_USAGE[] | null;
  message_templates?: USER_MESSAGE_TEPMLATES[];
  lists?: USER_LISTS[];
};

export type COUNTRY = {
  capital: string;
  currency: string;
  created_at: string;
  currency_symbol: string;
  emoji: string;
  emojiU: string;
  id: number;
  iso2: string;
  iso3: string;
  latitude: number;
  longitude: number;
  name: number;
  phonecode: number;
  timezones: TIME_ZONE[];
};
export type TIME_ZONE = {
  abbreviation: string;
  gmtOffset: number;
  gmtOffsetName: number;
  tzName: number;
  zoneName: number;
};
export type USER_USAGE = {};
export type USER_PACKET_INFO = {
  id: number;
  begin_time: string | null;
  end_time: string | null;
  country_id: number | null;
  updated_at: string;
  created_at: string;
  deleted_at: string;
  is_default: string | null;
  packet_guid: string | null;
  packet_type: string | null;
  price: string | null;
  user_guid: string | null;
  user_packet_guid: string | null;
  status: string | null;
  packet_attr_info: PACKET_ATTR_INFO[];
};

export type PACKET_ATTR_INFO = {};

export type USER_MESSAGE_TEPMLATES = {
  id: number;
  message_template_guid: string;
  title: string;
  type: string;
  text: string;
  user_guid: string;
  checked: boolean;
  images: USER_MESSAGE_TEPMLATE_IMAGES;
  updated_at: string;
  created_at: string;
  deleted_at: string;
};

export type USER_MESSAGE_TEPMLATE_IMAGES = {
  id: number;
  message_template_image_guid: string;
  message_template_guid: string;
  image_name: string;
  updated_at: string;
  created_at: string;
  deleted_at: string;
};

export type DatabaseMessageTemplates = {
  text: USER_MESSAGE_TEPMLATES[];
  media: USER_MESSAGE_TEPMLATES[];
};

export type USER_LISTS = {
  id: number;
  user_list_guid: string;
  message_template_guid: string;
  title: string;
  user_guid: string;
  updated_at: string;
  created_at: string;
  deleted_at: string;
  contacts: USER_LIST_CONTACTS[];
  template: USER_MESSAGE_TEPMLATES;
};

export type USER_LIST_CONTACTS = {
  id: number;
  user_list_contact_guid: string;
  user_list_guid: string;
  user_guid: string;
  contact_id: number;
  updated_at: string;
  created_at: string;
  deleted_at: string;
  contact_info: DatabaseContactResponse;
};
