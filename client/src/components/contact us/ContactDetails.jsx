
const ContactDetails = () => {
    return (
        <div className="contact-details">
            <div className="row">
                <div className="col-lg-4 col-md-6 col-sm-12">
                    <div>
                        <h5>phone number</h5>
                        <a href="#">70123456</a>
                        <a href="#">70616161</a>
                    </div>
                </div>
                <div className="col-lg-4 col-md-6 col-sm-12">
                    <div>
                        <h5>email address</h5>
                        <a href="#">example@gmail.com</a>
                        <a href="#">fakeEmail@gmail.com</a>
                    </div>
                </div>
                <div className="col-lg-4 col-md-6 col-sm-12">
                    <div>
                        <h5>office address</h5>
                        <p>Lebanon-Beirut.</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ContactDetails;