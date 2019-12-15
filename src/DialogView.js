import React from 'react';
import Dialog from 'react-native-dialog';

const DialogView = props => {
  return (
    <Dialog.Container visible={props.open}>
      <Dialog.Title>{props.title}</Dialog.Title>
      <Dialog.Description>{props.description}</Dialog.Description>
      <Dialog.Button label={props.cancelLabel} onPress={props.onCancel} />
      <Dialog.Button label={props.submitLabel} onPress={props.onSubmit} />
    </Dialog.Container>
  );
};

export default DialogView;
