/*=========================================*/
/*=========================================*/
/*=========================================*/

const ContactForm = () => {
  return (
    <div className="contact-from">
      <div className="row">
        <div className="col-xl-5 col-lg-6 col-md-6 col-sm-12">
          <div className="thumb">
            <img src={
              process.env.PUBLIC_URL + "/assets/images/contact-img.svg"}
              // className='img-fluid'
              alt="single course"
            />
          </div>
        </div>
        <div className="col-xl-7 col-lg-6 col-md-6 col-sm-12">
          <div className="form-box">
            <h3>Get in Touch</h3>
            <form>
              <div className="form-group">
                <input
                  type="text"
                  className="form-control"
                  id="name"
                  placeholder="enter your name"
                />
              </div>
              <div className="form-group">
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  placeholder="enter your email"
                />
              </div>
              <div className="form-group">
                <input
                  type="number"
                  className="form-control"
                  id="password"
                  placeholder="enter your number"
                />
              </div>
              <div className="form-group">
                <input
                  type="password"
                  className="form-control"
                  id="confPass"
                  placeholder="confirm your password"
                />
              </div>
              <div className="form-group file-input">
                <textarea
                  name=""
                  rows="7"
                  id=""
                  placeholder="enter your message"></textarea>
              </div>
              <button
                type="submit"
                className="custom-link border-0"
              >Send Message</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ContactForm;