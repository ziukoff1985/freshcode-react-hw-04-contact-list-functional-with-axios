import { useEffect, useState } from 'react';
import { nanoid } from 'nanoid';
import api from './api/contacts-service';

import ContactList from './components/ContactList/ContactList';
import ContactForm from './components/ContactForm/ContactForm';
import styles from './App.module.css';

function App() {
    const [contacts, setContacts] = useState([]);
    const [contactForEdit, setContactForEdit] = useState(createEmptyContact);

    useEffect(() => {
        api.get('/').then(({ data }) => {
            if (!data) {
                setContacts([]);
            } else {
                setContacts(data);
            }
        });
    }, []);

    // useEffect(getDataFromLocalStorage, []);

    // function getDataFromLocalStorage() {
    //     const savedData = JSON.parse(localStorage.getItem('contacts'));
    //     if (!savedData) {
    //         setContacts([]);
    //     } else {
    //         setContacts([...savedData]);
    //     }
    // }

    function createEmptyContact() {
        return {
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
        };
    }

    function deleteContact(contactId) {
        const newContacts = contacts.filter(
            (contact) => contact.id !== contactId
        );
        const isContactNowUpdating = contactForEdit.id === contactId;
        setContacts(newContacts);
        saveToLocalStorage(newContacts);
        setContactForEdit(
            isContactNowUpdating ? createEmptyContact() : contactForEdit
        );
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

    function createContact(contact) {
        contact.id = nanoid();
        const newContacts = [...contacts, contact];
        setContacts(newContacts);
        saveToLocalStorage(newContacts);
        setContactForEdit(createEmptyContact);
    }

    function updateContact(contact) {
        const newContacts = contacts.map((item) =>
            item.id === contact.id ? contact : item
        );
        setContacts(newContacts);
        saveToLocalStorage(newContacts);
        setContactForEdit({ ...contact });
    }

    const saveToLocalStorage = (contacts) => {
        localStorage.setItem('contacts', JSON.stringify(contacts));
    };

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
