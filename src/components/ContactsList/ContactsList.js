import * as React from 'react';
import {useState} from 'react';
import {
  Button,
  Platform,
  SectionList,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {groupBy} from 'lodash';
import useContacts from '../../hooks/useContacts';
import ContactRow from './ContactRow';
import Contacts from 'react-native-contacts';
import LaunchNavigator from 'react-native-launch-navigator';

if (Platform.OS === 'android')
  LaunchNavigator.setGoogleApiKey('AIzaSyD30X4f4l_We2pZMjVAhCYgNvMqOTEyrR8');

const ContactsList = () => {
  const contacts = useContacts();
  const [isSelectMade, setIsSelectMade] = useState(false);
  const [selectedContacts, setSelectedContacts] = React.useState([]);
  const sections = React.useMemo(() => {
    return Object.entries(
      groupBy(
        contacts.data.map(cur => ({
          id: cur.recordID,
          name: `${cur.givenName || ''} ${cur.familyName || ''}`,
          phoneNumber: cur.phoneNumbers[0] && cur.phoneNumbers[0].number,
          addresses: cur.postalAddresses,
        })),
        c => {
          const firstChar = (c.name.charAt(0) || '#').toLowerCase();
          return firstChar.match(/[a-z]/) ? firstChar : '#';
        },
      ),
    )
      .map(([key, value]) => ({
        key,
        data: value.sort((a, b) =>
          (a.name || a.name || '') < (b.name || b.name || '') ? -1 : 1,
        ),
      }))
      .sort((a, b) => (a.key < b.key ? -1 : 1));
  }, [contacts.data]);

  const onNavigatePress = async () => {
    let app = null;
    const addresses = selectedContacts.map(
      val =>
        `${val.addresses[0].street}, ${val.addresses[0].city}, ${
          val.addresses[0].country
        }`,
    );
    LaunchNavigator.isAppAvailable(LaunchNavigator.APP.GOOGLE_MAPS)
      .then(isGoogleMapsAvailable => {
        if (isGoogleMapsAvailable) {
          app = LaunchNavigator.APP.GOOGLE_MAPS;
        } else {
          console.warn(
            'Google Maps not available - falling back to default navigation app',
          );
        }

        LaunchNavigator.navigate(addresses[1], {
          start: addresses[0],
          app: app,
        })
          .then(() => console.log('Launched navigator'))
          .catch(err => console.error('Error launching navigator: ' + err));
      })
      .then(() => console.log('Launched navigator'))
      .catch(err => console.error('Error launching navigator: ' + err));
  };

  const openContactById = id => {
    const contact = {
      recordID: id,
    };
    Contacts.openExistingContact(contact, (err, currContact) => {
      if (err) {
        console.error(
          'Robot: Error with contact: ',
          currContact,
          'Error Message: ',
          err,
        );
      }
    });
  };
  const handleDiscardClick = () => {
    setIsSelectMade(false);
    setSelectedContacts([]);
  };

  if (contacts.loading) {
    return <Text>Loading...</Text>;
  } else if (contacts.error != null) {
    return <Text>Oh no error :( {contacts.error.message}</Text>;
  } else {
    return (
      <>
        {isSelectMade && (
          <View style={styles.buttonsContainer}>
            <Button title="Discard" onPress={handleDiscardClick} />
            <Button
              title="Navigate"
              onPress={onNavigatePress}
              disabled={selectedContacts.length !== 2}
            />
          </View>
        )}
        <SectionList
          sections={sections}
          renderSectionHeader={({section}) => (
            <Text
              style={{
                backgroundColor: '#eee',
                paddingHorizontal: 16,
                paddingVertical: 4,
              }}>
              {section.key.toUpperCase()}
            </Text>
          )}
          renderItem={({item}) => {
            const selectedIndex = selectedContacts.findIndex(
              i => i.id === item.id,
            );
            const handleItemSelect = () => {
              const newContacts = [...selectedContacts];
              if (selectedIndex >= 0) {
                newContacts.splice(selectedIndex, 1);
              } else {
                newContacts.push(item);
              }
              setSelectedContacts(newContacts);
            };
            const handleOpen = () => {
              openContactById(item.id);
            };
            const onLongPress = () => {
              setIsSelectMade(true);
              if (item.addresses.length && selectedContacts.length < 2) {
                handleItemSelect();
              }
            };
            return (
              <ContactRow
                onLongPress={onLongPress}
                isSelect={
                  (isSelectMade &&
                    item.addresses.length &&
                    selectedContacts.length < 2) ||
                  selectedIndex >= 0
                }
                name={item.name}
                number={item.phoneNumber}
                selected={selectedIndex >= 0}
                onOpen={handleOpen}
                onSelect={handleItemSelect}
              />
            );
          }}
          extraData={selectedContacts}
        />
      </>
    );
  }
};

const styles = StyleSheet.create({
  buttonsContainer: {
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
    padding: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});

export default ContactsList;
