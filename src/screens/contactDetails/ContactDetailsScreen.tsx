import React, {useMemo} from 'react';
import {
  View,
  Text,
  Image,
  TextStyle,
  ViewStyle,
  ImageStyle,
} from 'react-native';
import {ContactRepository} from '@data';
import {AppBar, BackButton} from '@components/appBar';
import {InfoData, InfoView} from '@components/contact/info';
import {AppTheme, useThemedStyles} from '@theme';

type Props = {
  contactId: string;
  goBack: () => void;
};

export const buildContactDetailsScreen = (
  contactRepository: ContactRepository,
) => {
  return function ContactDetailscreen({contactId, goBack}: Props) {
    const contact = useMemo(
      () => contactRepository.getContact(contactId),
      [contactId],
    );
    const infoData: InfoData = useMemo(
      () => ({
        id: contact.id,
        firstName: contact.firstName,
        lastName: contact.lastName,
        role: contact.role,
        description: contact.description,
      }),
      [contact],
    );
    const source = useMemo(
      () => ({
        uri: contact.avatarUri,
      }),
      [contact.avatarUri],
    );

    const styles = useThemedStyles(styleFn);

    return (
      <View style={styles.container}>
        <AppBar
          style={styles.appBar}
          content={
            <>
              <BackButton style={styles.appBarBack} onPress={goBack} />
              <Text style={styles.appBarText}>
                {`${contact.firstName} ${contact.lastName}`}
              </Text>
            </>
          }
        />
        <Image style={styles.avatar} source={source} />
        <InfoView info={infoData} />
      </View>
    );
  };
};

const styleFn = (theme: AppTheme) => ({
  container: {flex: 1, backgroundColor: theme.colors.background} as ViewStyle,
  appBar: {marginBottom: 24} as ViewStyle,
  appBarText: {
    ...theme.typography.appBar,
    color: theme.colors.onBackground,
  } as TextStyle,
  appBarBack: {marginRight: 12} as ImageStyle,
  avatar: {
    alignSelf: 'center',
    width: 128,
    height: 128,
    marginBottom: 24,
  } as ImageStyle,
});
