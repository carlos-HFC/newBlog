import { FC } from 'react'
import { BsHeartFill } from 'react-icons/bs'
import { FaLinkedin, FaGithub } from 'react-icons/fa'

const Footer: FC<{}> = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="socials">
              <a href="https://www.linkedin.com/in/carlos-faustino-992868115/" target="blank" className="social__media">
                <FaLinkedin className="linkedin" />
                <span>LinkedIn</span>
              </a>
              <a href="https://github.com/carlos-HFC" target="blank" className="social__media">
                <FaGithub className="github" />
                <span>GitHub</span>
              </a>
            </div>
            <hr />
            <div className="copyright">
              <small>Feito com <BsHeartFill color="red" /> por Carlos Henrique Faustino Cardoso</small>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
