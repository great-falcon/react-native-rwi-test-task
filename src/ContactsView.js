import React, {useRef, useState} from 'react';
import {Alert, SafeAreaView, StyleSheet, Text, View} from 'react-native';

import {ContactsSectionList} from 'react-native-contacts-sectionlist';
import Menu, {MenuItem} from 'react-native-material-menu';
import DialogView from './DialogView';

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
        <Text style={styles.title}>ContactsView</Text>
        <Menu ref={menu} button={<Text onPress={showMenu}>Show menu</Text>}>
          <MenuItem onPress={() => handleImportContactsPress()}>
            import ContactsView
          </MenuItem>
        </Menu>
      </View>
      <ContactsSectionList />
      <DialogView
        open={dialogVisible}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        title="Import ContactsView"
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
