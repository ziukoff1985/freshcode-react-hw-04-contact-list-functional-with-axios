import PropTypes from 'prop-types';
import ContactItem from '../ContactItem/ContactItem';

import styles from './ContactList.module.css';

function ContactList({
    contactForEdit,
    contacts,
    onAddNewContact,
    onDeleteContact,
    onEditContact,
}) {
    return (
        <div className={styles.contactListWrapper}>
            <ul className={styles.contactList}>
                {contacts.length === 0
                    ? 'No contacts yet'
                    : contacts.map((contact) => (
                          <ContactItem
                              key={contact.id}
                              contact={contact}
                              onDeleteContact={onDeleteContact}
                              onEditContact={onEditContact}
                              contactForEdit={contactForEdit}
                          />
                      ))}
            </ul>
            <button
                className={styles.addButton}
                type='button'
                onClick={onAddNewContact}
            >
                New
            </button>
        </div>
    );
}

ContactList.propTypes = {
    contacts: PropTypes.array,
};

ContactList.defaultProps = {
    contacts: [],
};

export default ContactList;
