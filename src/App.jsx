import { useEffect, useState } from 'react';

import api from './api/contacts-service';
import ContactList from './components/ContactList/ContactList';
import ContactForm from './components/ContactForm/ContactForm';
import styles from './App.module.css';

function App() {
    const [contacts, setContacts] = useState([]);
    const [contactForEdit, setContactForEdit] = useState(createEmptyContact);

    useEffect(() => {
        api.get('/')
            .then(({ data }) => {
                if (!data) {
                    setContacts([]);
                } else {
                    setContacts(data);
                }
            })
            .catch((err) => console.log(err.message));
    }, []);

    function createEmptyContact() {
        return {
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
        };
    }

    function createContact(contact) {
        api.post('/', contact)
            .then(({ data }) => {
                const newContacts = [...contacts, data];
                setContacts(newContacts);
                setContactForEdit(createEmptyContact);
            })
            .catch((err) => console.log(err.message));
    }

    function updateContact(contact) {
        api.put(`/${contact.id}`, contact)
            .then(({ data }) => {
                const newContacts = contacts.map((item) =>
                    item.id === contact.id ? data : item
                );
                setContacts(newContacts);
                setContactForEdit({ ...contact });
            })
            .catch((err) => console.log(err.message));
    }

    function deleteContact(contactId) {
        api.delete(`/${contactId}`)
            .then(() => {
                const newContacts = contacts.filter(
                    (contact) => contact.id !== contactId
                );
                const isContactNowUpdating = contactForEdit.id === contactId;
                setContacts(newContacts);
                setContactForEdit(
                    isContactNowUpdating ? createEmptyContact() : contactForEdit
                );
            })
            .catch((err) => console.log(err.message));
    }

    function saveContact(contact) {
        if (!contact.id) {
            createContact(contact);
        } else {
            updateContact(contact);
        }
    }

    function addNewContact() {
        setContactForEdit(createEmptyContact);
    }

    function editContact(contact) {
        setContactForEdit({ ...contact });
    }

    return (
        <>
            <h1>Contact List</h1>
            <div className={styles.container}>
                <ContactList
                    contacts={contacts}
                    onDeleteContact={deleteContact}
                    onAddNewContact={addNewContact}
                    onEditContact={editContact}
                    contactForEdit={contactForEdit}
                />
                <ContactForm
                    contactForEdit={contactForEdit}
                    onSubmit={saveContact}
                    onDeleteContact={deleteContact}
                />
            </div>
        </>
    );
}

export default App;
