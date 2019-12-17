import {useEffect, useState} from 'react';
import {Alert, PermissionsAndroid, Platform} from 'react-native';
import Contacts from 'react-native-contacts';

const useContacts = () => {
  const [contacts, setContacts] = useState({
    loading: true,
    error: null,
    data: [],
  });
  useEffect(() => {
    const requestContactPermissionAndroid = async () => {
      try {
        const granted = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
        ]);
        if (
          granted[PermissionsAndroid.PERMISSIONS.READ_CONTACTS] !==
          PermissionsAndroid.RESULTS.GRANTED
        ) {
          Alert.alert('Permissions Denied. Please Grant Permissions.');
          await requestContactPermissionAndroid();
        }
      } catch (err) {
        console.error('Robot: ', err);
      }
    };
    const fetchContacts = async () => {
      try {
        if (Platform.OS === 'android') {
          await requestContactPermissionAndroid();
          processData();
        } else {
          processData();
        }
      } catch (ex) {
        setContacts({
          loading: false,
          error: ex,
          data: [],
        });
      }
    };

    fetchContacts();
  }, []);

  const processData = () => {
    Contacts.getAll((err, fetchedContactsList) => {
      if (err === 'denied') {
      } else {
        setContacts(state => ({
          loading: false,
          error: null,
          data: state.data.concat(fetchedContactsList),
        }));
      }
    });
  };

  return contacts;
};

export default useContacts;
