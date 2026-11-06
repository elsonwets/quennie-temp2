import { Link } from '@tanstack/react-router'
import { contact, whatsappLink } from '../content'
import { FacebookIcon, InstagramIcon, TikTokIcon, WhatsAppIcon } from './Icons'

export function Footer() {
  return (
    <footer className="footer">
      <div className="footer__grid">
        <div className="footer__col">
          <p className="eyebrow">Navegar</p>
          <Link to="/">Início</Link>
          <Link to="/projetos">Projetos realizados</Link>
          <Link to="/contacto">Pedir orçamento</Link>
        </div>
        <div className="footer__col">
          <p className="eyebrow">Serviços</p>
          <span>Design de Interiores</span>
          <span>Remodelações</span>
          <span>Fabrico de Mobiliário</span>
          <span>Cortinados &amp; Estores</span>
        </div>
        <div className="footer__col">
          <p className="eyebrow">Contacto</p>
          <a href={whatsappLink()} target="_blank" rel="noopener">
            <WhatsAppIcon size={15} /> {contact.whatsappDisplay}
          </a>
          <span>{contact.regions.join(' · ')}</span>
          <div className="footer__social">
            <a href={contact.instagram} target="_blank" rel="noopener" aria-label="Instagram">
              <InstagramIcon />
            </a>
            <a href={contact.facebook} target="_blank" rel="noopener" aria-label="Facebook">
              <FacebookIcon />
            </a>
            <a href={contact.tiktok} target="_blank" rel="noopener" aria-label="TikTok">
              <TikTokIcon />
            </a>
          </div>
        </div>
      </div>
      <p className="footer__word" aria-hidden="true">
        Quennie
      </p>
      <div className="footer__base">
        <span>© {new Date().getFullYear()} Quennie — Home Concept &amp; Interior Design</span>
        <span>Casas · Espaços Comerciais · Hotelaria · Restauração</span>
      </div>
    </footer>
  )
}
