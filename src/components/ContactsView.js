import React, {useRef, useState} from 'react';
import {Alert, SafeAreaView, StyleSheet, Text, View} from 'react-native';

import Menu, {MenuItem} from 'react-native-material-menu';
import DialogView from './DialogView';
import Contacts from 'react-native-contacts';
import ContactsList from './ContactsList/ContactsList';

const ContactsView = () => {
  const [dialogVisible, setDialogVisible] = useState(false);

  const showDialog = () => {
    setDialogVisible(true);
  };
  const handleCancel = () => {
    setDialogVisible(false);
  };
  const handleSubmit = () => {
    setDialogVisible(false);
    setTimeout(
      () =>
        Contacts.getAll((err, contacts) => {
          if (err === 'denied') {
            // error
          } else {
            const formattedContacts = contacts.map(
              ({
                recordID,
                company,
                emailAddresses,
                familyName,
                givenName,
                middleName,
                phoneNumbers,
              }) => ({
                recordID,
                company,
                emailAddresses,
                familyName,
                givenName,
                middleName,
                phoneNumbers,
              }),
            );
            Alert.alert('Data', JSON.stringify(formattedContacts, null, 2));
          }
        }),
      500,
    );
  };
  const handleImportContactsPress = () => {
    hideMenu();
    setTimeout(() => showDialog(), 300);
  };

  const menu = useRef();
  const hideMenu = () => menu.current.hide();
  const showMenu = () => menu.current.show();
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.menuContainer}>
        <Text style={styles.title}>Contacts</Text>
        <Menu ref={menu} button={<Text onPress={showMenu}>Show menu</Text>}>
          <MenuItem onPress={() => handleImportContactsPress()}>
            import Contacts
          </MenuItem>
        </Menu>
      </View>
      {/*<ContactsSectionList />*/}
      <ContactsList />
      <DialogView
        open={dialogVisible}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        title="Import Contacts"
        description="Are you really want to import contacts"
        cancelLabel="Cancel"
        submitLabel="Import"
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  menuContainer: {
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default ContactsView;
