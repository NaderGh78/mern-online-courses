import './contact-us.css';
import { useTitle } from '../../components/helpers/useTitle';
import ContactForm from '../../components/contact us/ContactForm';
import ContactDetails from '../../components/contact us/ContactDetails';

/*=========================================*/
/*=========================================*/
/*=========================================*/

const ContactUs = () => {

    // get the page title
    useTitle(`Contact`);

    /*=========================================*/

    return (
        <div className='contact custom-div'>
            <div className="container p-0">
                <ContactForm />
                <ContactDetails />
            </div>
        </div>
    )
}

export default ContactUs;