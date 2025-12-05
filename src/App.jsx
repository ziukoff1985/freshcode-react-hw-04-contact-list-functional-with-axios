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

    // ---------- createContact -----------
    function createContact(contact) {
        api.post('/', contact)
            .then(({ data }) => {
                console.log(data);
                const newContacts = [...contacts, data];
                setContacts(newContacts);
                setContactForEdit(createEmptyContact);
            })
            .catch((err) => console.log(err.message));
    }

    // async function createContact(contact) {
    //     try {
    //         const { data } = await api.post('/', contact);
    //         console.log(data);
    //         const newContacts = [...contacts, data];
    //         setContacts(newContacts);
    //         setContactForEdit(createEmptyContact);
    //     } catch (error) {
    //         console.log(error.message);
    //     }
    // }

    // function createContact(contact) {
    //     contact.id = nanoid();
    //     const newContacts = [...contacts, contact];
    //     setContacts(newContacts);
    //     saveToLocalStorage(newContacts);
    //     setContactForEdit(createEmptyContact);
    // }

    // ----------- updateContact -----------
    // function updateContact(contact) {
    //     api.put(`/${contact.id}`, contact)
    //         .then(({ data }) => {
    //             console.log(data);
    //             const newContacts = contacts.map((item) =>
    //                 item.id === contact.id ? data : item
    //             );
    //             setContacts(newContacts);
    //             setContactForEdit({ ...contact });
    //         })
    //         .catch((err) => console.log(err.message));
    // }

    async function updateContact(contact) {
        try {
            const { data } = await api.put(`/${contact.id}`, contact);
            console.log(data);
            const newContacts = contacts.map((item) =>
                item.id === contact.id ? data : item
            );
            setContacts(newContacts);
            setContactForEdit({ ...contact });
        } catch (error) {
            console.log(error.message);
        }
    }

    // function updateContact(contact) {
    //     const newContacts = contacts.map((item) =>
    //         item.id === contact.id ? contact : item
    //     );
    //     setContacts(newContacts);
    //     saveToLocalStorage(newContacts);
    //     setContactForEdit({ ...contact });
    // }

    // ------------ deleteContact ------------
    function deleteContact(contactId) {
        api.delete(`/${contactId}`)
            .then(({ data }) => {
                console.log(data);
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

    // async function deleteContact(contactId) {
    //     try {
    //         await api.delete(`/${contactId}`);
    //         const newContacts = contacts.filter(
    //             (contact) => contact.id !== contactId
    //         );
    //         setContacts(newContacts);
    //         const isContactNowUpdating = contactForEdit.id === contactId;
    //         setContactForEdit(
    //             isContactNowUpdating ? createEmptyContact() : contactForEdit
    //         );
    //     } catch (err) {
    //         console.log(err.message);
    //     }
    // }

    // function deleteContact(contactId) {
    //     const newContacts = contacts.filter(
    //         (contact) => contact.id !== contactId
    //     );
    //     const isContactNowUpdating = contactForEdit.id === contactId;
    //     setContacts(newContacts);
    //     saveToLocalStorage(newContacts);
    //     setContactForEdit(
    //         isContactNowUpdating ? createEmptyContact() : contactForEdit
    //     );
    // }

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

    // const saveToLocalStorage = (contacts) => {
    //     localStorage.setItem('contacts', JSON.stringify(contacts));
    // };

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
