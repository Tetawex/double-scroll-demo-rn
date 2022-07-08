import React from 'react';
import {useMemo} from 'react';
import {ContactRepository} from '@data';
import {buildContactListScreen} from '@screens/contactList/';
import {Route, Routes} from '@navigation';
import {buildContactDetailsScreen} from '@screens/contactDetails';
import {AppRouteNames, AppRouteParams} from './AppRoutes';

type Deps = {
  contactRepository: ContactRepository;
};

export const useAppRoutes = ({
  contactRepository,
}: Deps): Routes<AppRouteParams> => {
  return useMemo((): Routes<AppRouteParams> => {
    const ContactListScreen = buildContactListScreen(contactRepository);
    const ContactDetailsScreen = buildContactDetailsScreen(contactRepository);

    const contactListRoute: Route<AppRouteParams, AppRouteNames.CONTACT_LIST> =
      {
        render: (params, navigate) => (
          <ContactListScreen
            navigateToContactDetails={(contactId: string) =>
              navigate(AppRouteNames.CONTACT_DETAILS, {contactId})
            }
          />
        ),
      };

    const contactDetailsRoute: Route<
      AppRouteParams,
      AppRouteNames.CONTACT_DETAILS
    > = {
      key: ({contactId}) => contactId,
      render: (params, _, goBack) => (
        <ContactDetailsScreen contactId={params.contactId} goBack={goBack} />
      ),
    };

    return {
      //@ts-expect-error
      [AppRouteNames.CONTACT_LIST]: contactListRoute,
      //@ts-expect-error
      [AppRouteNames.CONTACT_DETAILS]: contactDetailsRoute,
    };
  }, [contactRepository]);
};
