import * as React from 'react';
import {Text, TouchableHighlight, View} from 'react-native';

const ContactRow = React.memo(
  ({onOpen, onSelect, name, number, selected, isSelect, onLongPress}) => {
    return (
      <TouchableHighlight
        onPress={isSelect ? onSelect : onOpen}
        onLongPress={onLongPress}>
        <View style={{padding: 16, flexDirection: 'row', alignItems: 'center'}}>
          {isSelect && (
            <Text style={{marginRight: 16}}>{selected ? '✅' : '⭕️️'}</Text>
          )}
          <View style={{flex: 1}}>
            <Text>{name || number}</Text>
            {number && (
              <Text style={{marginTop: 4, color: '#666'}}>{number}</Text>
            )}
          </View>
        </View>
      </TouchableHighlight>
    );
  },
);

export default ContactRow;
